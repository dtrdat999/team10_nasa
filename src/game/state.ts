import type {
  CropId,
  EventId,
  EventPhase,
  GameState,
  GearId,
  PlantState,
  PlotState,
  SchoolLevel,
} from '../types';
import { CROPS } from '../data/crops';
import { EARTH_EVENTS } from '../data/earthEvents';
import { FARM_MISSIONS, ME_MISSIONS } from '../data/missions';

export const XP_PER_LEVEL = 500;
export const RECOVER_SECONDS = 12;
export const SPRINT_SECONDS = 10;
export const PERFECT_BOOST_SECONDS = 90;
export const UNLOCK_LAND_PRICE = 200;
export const WATERING_UPGRADE_PRICE = 100;
export const GEAR_PRICE = 40;
export const DAILY_REWARD = 50;

// step rewards: ME +15/+10, FARM +20/+15, both-correct bonus +10
export const ME_GOLD = 15;
export const ME_XP = 10;
export const FARM_GOLD = 20;
export const FARM_XP = 15;
export const COMBO_BONUS = 10;

const SAVE_KEY = 'earth-farm-save-v2';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function freshPlots(): PlotState[] {
  return [
    {
      id: 0,
      unlocked: true,
      plant: { cropId: 'carrot', progress: 40, status: 'growing', recoverUntil: null, celebrated: false },
    },
    {
      id: 1,
      unlocked: true,
      plant: { cropId: 'tomato', progress: 26, status: 'growing', recoverUntil: null, celebrated: false },
    },
    { id: 2, unlocked: false, plant: null },
    { id: 3, unlocked: false, plant: null },
  ];
}

export function initialState(): GameState {
  return {
    onboarded: false,
    playerName: 'Nông dân nhí',
    schoolLevel: 1,
    gold: 100,
    xp: 0,
    level: 1,
    levelUpKey: 0,
    streak: 1,
    lastVisit: todayISO(),
    day: 1,
    dayEventDone: false,
    plots: freshPlots(),
    inventory: { carrotSeeds: 2, tomatoSeeds: 1, wateringCanLevel: 1, hasMask: false, hasHat: false },
    weather: 'clear',
    eventPhase: 'idle',
    currentEvent: null,
    meResult: null,
    farmResult: null,
    equippedGear: [],
    shadedCrop: null,
    hazeCleared: false,
    eventsCompleted: 0,
    dailyMission: { date: todayISO(), done: 0, target: 1, claimed: false },
    perfectBoostUntil: 0,
    sprintBoostUntil: 0,
    soundOn: true,
    confettiKey: 0,
    shakeKey: 0,
  };
}

export type Action =
  | { type: 'TICK'; dt: number; now: number }
  | { type: 'COMPLETE_ONBOARDING'; name: string; schoolLevel: SchoolLevel }
  | { type: 'PLANT_SEED'; plotId: number; cropId: CropId }
  | { type: 'HARVEST'; plotId: number }
  | { type: 'BUY_SEED'; cropId: CropId }
  | { type: 'BUY_WATERING_UPGRADE' }
  | { type: 'BUY_UNLOCK_LAND' }
  | { type: 'BUY_GEAR'; gear: 'mask' | 'hat' }
  | { type: 'TRIGGER_EVENT'; eventId: EventId; now: number }
  | { type: 'SET_PHASE'; phase: EventPhase }
  | { type: 'ANSWER_ME'; picked: GearId[]; now: number }
  | { type: 'ME_CONTINUE' }
  | { type: 'ANSWER_FARM'; choice: number; now: number }
  | { type: 'FARM_CONTINUE' }
  | { type: 'CLEAR_WEATHER' }
  | { type: 'NEXT_DAY' }
  | { type: 'CLAIM_DAILY' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'DEMO_GROW' }
  | { type: 'RESET' };

export function plantStage(plant: PlantState): number {
  const times = CROPS[plant.cropId].stageTimes;
  if (plant.progress >= times[3]) return 4;
  if (plant.progress >= times[2]) return 3;
  if (plant.progress >= times[1]) return 2;
  if (plant.progress >= times[0]) return 1;
  return 0;
}

/** Per-plant growth multiplier — environment + adaptation tools together. */
export function plantGrowthMultiplier(s: GameState, cropId: CropId, now: number): number {
  let m = 1;
  if (s.inventory.wateringCanLevel >= 2) m *= 1.1;
  if (s.perfectBoostUntil > now) m *= 1.2;
  if (s.sprintBoostUntil > now) m *= 1.5;
  if (s.weather === 'haze' && !s.hazeCleared) m *= 0.85; // dusty leaves photosynthesize less
  if (s.weather === 'heat') {
    if (s.shadedCrop === cropId) m *= 1; // protected by the shade roof
    else m *= cropId === 'tomato' ? 0.7 : 0.9; // tomato suffers most in harsh sun
  }
  return m;
}

/** Is this plant visibly wilting right now? (UV day, unshaded tomato) */
export function isHeatStressed(s: GameState, cropId: CropId): boolean {
  return s.weather === 'heat' && cropId === 'tomato' && s.shadedCrop !== 'tomato';
}

function addXp(s: GameState, amount: number): GameState {
  const xp = s.xp + amount;
  const newLevel = levelFromXp(xp);
  return {
    ...s,
    xp,
    level: newLevel,
    levelUpKey: newLevel > s.level ? s.levelUpKey + 1 : s.levelUpKey,
    confettiKey: newLevel > s.level ? s.confettiKey + 1 : s.confettiKey,
  };
}

function pauseGrowingPlants(s: GameState, now: number): GameState {
  return {
    ...s,
    plots: s.plots.map((p) =>
      p.plant && plantStage(p.plant) < 4
        ? { ...p, plant: { ...p.plant, status: 'recovering' as const, recoverUntil: now + RECOVER_SECONDS * 1000 } }
        : p,
    ),
  };
}

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'TICK': {
      let changed = false;
      const plots = s.plots.map((p) => {
        if (!p.plant) return p;
        let plant = p.plant;
        if (plant.status === 'recovering') {
          if (plant.recoverUntil !== null && a.now >= plant.recoverUntil) {
            changed = true;
            return { ...p, plant: { ...plant, status: 'growing' as const, recoverUntil: null } };
          }
          return p;
        }
        const max = CROPS[plant.cropId].stageTimes[3];
        if (plant.progress >= max) return p;
        const mult = plantGrowthMultiplier(s, plant.cropId, a.now);
        changed = true;
        return { ...p, plant: { ...plant, progress: Math.min(max, plant.progress + a.dt * mult) } };
      });
      return changed ? { ...s, plots } : s;
    }

    case 'COMPLETE_ONBOARDING':
      return { ...s, onboarded: true, playerName: a.name.trim() || 'Nông dân nhí', schoolLevel: a.schoolLevel };

    case 'PLANT_SEED': {
      const plot = s.plots.find((p) => p.id === a.plotId);
      if (!plot || !plot.unlocked || plot.plant) return s;
      const key = a.cropId === 'carrot' ? 'carrotSeeds' : 'tomatoSeeds';
      if (s.inventory[key] <= 0) return s;
      const plant: PlantState = { cropId: a.cropId, progress: 0, status: 'growing', recoverUntil: null, celebrated: false };
      return {
        ...s,
        inventory: { ...s.inventory, [key]: s.inventory[key] - 1 },
        plots: s.plots.map((p) => (p.id === a.plotId ? { ...p, plant } : p)),
      };
    }

    case 'HARVEST': {
      const plot = s.plots.find((p) => p.id === a.plotId);
      if (!plot || !plot.plant || plantStage(plot.plant) < 4) return s;
      const crop = CROPS[plot.plant.cropId];
      const bonus = s.perfectBoostUntil > Date.now() ? 1.1 : 1;
      const gold = Math.round(crop.reward * bonus);
      return addXp(
        { ...s, gold: s.gold + gold, plots: s.plots.map((p) => (p.id === a.plotId ? { ...p, plant: null } : p)) },
        crop.xp,
      );
    }

    case 'BUY_SEED': {
      const crop = CROPS[a.cropId];
      if (s.gold < crop.seedPrice) return s;
      const key = a.cropId === 'carrot' ? 'carrotSeeds' : 'tomatoSeeds';
      return { ...s, gold: s.gold - crop.seedPrice, inventory: { ...s.inventory, [key]: s.inventory[key] + 1 } };
    }

    case 'BUY_WATERING_UPGRADE': {
      if (s.gold < WATERING_UPGRADE_PRICE || s.inventory.wateringCanLevel >= 2) return s;
      return { ...s, gold: s.gold - WATERING_UPGRADE_PRICE, inventory: { ...s.inventory, wateringCanLevel: 2 } };
    }

    case 'BUY_UNLOCK_LAND': {
      const locked = s.plots.find((p) => !p.unlocked);
      if (!locked || s.gold < UNLOCK_LAND_PRICE) return s;
      return {
        ...s,
        gold: s.gold - UNLOCK_LAND_PRICE,
        plots: s.plots.map((p) => (p.id === locked.id ? { ...p, unlocked: true } : p)),
      };
    }

    case 'BUY_GEAR': {
      const key = a.gear === 'mask' ? 'hasMask' : 'hasHat';
      if (s.gold < GEAR_PRICE || s.inventory[key]) return s;
      return { ...s, gold: s.gold - GEAR_PRICE, inventory: { ...s.inventory, [key]: true } };
    }

    case 'TRIGGER_EVENT': {
      if (s.eventPhase !== 'idle' && s.eventPhase !== 'afterglow') return s;
      return {
        ...s,
        currentEvent: a.eventId,
        weather: EARTH_EVENTS[a.eventId].weather,
        eventPhase: 'announce',
        meResult: null,
        farmResult: null,
        equippedGear: [],
        shadedCrop: null,
        hazeCleared: false,
      };
    }

    case 'SET_PHASE':
      return { ...s, eventPhase: a.phase };

    case 'ANSWER_ME': {
      if (!s.currentEvent || s.eventPhase !== 'me_mission' || s.currentEvent === 'perfect_day') return s;
      const mission = ME_MISSIONS[s.currentEvent];
      const correct =
        a.picked.length === mission.correct.length && mission.correct.every((g) => a.picked.includes(g));
      // owning the matching shop gear earns a small bonus
      const ownedBonus =
        correct &&
        ((s.currentEvent === 'poor_air' && s.inventory.hasMask) ||
          (s.currentEvent === 'high_uv' && s.inventory.hasHat))
          ? 10
          : 0;
      const gold = correct ? ME_GOLD + ownedBonus : 0;
      let next: GameState = {
        ...s,
        gold: s.gold + gold,
        eventPhase: 'me_result',
        equippedGear: a.picked,
        confettiKey: correct ? s.confettiKey + 1 : s.confettiKey,
        shakeKey: correct ? s.shakeKey : s.shakeKey + 1,
        meResult: {
          correct,
          gold,
          xp: correct ? ME_XP : 5,
          bonus: ownedBonus,
          explain: correct ? mission.explainCorrect : mission.explainWrong,
        },
      };
      next = addXp(next, correct ? ME_XP : 5);
      return next;
    }

    case 'ME_CONTINUE':
      if (s.eventPhase !== 'me_result') return s;
      return { ...s, eventPhase: 'farm_mission' };

    case 'ANSWER_FARM': {
      if (!s.currentEvent || s.eventPhase !== 'farm_mission') return s;
      const mission = FARM_MISSIONS[s.currentEvent];
      const correct = a.choice === mission.correct;
      const combo = correct && s.meResult?.correct ? COMBO_BONUS : 0;
      const gold = correct ? FARM_GOLD + combo : 0;

      let next: GameState = {
        ...s,
        gold: s.gold + gold,
        eventPhase: 'farm_result',
        eventsCompleted: s.eventsCompleted + 1,
        dayEventDone: true,
        dailyMission:
          s.dailyMission.done < s.dailyMission.target
            ? { ...s.dailyMission, done: s.dailyMission.done + 1 }
            : s.dailyMission,
        confettiKey: correct ? s.confettiKey + 1 : s.confettiKey,
        shakeKey: correct ? s.shakeKey : s.shakeKey + 1,
        sprintBoostUntil: correct ? a.now + SPRINT_SECONDS * 1000 : s.sprintBoostUntil,
        farmResult: {
          correct,
          gold,
          xp: correct ? FARM_XP : 5,
          bonus: combo,
          explain: correct ? mission.explainCorrect : mission.explainWrong,
        },
      };

      // event-specific consequences on the farm world
      switch (s.currentEvent) {
        case 'high_uv':
          // choice 0 = shade tomato (best), 1 = shade carrot (suboptimal), 2 = wrap all (bad)
          if (a.choice === 0) next.shadedCrop = 'tomato';
          else if (a.choice === 1) next.shadedCrop = 'carrot';
          else next = pauseGrowingPlants(next, a.now);
          break;
        case 'poor_air':
          if (correct) next.hazeCleared = true; // washed leaves grow normally again
          else next = pauseGrowingPlants(next, a.now);
          break;
        case 'heavy_rain':
          if (!correct) next = pauseGrowingPlants(next, a.now);
          break;
        case 'perfect_day':
          if (correct) next.perfectBoostUntil = a.now + PERFECT_BOOST_SECONDS * 1000;
          break;
      }

      next = addXp(next, correct ? FARM_XP : 5);
      return next;
    }

    case 'FARM_CONTINUE':
      if (s.eventPhase !== 'farm_result') return s;
      return { ...s, eventPhase: 'afterglow', meResult: null, farmResult: null };

    case 'CLEAR_WEATHER':
      return { ...s, eventPhase: 'idle', currentEvent: null, weather: 'clear' };

    case 'NEXT_DAY':
      const nextDay = s.day + 1;
      return {
        ...s,
        day: nextDay,
        dayEventDone: false,
        dailyMission: { date: `earth-day-${nextDay}`, done: 0, target: 1, claimed: false },
        weather: 'clear',
        eventPhase: 'idle',
        currentEvent: null,
        meResult: null,
        farmResult: null,
        equippedGear: [],
        shadedCrop: null,
        hazeCleared: false,
      };

    case 'CLAIM_DAILY': {
      const d = s.dailyMission;
      if (d.claimed || d.done < d.target) return s;
      return { ...s, gold: s.gold + DAILY_REWARD, dailyMission: { ...d, claimed: true }, confettiKey: s.confettiKey + 1 };
    }

    case 'TOGGLE_SOUND':
      return { ...s, soundOn: !s.soundOn };

    case 'DEMO_GROW': {
      const plots = s.plots.map((p) => {
        if (!p.plant) return p;
        const times = CROPS[p.plant.cropId].stageTimes;
        const stage = plantStage(p.plant);
        if (stage >= 4) return p;
        return { ...p, plant: { ...p.plant, status: 'growing' as const, recoverUntil: null, progress: times[stage] } };
      });
      return { ...s, plots };
    }

    case 'RESET':
      return initialState();

    default:
      return s;
  }
}

// ===== persistence =====

export function saveGame(s: GameState): void {
  try {
    const snapshot: GameState = {
      ...s,
      weather: 'clear',
      eventPhase: 'idle',
      currentEvent: null,
      meResult: null,
      farmResult: null,
      equippedGear: [],
      shadedCrop: null,
      hazeCleared: false,
      perfectBoostUntil: 0,
      sprintBoostUntil: 0,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
  } catch {
    /* storage unavailable — keep playing in memory */
  }
}

export function loadGame(): GameState {
  const base = initialState();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<GameState>;
    const s: GameState = {
      ...base,
      ...saved,
      weather: 'clear',
      eventPhase: 'idle',
      currentEvent: null,
      meResult: null,
      farmResult: null,
      equippedGear: [],
      shadedCrop: null,
      hazeCleared: false,
    };
    const today = todayISO();
    if (s.lastVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      s.streak = s.lastVisit === yesterday ? s.streak + 1 : 1;
      s.lastVisit = today;
    }
    if (s.dailyMission.date !== today) {
      s.dailyMission = { date: today, done: 0, target: 1, claimed: false };
    }
    s.plots = s.plots.map((p) =>
      p.plant ? { ...p, plant: { ...p.plant, status: 'growing', recoverUntil: null } } : p,
    );
    s.level = levelFromXp(s.xp);
    return s;
  } catch {
    return base;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}

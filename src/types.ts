// ===== Earth Farm v2 — shared types =====

/** 1 = Beginner, 2 = Explorer, 3 = Scientist */
export type SchoolLevel = 1 | 2 | 3;

export type CropId = 'carrot' | 'tomato';

/** 0 seed → 1 sprout → 2 young → 3 mature → 4 harvest-ready */
export type PlantStage = 0 | 1 | 2 | 3 | 4;

export type WeatherKind = 'clear' | 'haze' | 'heat' | 'rain' | 'perfect';

export type EventId = 'poor_air' | 'high_uv' | 'heavy_rain' | 'perfect_day';

/** Phases of an Earth Event: announce → buddy → ME step → FARM step → afterglow */
export type EventPhase =
  | 'idle'
  | 'announce'
  | 'buddy'
  | 'me_mission'
  | 'me_result'
  | 'farm_mission'
  | 'farm_result'
  | 'afterglow';

export type GearId =
  | 'mask'
  | 'hat'
  | 'water'
  | 'umbrella'
  | 'boots'
  | 'raincoat'
  | 'flashlight'
  | 'kite'
  | 'fan'
  | 'indoor'
  | 'sunglasses';

export interface GearCard {
  id: GearId;
  icon: string;
  label: string;
}

export interface CropDef {
  id: CropId;
  name: string;
  emoji: string;
  /** one-line personality used in teaching copy */
  trait: string;
  /** cumulative seconds to reach stage 1..4 (prototype-fast) */
  stageTimes: [number, number, number, number];
  reward: number;
  xp: number;
  seedPrice: number;
}

export interface PlantState {
  cropId: CropId;
  progress: number;
  status: 'growing' | 'recovering';
  recoverUntil: number | null;
  celebrated: boolean;
}

export interface PlotState {
  id: number;
  unlocked: boolean;
  plant: PlantState | null;
}

/**
 * One normalized daily environment sample (mock for the prototype;
 * shaped so a RealEnvironmentProvider can slot in later).
 */
export interface EnvironmentSnapshot {
  day: number;
  location: string;
  eventId: EventId;
  aqi: number;
  aqiStatus: string; // Good / Moderate / Poor...
  pm25: number; // µg/m³
  uv: number; // UV index
  tempC: number;
  rainMm: number;
  /** which monitor row should glow today */
  highlight: 'aqi' | 'uv' | 'rain' | 'temp' | 'none';
  statusEn: string;
  statusVi: string;
}

export interface MeMissionDef {
  prompt: Record<SchoolLevel, string>;
  gear: GearCard[]; // 4 cards
  correct: GearId[]; // exactly 2
  explainCorrect: string;
  explainWrong: string;
  /** the real-life health takeaway, always shown */
  advice: string;
}

export interface FarmMissionDef {
  question: Record<SchoolLevel, string>;
  options: [string, string, string];
  correct: number;
  explainCorrect: string;
  explainWrong: string;
}

export interface EarthEventDef {
  id: EventId;
  banner: string;
  bannerVi: string;
  icon: string;
  weather: WeatherKind;
  danger: boolean;
  /** perfect day skips the ME step */
  hasMe: boolean;
  buddyIntro: [string, string];
}

export interface DailyMissionState {
  date: string;
  done: number;
  target: number;
  claimed: boolean;
}

export interface InventoryState {
  carrotSeeds: number;
  tomatoSeeds: number;
  wateringCanLevel: number;
  hasMask: boolean;
  hasHat: boolean;
}

export interface StepResult {
  correct: boolean;
  gold: number;
  xp: number;
  bonus: number;
  explain: string;
}

export interface GameState {
  onboarded: boolean;
  playerName: string;
  schoolLevel: SchoolLevel;
  gold: number;
  xp: number;
  level: number;
  levelUpKey: number;
  streak: number;
  lastVisit: string;
  /** in-game Earth Day counter (mock data script is keyed on this) */
  day: number;
  /** true once today's Earth Event has been played through */
  dayEventDone: boolean;
  plots: PlotState[];
  inventory: InventoryState;
  weather: WeatherKind;
  eventPhase: EventPhase;
  currentEvent: EventId | null;
  meResult: StepResult | null;
  farmResult: StepResult | null;
  /** gear the player picked in today's ME step */
  equippedGear: GearId[];
  /** crop currently protected by the shade roof (High UV farm action) */
  shadedCrop: CropId | null;
  /** poor-air day: correct farm action restores normal growth */
  hazeCleared: boolean;
  eventsCompleted: number;
  dailyMission: DailyMissionState;
  perfectBoostUntil: number;
  sprintBoostUntil: number;
  soundOn: boolean;
  confettiKey: number;
  shakeKey: number;
}

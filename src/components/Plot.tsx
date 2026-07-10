import { useEffect, useRef, useState } from 'react';
import type { CropId, PlotState } from '../types';
import { CROPS, STAGE_NAMES } from '../data/crops';
import { isHeatStressed, plantStage, UNLOCK_LAND_PRICE } from '../game/state';
import { useGame } from '../game/GameContext';
import { useFx } from './FxLayer';
import { PlantArt } from './PlantArt';
import { sound } from '../utils/sound';

function fmtTime(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function Plot({ plot, now }: { plot: PlotState; now: number }) {
  const { state, dispatch } = useGame();
  const fx = useFx();
  const [menuOpen, setMenuOpen] = useState(false);
  const [wiggle, setWiggle] = useState(0);
  const [needGold, setNeedGold] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const prevStage = useRef<number>(plot.plant ? plantStage(plot.plant) : -1);
  const [stagePop, setStagePop] = useState(0);

  const plant = plot.plant;
  const stage = plant ? plantStage(plant) : -1;

  // pop animation whenever the plant advances a stage
  useEffect(() => {
    if (stage !== prevStage.current) {
      if (plant && stage > prevStage.current && prevStage.current >= 0) {
        setStagePop((k) => k + 1);
        sound.pop();
      }
      prevStage.current = stage;
    }
  }, [stage, plant]);

  const center = () => {
    const r = rootRef.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  };

  const handleUnlock = () => {
    if (state.gold >= UNLOCK_LAND_PRICE) {
      dispatch({ type: 'BUY_UNLOCK_LAND' });
      sound.success();
      const { x, y } = center();
      fx.floatText(x, y - 20, '🔓 Đất mới!', 'text');
    } else {
      sound.wrong();
      setNeedGold(UNLOCK_LAND_PRICE - state.gold);
      window.setTimeout(() => setNeedGold(null), 1800);
    }
  };

  const handleHarvest = () => {
    if (!plant || stage < 4) return;
    const crop = CROPS[plant.cropId];
    dispatch({ type: 'HARVEST', plotId: plot.id });
    sound.harvest();
    const { x, y } = center();
    fx.coins(x, y - 30, 7);
    const bonus = state.perfectBoostUntil > now ? 1.1 : 1;
    fx.floatText(x, y - 70, `+${Math.round(crop.reward * bonus)} 🪙`, 'text');
    fx.floatText(x + 46, y - 46, `+${crop.xp} XP`, 'xp');
  };

  const handlePlant = (cropId: CropId) => {
    dispatch({ type: 'PLANT_SEED', plotId: plot.id, cropId });
    sound.pop();
    setMenuOpen(false);
    const { x, y } = center();
    fx.splash(x, y - 20);
  };

  if (!plot.unlocked) {
    return (
      <div ref={rootRef} className="plot plot-locked" onClick={handleUnlock} title="Mở khóa ô đất">
        <div className="plot-tile locked-tile" />
        <div className="locked-label">
          <span className="lock-ico">🔒</span>
          <span className="lock-price">{UNLOCK_LAND_PRICE} 🪙</span>
        </div>
        {needGold !== null && <div className="need-gold-tip">Bạn cần thêm {needGold} Gold.</div>}
      </div>
    );
  }

  // empty plot
  if (!plant) {
    const carrotSeeds = state.inventory.carrotSeeds;
    const tomatoSeeds = state.inventory.tomatoSeeds;
    return (
      <div ref={rootRef} className="plot plot-empty">
        <div
          className="plot-tile"
          onClick={() => {
            sound.click();
            setMenuOpen((o) => !o);
          }}
        />
        <button
          className="plant-plus"
          onClick={() => {
            sound.click();
            setMenuOpen((o) => !o);
          }}
        >
          🌱 Gieo hạt
        </button>
        {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />}
        {menuOpen && (
          <div className="seed-menu">
            <div className="seed-menu-title">🌱 GIEO HẠT</div>
            <div className="seed-slots">
              <button className="seed-slot" disabled={carrotSeeds <= 0} onClick={() => handlePlant('carrot')}>
                <span className="slot-icon">🥕</span>
                <span className="slot-name">Cà rốt</span>
                <span className="slot-count">x{carrotSeeds}</span>
              </button>
              <button className="seed-slot" disabled={tomatoSeeds <= 0} onClick={() => handlePlant('tomato')}>
                <span className="slot-icon">🍅</span>
                <span className="slot-name">Cà chua</span>
                <span className="slot-count">x{tomatoSeeds}</span>
              </button>
            </div>
            {carrotSeeds <= 0 && tomatoSeeds <= 0 && <div className="seed-hint">Hết hạt giống — ghé SHOP nhé!</div>}
          </div>
        )}
      </div>
    );
  }

  // planted
  const crop = CROPS[plant.cropId];
  const times = crop.stageTimes;
  const total = times[3];
  const pct = Math.min(100, (plant.progress / total) * 100);
  const nextThreshold = stage < 4 ? times[stage] : total;
  const secsToNext = nextThreshold - plant.progress;
  const recovering = plant.status === 'recovering';
  const recoverLeft = recovering && plant.recoverUntil ? (plant.recoverUntil - now) / 1000 : 0;
  const ready = stage >= 4;
  const shaded = state.shadedCrop === plant.cropId;
  const stressed = !shaded && isHeatStressed(state, plant.cropId);

  return (
    <div ref={rootRef} className={`plot ${ready ? 'plot-ready' : ''}`}>
      <div className="plot-tile planted-tile" />
      {shaded && (
        <div className="plot-roof" aria-hidden>
          <svg viewBox="0 0 200 90" className="roof-svg">
            <path d="M12 40 V82 M188 40 V82" stroke="#8a5636" strokeWidth="7" strokeLinecap="round" />
            <path d="M4 42 Q100 2 196 42 L196 30 Q100 -12 4 30 Z" fill="#f4f0e2" stroke="#5e4025" strokeWidth="3" />
            <path d="M28 12 q8 22 4 27 M64 4 q6 24 3 32 M100 2 q0 24 0 33 M136 4 q-6 24 -3 32 M172 12 q-8 22 -4 27" stroke="#e2632f" strokeWidth="9" fill="none" opacity="0.85" />
          </svg>
        </div>
      )}
      <div
        key={stagePop}
        className={`plant-wrap stage-pop ${wiggle ? 'wiggle' : ''} ${recovering || stressed ? 'droopy' : ''}`}
        onClick={() => {
          if (ready) {
            handleHarvest();
            return;
          }
          sound.click();
          setWiggle((w) => w + 1);
          window.setTimeout(() => setWiggle(0), 500);
        }}
        title={`${crop.name} — ${STAGE_NAMES[stage]}`}
      >
        <PlantArt crop={plant.cropId} stage={stage} />
      </div>

      {ready ? (
        <button className="btn btn-harvest" onClick={handleHarvest}>
          🧺 THU HOẠCH
        </button>
      ) : recovering ? (
        <div className="plot-status recovering">
          <span className="rec-ico">💫</span> Recovering… {Math.ceil(recoverLeft)}s
        </div>
      ) : (
        <div className="plot-status">
          <div className="grow-bar">
            <div className="grow-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="grow-time">
            {crop.emoji} Next growth: {fmtTime(secsToNext)}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useGame } from '../game/GameContext';
import { clearSave } from '../game/state';
import type { EventId } from '../types';
import { sound } from '../utils/sound';

const TRIGGERS: { id: EventId; label: string }[] = [
  { id: 'poor_air', label: '😷 Poor Air Quality' },
  { id: 'high_uv', label: '☀️ High UV / Heat' },
  { id: 'heavy_rain', label: '🌧️ Heavy Rain' },
  { id: 'perfect_day', label: '🌈 Perfect Growing Day' },
];

/** Hidden control panel for live demos — toggle with the button or the D key. */
export function DemoPanel() {
  const { state, dispatch } = useGame();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (e.key.toLowerCase() === 'd') setOpen((o) => !o);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const busy = ['me_mission', 'me_result', 'farm_mission', 'farm_result'].includes(state.eventPhase);

  return (
    <>
      <button className="demo-toggle" title="Demo Mode (phím D)" onClick={() => setOpen((o) => !o)}>
        🛠️
      </button>
      {open && (
        <div className="demo-panel">
          <div className="demo-head">
            🛠️ DEMO MODE <span className="demo-hint">(phím D)</span>
          </div>
          {TRIGGERS.map((t) => (
            <button
              key={t.id}
              className="demo-btn"
              disabled={busy}
              onClick={() => {
                sound.alert();
                dispatch({ type: 'TRIGGER_EVENT', eventId: t.id, now: Date.now() });
              }}
            >
              {t.label}
            </button>
          ))}
          <hr className="demo-sep" />
          <button
            className="demo-btn"
            disabled={busy}
            onClick={() => {
              sound.pop();
              dispatch({ type: 'NEXT_DAY' });
            }}
          >
            🌙 Next Day (Ngày {state.day + 1})
          </button>
          <button
            className="demo-btn"
            onClick={() => {
              sound.pop();
              dispatch({ type: 'DEMO_GROW' });
            }}
          >
            🌱 Grow Plant (+1 stage)
          </button>
          <button
            className="demo-btn demo-danger"
            onClick={() => {
              clearSave();
              dispatch({ type: 'RESET' });
              setOpen(false);
            }}
          >
            🔄 Reset Game
          </button>
        </div>
      )}
    </>
  );
}

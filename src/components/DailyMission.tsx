import { useGame } from '../game/GameContext';
import { DAILY_REWARD } from '../game/state';
import { useFx } from './FxLayer';
import { sound } from '../utils/sound';

export function DailyMission() {
  const { state, dispatch } = useGame();
  const fx = useFx();
  const d = state.dailyMission;
  const done = d.done >= d.target;

  return (
    <aside className={`daily-card ${done && !d.claimed ? 'daily-glow' : ''}`}>
      <div className="daily-head">📌 TODAY&apos;S MISSION</div>
      <div className="daily-task">Hoàn thành 1 Earth Event</div>
      <div className="daily-progress-row">
        <div className="daily-bar">
          <div className="daily-fill" style={{ width: `${(Math.min(d.done, d.target) / d.target) * 100}%` }} />
        </div>
        <span className="daily-count">
          {Math.min(d.done, d.target)} / {d.target}
        </span>
      </div>
      {d.claimed ? (
        <div className="daily-claimed">✅ Đã nhận thưởng hôm nay!</div>
      ) : done ? (
        <button
          className="btn btn-gold btn-claim"
          onClick={(e) => {
            dispatch({ type: 'CLAIM_DAILY' });
            sound.coin();
            fx.coins(e.clientX, e.clientY, 6);
            fx.floatText(e.clientX, e.clientY - 40, `+${DAILY_REWARD} 🪙`);
          }}
        >
          🎁 Mission Complete! Nhận +{DAILY_REWARD} 🪙
        </button>
      ) : (
        <div className="daily-reward">Phần thưởng: +{DAILY_REWARD} 🪙</div>
      )}
    </aside>
  );
}

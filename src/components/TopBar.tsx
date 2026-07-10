import { useEffect, useRef, useState } from 'react';
import { useGame } from '../game/GameContext';
import { XP_PER_LEVEL } from '../game/state';
import { sound } from '../utils/sound';

export function TopBar({ onOpenShop }: { onOpenShop: () => void }) {
  const { state, dispatch } = useGame();
  const xpInLevel = state.xp % XP_PER_LEVEL;
  const [goldPulse, setGoldPulse] = useState(false);
  const prevGold = useRef(state.gold);

  useEffect(() => {
    if (state.gold !== prevGold.current) {
      prevGold.current = state.gold;
      setGoldPulse(true);
      const id = window.setTimeout(() => setGoldPulse(false), 600);
      return () => window.clearTimeout(id);
    }
  }, [state.gold]);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="avatar">{state.playerName.trim().charAt(0).toUpperCase() || 'E'}</div>
        <div className="player-meta">
          <div className="player-name">{state.playerName}</div>
          <div className="player-level-row">
            <span className="level-badge">Lv {state.level}</span>
            <div className="xp-bar" title={`XP: ${xpInLevel} / ${XP_PER_LEVEL}`}>
              <div className="xp-fill" style={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%` }} />
            </div>
            <span className="xp-text">{xpInLevel}/{XP_PER_LEVEL}</span>
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <div className={`chip chip-gold ${goldPulse ? 'pulse' : ''}`} id="gold-chip" title="Vàng">
          <span className="chip-icon">🪙</span> {state.gold}
        </div>
        <div className="chip chip-streak" title="Chuỗi ngày quay lại">
          🔥 {state.streak} ngày
        </div>
        <button
          className="chip chip-btn"
          title={state.soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          onClick={() => {
            dispatch({ type: 'TOGGLE_SOUND' });
            sound.click();
          }}
        >
          {state.soundOn ? '🔊' : '🔇'}
        </button>
        <button
          className="btn btn-shop"
          onClick={() => {
            sound.click();
            onOpenShop();
          }}
        >
          🛒 SHOP
        </button>
      </div>
    </header>
  );
}

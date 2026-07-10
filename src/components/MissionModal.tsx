import { useEffect, useRef, useState } from 'react';
import type { EventId, GearId } from '../types';
import { useGame } from '../game/GameContext';
import { EARTH_EVENTS } from '../data/earthEvents';
import { FARM_MISSIONS, ME_MISSIONS } from '../data/missions';
import { environmentProvider } from '../data/environment';
import { useFx } from './FxLayer';
import { KidAvatar } from './KidAvatar';
import { sound } from '../utils/sound';

interface FarmActionCard {
  option: number;
  toolIcon: string;
  target: string;
  action: string;
  hint: string;
}

const FARM_ACTIONS: Record<EventId, [FarmActionCard, FarmActionCard, FarmActionCard]> = {
  poor_air: [
    { option: 0, toolIcon: '💧', target: 'Lá cây bị bụi', action: 'Tưới nhẹ rửa lá', hint: 'Giúp lá nhận ánh sáng trở lại' },
    { option: 1, toolIcon: '🔥', target: 'Rìa vườn', action: 'Đốt rơm cho ấm', hint: 'Tạo thêm khói bụi' },
    { option: 2, toolIcon: '⏳', target: 'Cả nông trại', action: 'Chờ tự hết bụi', hint: 'Cây tiếp tục quang hợp kém' },
  ],
  high_uv: [
    { option: 0, toolIcon: '⛱️', target: 'Luống cà chua', action: 'Dựng mái che', hint: 'Cà chua sợ nắng gắt nhất' },
    { option: 1, toolIcon: '⛱️', target: 'Luống cà rốt', action: 'Che cà rốt', hint: 'Cà rốt chịu hạn tốt hơn' },
    { option: 2, toolIcon: '🧴', target: 'Cả hai luống', action: 'Phủ kín nilon', hint: 'Dễ làm cây bí nóng' },
  ],
  heavy_rain: [
    { option: 0, toolIcon: '🕳️', target: 'Rãnh thoát nước', action: 'Khơi rãnh', hint: 'Cứu rễ cây khỏi ngập úng' },
    { option: 1, toolIcon: '🚿', target: 'Đất đang ướt', action: 'Tưới thêm nước', hint: 'Làm rễ càng thiếu oxy' },
    { option: 2, toolIcon: '🧴', target: 'Mặt luống', action: 'Phủ giữ nước', hint: 'Giữ nước lại quanh rễ' },
  ],
  perfect_day: [
    { option: 0, toolIcon: '🌱', target: 'Ô đất trống', action: 'Gieo thêm cây', hint: 'Tận dụng ngày điều kiện tốt' },
    { option: 1, toolIcon: '🛌', target: 'Nông trại', action: 'Bỏ qua hôm nay', hint: 'Lỡ mất cơ hội tăng trưởng' },
    { option: 2, toolIcon: '🧺', target: 'Cây đang lớn', action: 'Nhổ trồng lại', hint: 'Làm mất tiến độ cây' },
  ],
};

/** Two-step Earth Event flow: ME (protection) → MY FARM (adaptation). */
export function MissionModal() {
  const { state, dispatch } = useGame();
  const fx = useFx();
  const modalRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<GearId[]>([]);

  const phase = state.eventPhase;

  // fresh gear picks every time a ME step opens
  useEffect(() => {
    if (phase === 'me_mission') setPicked([]);
  }, [phase]);

  const open = phase === 'me_mission' || phase === 'me_result' || phase === 'farm_mission' || phase === 'farm_result';
  if (!open || !state.currentEvent) return null;

  const event = EARTH_EVENTS[state.currentEvent];
  const snap = environmentProvider.getSnapshot(state.day);
  const level = state.schoolLevel;

  const burstCoins = () => {
    const rect = modalRef.current?.getBoundingClientRect();
    fx.coins(rect ? rect.left + rect.width / 2 : window.innerWidth / 2, rect ? rect.top + 40 : 200, 7);
  };

  const togglePick = (g: GearId) => {
    sound.click();
    setPicked((prev) => {
      if (prev.includes(g)) return prev.filter((x) => x !== g);
      if (prev.length >= 2) return [prev[1], g]; // keep it to 2: swap the oldest
      return [...prev, g];
    });
  };

  const submitMe = () => {
    if (picked.length !== 2 || state.currentEvent === 'perfect_day' || !state.currentEvent) return;
    const mission = ME_MISSIONS[state.currentEvent];
    const correct = mission.correct.every((g) => picked.includes(g));
    dispatch({ type: 'ANSWER_ME', picked, now: Date.now() });
    if (correct) {
      sound.success();
      window.setTimeout(() => sound.coin(), 300);
      burstCoins();
    } else {
      sound.wrong();
    }
  };

  const answerFarm = (choice: number) => {
    if (!state.currentEvent) return;
    const mission = FARM_MISSIONS[state.currentEvent];
    const correct = choice === mission.correct;
    dispatch({ type: 'ANSWER_FARM', choice, now: Date.now() });
    if (correct) {
      sound.success();
      window.setTimeout(() => sound.coin(), 300);
      burstCoins();
      if (state.currentEvent === 'poor_air') {
        fx.splash(window.innerWidth / 2, window.innerHeight * 0.65);
        fx.floatText(window.innerWidth / 2, window.innerHeight * 0.6, '💚 Lá sạch bụi rồi!', 'text');
      }
    } else {
      sound.wrong();
    }
  };

  // ---------- ME: protection mission ----------
  if (phase === 'me_mission' && state.currentEvent !== 'perfect_day') {
    const mission = ME_MISSIONS[state.currentEvent];
    return (
      <div className="modal-backdrop mission-backdrop">
        <div ref={modalRef} className="modal mission-modal">
          <div className="mission-tag tag-me">{event.icon} BƯỚC 1 · BẢO VỆ BẢN THÂN</div>
          <h2 className="mission-title">ME · EM CHUẨN BỊ GÌ?</h2>
          <div className="me-layout">
            <div className="kid-box">
              <KidAvatar gear={picked} />
            </div>
            <div className="me-right">
              <p className="mission-question">{mission.prompt[level]}</p>
              <div className="gear-grid">
                {mission.gear.map((g) => (
                  <button
                    key={g.id}
                    className={`gear-card ${picked.includes(g.id) ? 'picked' : ''}`}
                    onClick={() => togglePick(g.id)}
                  >
                    <span className="gear-icon">{g.icon}</span>
                    <span className="gear-label">{g.label}</span>
                    {picked.includes(g.id) && <span className="gear-check">✔</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pick-hint">Chọn 2 thứ em sẽ chuẩn bị ({picked.length}/2)</div>
          <button className="btn btn-primary" disabled={picked.length !== 2} onClick={submitMe}>
            Ra ngoài thôi! 🚪
          </button>
        </div>
      </div>
    );
  }

  // ---------- ME result ----------
  if (phase === 'me_result' && state.meResult && state.currentEvent !== 'perfect_day') {
    const r = state.meResult;
    const mission = ME_MISSIONS[state.currentEvent];
    return (
      <div className="modal-backdrop mission-backdrop">
        <div ref={modalRef} className={`modal mission-modal ${r.correct ? '' : 'shake-it'}`}>
          <div className={`result-big ${r.correct ? 'good' : 'miss'}`}>
            {r.correct ? '🌟 CHUẨN BỊ HOÀN HẢO!' : '🤔 Almost! Cùng xem lại nhé.'}
          </div>
          <div className="kid-box kid-box-result">
            <KidAvatar gear={r.correct ? mission.correct : state.equippedGear} happy={r.correct} />
          </div>
          <div className="reward-row">
            {r.gold > 0 && <span className="reward-chip gold">+{r.gold} 🪙</span>}
            <span className="reward-chip xp">+{r.xp} XP</span>
            {r.bonus > 0 && <span className="reward-chip combo">🎒 Đồ xịn +{r.bonus}</span>}
          </div>
          <p className="result-explain">
            <b>🛰️ BUDDY:</b> {r.explain}
          </p>
          <div className="advice-line">💡 {mission.advice}</div>
          <button
            className="btn btn-primary"
            onClick={() => {
              sound.click();
              dispatch({ type: 'ME_CONTINUE' });
            }}
          >
            Đến nông trại 🌾
          </button>
        </div>
      </div>
    );
  }

  // ---------- FARM mission ----------
  if (phase === 'farm_mission') {
    const mission = FARM_MISSIONS[state.currentEvent];
    return (
      <div className="modal-backdrop mission-backdrop">
        <div ref={modalRef} className="modal mission-modal">
          <div className="mission-tag tag-farm">{event.icon} {event.hasMe ? 'BƯỚC 2 · ' : ''}NÔNG TRẠI CỦA EM</div>
          <h2 className="mission-title">MY FARM · EM QUYẾT ĐỊNH GÌ?</h2>
          <div className="mission-data-chip">
            🛰️ {snap.statusEn} · {snap.highlight === 'aqi' && `PM2.5: ${snap.pm25} µg/m³`}
            {snap.highlight === 'uv' && `UV Index: ${snap.uv}`}
            {snap.highlight === 'rain' && `Rainfall: ${snap.rainMm} mm`}
            {snap.highlight === 'none' && `${snap.tempC}°C · ${snap.rainMm} mm`}
          </div>
          <p className="mission-question">{mission.question[level]}</p>
          <div className="farm-action-stage">
            <div className="farm-action-shelf">
              <span className="shelf-label">Chọn tool và nơi dùng</span>
              <span className="shelf-note">Kết quả sẽ hiện ngay trên nông trại</span>
            </div>
            <div className="farm-action-grid">
              {FARM_ACTIONS[state.currentEvent].map((card, i) => (
                <button
                  key={card.option}
                  className="farm-action-card"
                  style={{ animationDelay: `${i * 90}ms` }}
                  onClick={() => answerFarm(card.option)}
                  aria-label={mission.options[card.option]}
                >
                  <span className="farm-tool-icon">{card.toolIcon}</span>
                  <span className="farm-action-main">
                    <b>{card.action}</b>
                    <small>{card.target}</small>
                  </span>
                  <span className="farm-action-hint">{card.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- FARM result ----------
  if (phase === 'farm_result' && state.farmResult) {
    const r = state.farmResult;
    return (
      <div className="modal-backdrop mission-backdrop">
        <div ref={modalRef} className={`modal mission-modal ${r.correct ? '' : 'shake-it'}`}>
          <div className={`result-big ${r.correct ? 'good' : 'miss'}`}>
            {r.correct ? '🌟 GREAT DECISION!' : '🌦️ Almost! Let’s learn.'}
          </div>
          <div className="reward-row">
            {r.gold > 0 && <span className="reward-chip gold">+{r.gold} 🪙</span>}
            <span className="reward-chip xp">+{r.xp} XP</span>
            {r.bonus > 0 && <span className="reward-chip combo">🔥 Combo ME+FARM +{r.bonus}</span>}
          </div>
          <p className="result-explain">
            <b>🛰️ BUDDY:</b> {r.explain}
          </p>
          {r.correct ? (
            <div className="result-note good">
              {state.currentEvent === 'high_uv' && '⛱️ Mái che đã dựng trên luống cà chua!'}
              {state.currentEvent === 'poor_air' && '💧 Lá được rửa sạch — cây quang hợp bình thường trở lại!'}
              {state.currentEvent === 'heavy_rain' && '🕳️ Rãnh thoát nước hoạt động — rễ cây an toàn!'}
              {state.currentEvent === 'perfect_day' && '⚡ Cây lớn nhanh hơn 20% và thu hoạch +10% hôm nay!'}
            </div>
          ) : (
            EARTH_EVENTS[state.currentEvent].danger && (
              <div className="result-note miss">💫 Cây cần nghỉ một chút để hồi phục (Recovering)…</div>
            )
          )}
          <button
            className="btn btn-primary"
            onClick={() => {
              sound.click();
              dispatch({ type: 'FARM_CONTINUE' });
              setPicked([]);
            }}
          >
            Tiếp tục chăm sóc 🌱
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/** Big banner sliding in when a new Earth Event is detected. */
export function EventBanner() {
  const { state } = useGame();
  if (state.eventPhase !== 'announce' || !state.currentEvent) return null;
  const event = EARTH_EVENTS[state.currentEvent];
  return (
    <div className={`event-banner ${event.danger ? 'danger' : 'nice'}`}>
      <span className="banner-icon">{event.icon}</span>
      <div>
        <div className="banner-title">{event.banner}</div>
        <div className="banner-sub">{event.bannerVi}</div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { SchoolLevel } from '../types';
import { useGame } from '../game/GameContext';
import { BuddyBot } from './BuddyBot';
import { sound } from '../utils/sound';

const LEVELS: { value: SchoolLevel; icon: string; label: string; desc: string }[] = [
  { value: 1, icon: '🌱', label: 'Beginner', desc: 'Câu hỏi ngắn, trực quan' },
  { value: 2, icon: '🚀', label: 'Explorer', desc: 'Suy luận với dữ liệu cơ bản' },
  { value: 3, icon: '🛰️', label: 'Scientist', desc: 'So sánh dữ liệu như nhà khoa học' },
];

export function Onboarding() {
  const { dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<SchoolLevel | null>(null);
  const [name, setName] = useState('');

  const next = () => {
    sound.click();
    setStep((s) => s + 1);
  };

  return (
    <div className="onboarding">
      <div className="stars" />
      <div className="ob-card" key={step}>
        {step === 0 && (
          <>
            <div className="ob-logo">
              <span className="ob-earth">🌍</span>
              <span className="ob-sprout">🌱</span>
            </div>
            <h1 className="ob-title">EARTH FARM</h1>
            <p className="ob-tagline">Learn from Earth. Grow your world.</p>
            <p className="ob-sub">“Build your farm with data from Earth.”</p>
            <div className="team-badge">🚀 Team 10</div>
            <button className="btn btn-primary btn-big" onClick={next}>
              BẮT ĐẦU 🚀
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="ob-h2">Em muốn chơi ở chế độ nào?</h2>
            <div className="level-grid">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  className={`level-card ${level === l.value ? 'selected' : ''}`}
                  onClick={() => {
                    sound.click();
                    setLevel(l.value);
                  }}
                >
                  <span className="level-icon">{l.icon}</span>
                  <span className="level-name">{l.label}</span>
                  <span className="level-desc">{l.desc}</span>
                </button>
              ))}
            </div>
            <input
              className="name-input"
              placeholder="Tên của em (không bắt buộc)"
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-primary btn-big" disabled={level === null} onClick={next}>
              Tiếp tục ➜
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="ob-buddy">
              <BuddyBot />
            </div>
            <p className="ob-speech">
              “Chào mừng em! Mình là <b>BUDDY</b> 🛰️ — nông trại này sẽ thay đổi dựa trên những gì đang xảy ra trên{' '}
              <b>Trái Đất</b>.”
            </p>
            <button className="btn btn-primary btn-big" onClick={next}>
              Chào Buddy! 👋
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="ob-icons">🛰️ 😷 ☀️ 🌧️</div>
            <p className="ob-speech">
              “Vệ tinh và trạm quan trắc giúp chúng ta hiểu <b>không khí</b>, <b>tia UV</b>, <b>mưa</b> và{' '}
              <b>nhiệt độ</b> — để bảo vệ <b>chính em</b> và <b>nông trại của em</b>.”
            </p>
            <button className="btn btn-primary btn-big" onClick={next}>
              Hay quá! ➜
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <div className="ob-motto">
              <span>👀 Quan sát.</span>
              <span>🧠 Suy nghĩ.</span>
              <span>🌱 Hành động.</span>
            </div>
            <button
              className="btn btn-primary btn-big"
              onClick={() => {
                sound.success();
                dispatch({ type: 'COMPLETE_ONBOARDING', name, schoolLevel: level ?? 1 });
              }}
            >
              VÀO NÔNG TRẠI 🏡
            </button>
          </>
        )}

        <div className="ob-dots">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`ob-dot ${i === step ? 'on' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

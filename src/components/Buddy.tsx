import { useEffect, useState } from 'react';
import { useGame } from '../game/GameContext';
import { EARTH_EVENTS } from '../data/earthEvents';
import { ME_MISSIONS } from '../data/missions';
import { BuddyBot } from './BuddyBot';

/** Reveal text one character at a time. */
function useTypewriter(text: string, cps = 38): string {
  const [len, setLen] = useState(0);
  useEffect(() => {
    setLen(0);
    if (!text) return;
    const id = window.setInterval(() => {
      setLen((l) => {
        if (l >= text.length) {
          window.clearInterval(id);
          return l;
        }
        return l + 1;
      });
    }, 1000 / cps);
    return () => window.clearInterval(id);
  }, [text, cps]);
  return text.slice(0, len);
}

export function Buddy() {
  const { state } = useGame();
  const event = state.currentEvent ? EARTH_EVENTS[state.currentEvent] : null;
  const phase = state.eventPhase;

  const [line, setLine] = useState('');

  useEffect(() => {
    if (phase === 'buddy' && event) {
      setLine(`Chào ${state.playerName}! ${event.buddyIntro[0]}`);
      const id = window.setTimeout(() => setLine(event.buddyIntro[1]), 3000);
      return () => window.clearTimeout(id);
    }
    if (phase === 'me_mission' && event && event.id !== 'perfect_day') {
      setLine('Chọn 2 thứ em sẽ chuẩn bị trước khi ra ngoài nhé!');
      return;
    }
    if (phase === 'farm_mission') {
      setLine('Giờ đến nông trại — quan sát dữ liệu rồi quyết định nhé!');
      return;
    }
    if (phase === 'me_result' && state.meResult) {
      setLine(state.meResult.correct ? 'Em biết tự bảo vệ mình rồi đó! 🎉' : 'Không sao, giờ mình biết cách rồi nè!');
      return;
    }
    if (phase === 'farm_result' && state.farmResult) {
      setLine(state.farmResult.correct ? 'Đúng là nhà nông thông thái! 🎉' : 'Sai một lần, nhớ mãi luôn. Cố lên!');
      return;
    }
    if (phase === 'afterglow') {
      if (event && event.id !== 'perfect_day') {
        setLine(`Ghi nhớ nè: ${ME_MISSIONS[event.id].advice}`);
      } else {
        setLine('Ngày mai vệ tinh sẽ lại có tin mới. Em cứ chăm sóc nông trại nhé! 🛰️');
      }
      return;
    }
    setLine('');
  }, [phase, event, state.playerName, state.meResult, state.farmResult]);

  const typed = useTypewriter(line);
  const active = phase !== 'idle';
  const worried = event?.danger === true && (phase === 'buddy' || phase === 'announce');
  const mask = state.weather === 'haze';
  const hat = state.weather === 'heat' && state.inventory.hasHat;

  return (
    <div className={`buddy ${active ? 'buddy-active' : 'buddy-idle'}`}>
      {line && (
        <div className="buddy-bubble">
          <div className="buddy-name">🛰️ BUDDY</div>
          <div className="buddy-text">
            {typed}
            {typed.length < line.length && <span className="type-caret">▍</span>}
          </div>
        </div>
      )}
      <div className="buddy-bot-wrap">
        <BuddyBot mood={worried ? 'worried' : 'happy'} mask={mask} hat={hat} />
      </div>
    </div>
  );
}

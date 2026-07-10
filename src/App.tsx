import { useEffect, useState } from 'react';
import { GameProvider, useGame } from './game/GameContext';
import { FxProvider, Confetti } from './components/FxLayer';
import { Onboarding } from './components/Onboarding';
import { TopBar } from './components/TopBar';
import { FarmScene } from './components/FarmScene';
import { EarthMonitor } from './components/EarthMonitor';
import { DailyMission } from './components/DailyMission';
import { Buddy } from './components/Buddy';
import { MissionModal, EventBanner } from './components/MissionModal';
import { Shop } from './components/Shop';
import { DemoPanel } from './components/DemoPanel';
import { sound } from './utils/sound';

function Game() {
  const { state, dispatch } = useGame();
  const [shopOpen, setShopOpen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [levelToast, setLevelToast] = useState(false);

  // screen shake on wrong answer
  useEffect(() => {
    if (state.shakeKey > 0) {
      setShaking(true);
      const id = window.setTimeout(() => setShaking(false), 600);
      return () => window.clearTimeout(id);
    }
  }, [state.shakeKey]);

  // level-up toast
  useEffect(() => {
    if (state.levelUpKey > 0) {
      setLevelToast(true);
      const id = window.setTimeout(() => setLevelToast(false), 2800);
      return () => window.clearTimeout(id);
    }
  }, [state.levelUpKey]);

  // alert sound when an event is announced
  useEffect(() => {
    if (state.eventPhase === 'announce') sound.alert();
  }, [state.eventPhase]);

  if (!state.onboarded) return <Onboarding />;

  const showNextDay = state.dayEventDone && (state.eventPhase === 'idle' || state.eventPhase === 'afterglow');

  return (
    <div className={`game-root weather-${state.weather} ${shaking ? 'screen-shake' : ''}`}>
      <FarmScene />
      <TopBar onOpenShop={() => setShopOpen(true)} />
      <div className="right-rail">
        <EarthMonitor />
        <DailyMission />
      </div>
      <Buddy />
      <EventBanner />
      <MissionModal />
      {shopOpen && <Shop onClose={() => setShopOpen(false)} />}
      {showNextDay && (
        <button
          className="btn btn-nextday"
          onClick={() => {
            sound.pop();
            dispatch({ type: 'NEXT_DAY' });
          }}
        >
          🌙 Qua ngày mới (Ngày {state.day + 1})
        </button>
      )}
      <DemoPanel />
      <Confetti burstKey={state.confettiKey} />
      {levelToast && (
        <div className="level-toast">
          🎉 LEVEL UP! <b>Level {state.level}</b>
        </div>
      )}
      <footer className="attribution">Demo data based on NASA Earth observation datasets · Earth Farm — Team 10</footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <FxProvider>
        <Game />
      </FxProvider>
    </GameProvider>
  );
}

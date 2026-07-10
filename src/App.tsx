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

function OrientationGate() {
  const requestLandscape = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (orientation: 'landscape') => Promise<void>;
      };
      await orientation.lock?.('landscape');
    } catch {
      // Browsers may block orientation lock outside installed/fullscreen apps.
    }
  };

  return (
    <div className="orientation-gate" role="dialog" aria-label="Xoay ngang màn hình">
      <div className="orientation-card">
        <div className="phone-rotate" aria-hidden>
          <span />
        </div>
        <h2>Xoay ngang để chơi tốt hơn</h2>
        <p>Earth Farm là game bản đồ nông trại. Màn hình ngang giúp thấy rõ dữ liệu, luống cây và nhiệm vụ mà không bị chồng UI.</p>
        <button className="btn btn-primary" onClick={requestLandscape}>
          Thử xoay ngang
        </button>
      </div>
    </div>
  );
}

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
      <FarmScene onOpenShop={() => setShopOpen(true)} />
      <TopBar onOpenShop={() => setShopOpen(true)} />
      <div className="right-rail">
        <EarthMonitor />
        <DailyMission />
      </div>
      <Buddy />
      <EventBanner />
      <MissionModal />
      <OrientationGate />
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

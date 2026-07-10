import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { GameState } from '../types';
import { EARTH_EVENTS } from '../data/earthEvents';
import { environmentProvider } from '../data/environment';
import { loadGame, reducer, saveGame, type Action } from './state';
import { sound } from '../utils/sound';

const TICK_MS = 250;
const EVENT_DELAY_MS = 7000; // each new Earth Day, the event lands after ~7s
const AFTERGLOW_MS = 6000;

interface GameCtx {
  state: GameState;
  dispatch: Dispatch<Action>;
}

const Ctx = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadGame);
  const stateRef = useRef(state);
  stateRef.current = state;

  // --- growth tick ---
  useEffect(() => {
    let last = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const dt = (now - last) / 1000;
      last = now;
      if (stateRef.current.onboarded) dispatch({ type: 'TICK', dt, now });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  // --- daily event scheduler: today's scripted event lands shortly after the day starts ---
  useEffect(() => {
    if (!state.onboarded || state.dayEventDone || state.eventPhase !== 'idle') return;
    const id = window.setTimeout(() => {
      const s = stateRef.current;
      if (s.eventPhase !== 'idle' || s.dayEventDone) return;
      const snapshot = environmentProvider.getSnapshot(s.day);
      dispatch({ type: 'TRIGGER_EVENT', eventId: snapshot.eventId, now: Date.now() });
    }, EVENT_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [state.onboarded, state.eventPhase, state.dayEventDone, state.day]);

  // --- phase auto-advance: announce → buddy → ME (or FARM), afterglow → clear ---
  useEffect(() => {
    if (state.eventPhase === 'announce') {
      const id = window.setTimeout(() => dispatch({ type: 'SET_PHASE', phase: 'buddy' }), 2600);
      return () => window.clearTimeout(id);
    }
    if (state.eventPhase === 'buddy') {
      const hasMe = state.currentEvent ? EARTH_EVENTS[state.currentEvent].hasMe : false;
      const id = window.setTimeout(
        () => dispatch({ type: 'SET_PHASE', phase: hasMe ? 'me_mission' : 'farm_mission' }),
        4200,
      );
      return () => window.clearTimeout(id);
    }
    if (state.eventPhase === 'afterglow') {
      const id = window.setTimeout(() => dispatch({ type: 'CLEAR_WEATHER' }), AFTERGLOW_MS);
      return () => window.clearTimeout(id);
    }
  }, [state.eventPhase, state.currentEvent]);

  // --- sound follows state ---
  useEffect(() => {
    sound.setEnabled(state.soundOn);
  }, [state.soundOn]);

  useEffect(() => {
    if (state.weather === 'rain' && state.soundOn) sound.startRain();
    else sound.stopRain();
  }, [state.weather, state.soundOn]);

  useEffect(() => {
    if (state.levelUpKey > 0) sound.levelUp();
  }, [state.levelUpKey]);

  // --- persistence (debounced) ---
  useEffect(() => {
    const id = window.setTimeout(() => saveGame(state), 400);
    return () => window.clearTimeout(id);
  }, [state]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useGame(): GameCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}

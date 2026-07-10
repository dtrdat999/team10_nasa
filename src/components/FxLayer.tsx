import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

interface FxItem {
  id: number;
  kind: 'coin' | 'text' | 'xp' | 'drop' | 'leafpop';
  x: number;
  y: number;
  text?: string;
  dx: number;
  delay: number;
}

interface FxApi {
  coins: (x: number, y: number, count?: number) => void;
  floatText: (x: number, y: number, text: string, kind?: 'text' | 'xp') => void;
  splash: (x: number, y: number) => void;
}

const FxCtx = createContext<FxApi | null>(null);

export function useFx(): FxApi {
  const ctx = useContext(FxCtx);
  if (!ctx) throw new Error('useFx must be used inside <FxProvider>');
  return ctx;
}

export function FxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FxItem[]>([]);
  const idRef = useRef(1);

  const push = useCallback((newItems: Omit<FxItem, 'id'>[]) => {
    const withIds = newItems.map((it) => ({ ...it, id: idRef.current++ }));
    setItems((prev) => [...prev, ...withIds]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((p) => !withIds.some((w) => w.id === p.id)));
    }, 1600);
  }, []);

  const coins = useCallback(
    (x: number, y: number, count = 6) => {
      push(
        Array.from({ length: count }, (_, i) => ({
          kind: 'coin' as const,
          x,
          y,
          dx: (Math.random() - 0.5) * 90,
          delay: i * 70,
        })),
      );
    },
    [push],
  );

  const floatText = useCallback(
    (x: number, y: number, text: string, kind: 'text' | 'xp' = 'text') => {
      push([{ kind, x, y, text, dx: 0, delay: 0 }]);
    },
    [push],
  );

  const splash = useCallback(
    (x: number, y: number) => {
      push(
        Array.from({ length: 8 }, (_, i) => ({
          kind: 'drop' as const,
          x,
          y,
          dx: (Math.random() - 0.5) * 70,
          delay: i * 30,
        })),
      );
    },
    [push],
  );

  return (
    <FxCtx.Provider value={{ coins, floatText, splash }}>
      {children}
      <div className="fx-layer" aria-hidden>
        {items.map((it) => (
          <span
            key={it.id}
            className={`fx fx-${it.kind}`}
            style={{
              left: it.x,
              top: it.y,
              animationDelay: `${it.delay}ms`,
              ['--dx' as string]: `${it.dx}px`,
            }}
          >
            {it.kind === 'coin' ? '🪙' : it.kind === 'drop' ? '💧' : it.text}
          </span>
        ))}
      </div>
    </FxCtx.Provider>
  );
}

/** Full-screen confetti burst; re-fires whenever `burstKey` changes. */
export function Confetti({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  const colors = ['#ff5d5d', '#ffc93c', '#59c135', '#54c8ff', '#c084fc', '#ff9d5c'];
  return (
    <div className="confetti-layer" key={burstKey} aria-hidden>
      {Array.from({ length: 46 }, (_, i) => {
        const left = Math.random() * 100;
        const size = 6 + Math.random() * 7;
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              width: size,
              height: size * (Math.random() > 0.5 ? 0.5 : 1),
              background: colors[i % colors.length],
              animationDelay: `${Math.random() * 350}ms`,
              animationDuration: `${1500 + Math.random() * 1200}ms`,
              ['--drift' as string]: `${(Math.random() - 0.5) * 160}px`,
              ['--spin' as string]: `${Math.random() * 720 - 360}deg`,
            }}
          />
        );
      })}
    </div>
  );
}

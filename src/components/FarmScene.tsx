import { useEffect, useState } from 'react';
import { useGame } from '../game/GameContext';
import { Plot } from './Plot';
import { Barn, Crate, Fence, House, Pumpkin, Tree } from './Buildings';

/** Pre-computed random particles so the layers render once. */
const DROPS = Array.from({ length: 54 }, (_, i) => ({
  left: (i * 100) / 54 + Math.random() * 2,
  delay: Math.random() * 1.4,
  dur: 0.55 + Math.random() * 0.5,
  op: 0.35 + Math.random() * 0.45,
}));

const SPARKLES = Array.from({ length: 14 }, () => ({
  left: 6 + Math.random() * 88,
  top: 22 + Math.random() * 60,
  delay: Math.random() * 3,
  size: 8 + Math.random() * 10,
}));

const HEAT_WAVES = Array.from({ length: 7 }, (_, i) => ({
  left: 8 + i * 13 + Math.random() * 4,
  delay: Math.random() * 2,
  dur: 2.2 + Math.random() * 1.4,
}));

const DUST = Array.from({ length: 26 }, () => ({
  left: Math.random() * 100,
  top: 10 + Math.random() * 75,
  size: 2.5 + Math.random() * 4,
  delay: Math.random() * 6,
  dur: 5 + Math.random() * 6,
}));

export function FarmScene() {
  const { state } = useGame();
  const [now, setNow] = useState(Date.now());

  // re-render twice a second for countdowns/progress bars
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  const w = state.weather;
  const boosted = state.perfectBoostUntil > now || state.sprintBoostUntil > now;

  return (
    <div className="scene">
      {/* --- sky --- */}
      <div className="sky" />
      <div className={`sun ${w === 'heat' ? 'sun-hot' : ''} ${w === 'rain' || w === 'haze' ? 'sun-dim' : ''}`}>
        <div className="sun-rays" />
        <div className="sun-core" />
      </div>

      {/* clouds */}
      <div className="clouds">
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
        <div className={`cloud dark d1 ${w === 'rain' ? 'in' : ''}`} />
        <div className={`cloud dark d2 ${w === 'rain' ? 'in' : ''}`} />
        <div className={`cloud dark d3 ${w === 'rain' ? 'in' : ''}`} />
      </div>

      {/* hills + ground */}
      <div className="hills">
        <div className="hill h1" />
        <div className="hill h2" />
      </div>
      <div className="ground" />

      {/* --- farm --- */}
      <div className="farm-area">
        <div className="fence-row">
          <Fence />
        </div>
        <div className="prop prop-house">
          <House />
        </div>
        <div className="prop prop-barn">
          <Barn />
        </div>
        <div className="prop prop-tree1">
          <Tree variant={0} />
        </div>
        <div className="prop prop-tree2">
          <Tree variant={1} />
        </div>
        <div className="prop prop-tree3">
          <Tree variant={2} />
        </div>
        <div className="prop prop-pumpkin">
          <Pumpkin />
        </div>
        <div className="prop prop-crate">
          <Crate />
        </div>

        <div className="field">
          {state.plots.map((p) => {
            const col = p.id % 2;
            const row = p.id >> 1;
            return (
              <div
                key={p.id}
                className="plot-slot"
                style={{
                  left: 180 + col * 218,
                  top: 54 + row * 130,
                }}
              >
                <Plot plot={p} now={now} />
              </div>
            );
          })}
        </div>

        {/* puddles during rain */}
        <div className={`puddles ${w === 'rain' ? 'show' : ''}`}>
          <span className="puddle p1" />
          <span className="puddle p2" />
          <span className="puddle p3" />
        </div>

        {boosted && (
          <div className="boost-tag" title="Tăng trưởng nhanh hơn!">
            ⚡ Growth boost!
          </div>
        )}
      </div>

      {/* --- weather overlays --- */}
      <div className={`rain-layer ${w === 'rain' ? 'show' : ''}`} aria-hidden>
        {DROPS.map((d, i) => (
          <span
            key={i}
            className="raindrop"
            style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s`, opacity: d.op }}
          />
        ))}
      </div>

      <div className={`heat-layer ${w === 'heat' ? 'show' : ''}`} aria-hidden>
        {HEAT_WAVES.map((h, i) => (
          <span
            key={i}
            className="heatwave"
            style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, animationDuration: `${h.dur}s` }}
          />
        ))}
      </div>

      {/* hazy, dusty air */}
      <div className={`haze-layer ${w === 'haze' ? 'show' : ''}`} aria-hidden>
        {DUST.map((d, i) => (
          <span
            key={i}
            className="dust"
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.dur}s`,
            }}
          />
        ))}
      </div>

      <div className={`sparkle-layer ${w === 'perfect' ? 'show' : ''}`} aria-hidden>
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="sparkle"
            style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, fontSize: s.size }}
          >
            ✦
          </span>
        ))}
        <div className="rainbow" />
      </div>
    </div>
  );
}

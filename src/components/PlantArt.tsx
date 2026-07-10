import type { CropId } from '../types';

/**
 * Hand-drawn SVG crops, one drawing per growth stage.
 * ViewBox 100×120, plant anchored to bottom-center (x=50, y≈112).
 */
export function PlantArt({ crop, stage }: { crop: CropId; stage: number }) {
  return (
    <svg className="plant-svg" viewBox="0 0 100 120" aria-hidden>
      <defs>
        <linearGradient id="leafG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ed957" />
          <stop offset="1" stopColor="#3f9427" />
        </linearGradient>
        <linearGradient id="carrotG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffa53d" />
          <stop offset="1" stopColor="#f0761b" />
        </linearGradient>
        <radialGradient id="tomatoG" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ff8a70" />
          <stop offset="0.55" stopColor="#f4442e" />
          <stop offset="1" stopColor="#c92c18" />
        </radialGradient>
      </defs>
      {crop === 'carrot' ? <Carrot stage={stage} /> : <Tomato stage={stage} />}
    </svg>
  );
}

function SoilMound() {
  return <ellipse cx="50" cy="112" rx="20" ry="6" fill="#7a4a28" opacity="0.85" />;
}

function Sparkles() {
  return (
    <g className="ready-sparkle">
      <path d="M20 38 l2.6 6 6 2.6 -6 2.6 -2.6 6 -2.6 -6 -6 -2.6 6 -2.6z" fill="#ffe14d" />
      <path d="M79 26 l2 4.6 4.6 2 -4.6 2 -2 4.6 -2 -4.6 -4.6 -2 4.6 -2z" fill="#fff3a1" />
      <circle cx="72" cy="60" r="2.4" fill="#ffe14d" />
    </g>
  );
}

function Carrot({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <g>
        <SoilMound />
        <ellipse cx="50" cy="109" rx="4.5" ry="3" fill="#c9a15f" stroke="#8a6a34" strokeWidth="1" />
      </g>
    );
  }
  if (stage === 1) {
    return (
      <g>
        <SoilMound />
        <path d="M50 111 V96" stroke="#4aa32f" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M50 98 C40 92 36 84 40 78 C48 80 52 88 50 98Z" fill="url(#leafG)" />
        <path d="M50 98 C60 92 64 84 60 78 C52 80 48 88 50 98Z" fill="url(#leafG)" />
      </g>
    );
  }
  if (stage === 2) {
    return (
      <g>
        <SoilMound />
        {[-22, -8, 8, 22].map((a, i) => (
          <path
            key={i}
            d="M50 112 C46 88 44 74 50 58 C56 74 54 88 50 112Z"
            fill="url(#leafG)"
            transform={`rotate(${a} 50 112)`}
          />
        ))}
      </g>
    );
  }
  if (stage === 3) {
    return (
      <g>
        <SoilMound />
        {[-34, -18, 0, 18, 34].map((a, i) => (
          <g key={i} transform={`rotate(${a} 50 112)`}>
            <path d="M50 112 C44 80 42 62 50 42 C58 62 56 80 50 112Z" fill="url(#leafG)" />
            <path d="M50 104 C47 84 47 70 50 56" stroke="#2f7c1d" strokeWidth="1.6" fill="none" opacity="0.6" />
          </g>
        ))}
        <path d="M43 112 Q50 118 57 112 L54 105 Q50 108 46 105 Z" fill="#f0761b" opacity="0.9" />
      </g>
    );
  }
  return (
    <g>
      <SoilMound />
      {[-36, -18, 0, 18, 36].map((a, i) => (
        <path
          key={i}
          d="M50 96 C44 70 42 52 50 34 C58 52 56 70 50 96Z"
          fill="url(#leafG)"
          transform={`rotate(${a} 50 96)`}
        />
      ))}
      <path d="M40 96 Q50 92 60 96 L54 117 Q50 121 46 117 Z" fill="url(#carrotG)" stroke="#c65f12" strokeWidth="1" />
      <path d="M44 102 H56 M45.5 108 H54.5" stroke="#c65f12" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <Sparkles />
    </g>
  );
}

function Tomato({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <g>
        <SoilMound />
        <ellipse cx="50" cy="109" rx="4.5" ry="3" fill="#d9c06b" stroke="#8a6a34" strokeWidth="1" />
      </g>
    );
  }
  if (stage === 1) {
    return (
      <g>
        <SoilMound />
        <path d="M50 111 V94" stroke="#4aa32f" strokeWidth="3.4" strokeLinecap="round" />
        <ellipse cx="42" cy="90" rx="9" ry="5.5" fill="url(#leafG)" transform="rotate(-24 42 90)" />
        <ellipse cx="58" cy="90" rx="9" ry="5.5" fill="url(#leafG)" transform="rotate(24 58 90)" />
      </g>
    );
  }
  if (stage === 2) {
    return (
      <g>
        <SoilMound />
        <path d="M64 112 V70" stroke="#a4703c" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 112 C50 92 49 80 50 66" stroke="#3f9427" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="84" rx="11" ry="6.5" fill="url(#leafG)" transform="rotate(-22 38 84)" />
        <ellipse cx="61" cy="76" rx="11" ry="6.5" fill="url(#leafG)" transform="rotate(20 61 76)" />
        <ellipse cx="40" cy="66" rx="9" ry="5.5" fill="url(#leafG)" transform="rotate(-16 40 66)" />
      </g>
    );
  }
  if (stage === 3) {
    return (
      <g>
        <SoilMound />
        <path d="M66 112 V58" stroke="#a4703c" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 112 C50 88 48 70 50 52" stroke="#3f9427" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <ellipse cx="36" cy="80" rx="14" ry="8" fill="url(#leafG)" transform="rotate(-20 36 80)" />
        <ellipse cx="63" cy="70" rx="13" ry="8" fill="url(#leafG)" transform="rotate(18 63 70)" />
        <ellipse cx="40" cy="58" rx="12" ry="7" fill="url(#leafG)" transform="rotate(-14 40 58)" />
        <ellipse cx="58" cy="50" rx="10" ry="6" fill="url(#leafG)" transform="rotate(12 58 50)" />
        <circle cx="42" cy="92" r="6.5" fill="#79b843" />
        <circle cx="58" cy="86" r="5.5" fill="#8cc653" />
      </g>
    );
  }
  return (
    <g>
      <SoilMound />
      <path d="M66 112 V52" stroke="#a4703c" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 112 C50 86 48 66 50 46" stroke="#3f9427" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="76" rx="14" ry="8" fill="url(#leafG)" transform="rotate(-20 35 76)" />
      <ellipse cx="64" cy="66" rx="13" ry="8" fill="url(#leafG)" transform="rotate(18 64 66)" />
      <ellipse cx="39" cy="54" rx="12" ry="7" fill="url(#leafG)" transform="rotate(-14 39 54)" />
      <ellipse cx="59" cy="46" rx="10" ry="6" fill="url(#leafG)" transform="rotate(12 59 46)" />
      <g>
        <circle cx="40" cy="92" r="8" fill="url(#tomatoG)" />
        <path d="M40 85 l-2 -4 M40 85 l2 -4" stroke="#3f9427" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="59" cy="84" r="7" fill="url(#tomatoG)" />
        <circle cx="49" cy="70" r="6" fill="url(#tomatoG)" />
        <circle cx="37.5" cy="89.5" r="2" fill="#ffb3a0" opacity="0.8" />
        <circle cx="56.8" cy="81.8" r="1.7" fill="#ffb3a0" opacity="0.8" />
      </g>
      <Sparkles />
    </g>
  );
}

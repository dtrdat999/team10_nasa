/** Decorative farm buildings & props — pure SVG, no interaction. */

export function House() {
  return (
    <svg viewBox="0 0 160 150" className="prop-svg" aria-hidden>
      <defs>
        <linearGradient id="roofG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9d5c" />
          <stop offset="1" stopColor="#e2632f" />
        </linearGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="80" cy="140" rx="62" ry="10" fill="#000" opacity="0.12" />
      {/* chimney */}
      <rect x="108" y="28" width="14" height="30" rx="2" fill="#b0603a" />
      <rect x="105" y="24" width="20" height="8" rx="3" fill="#8d4a2b" />
      {/* walls */}
      <rect x="30" y="62" width="100" height="76" rx="6" fill="#fbe7c1" stroke="#a97b4a" strokeWidth="3" />
      {/* roof */}
      <path d="M18 70 L80 18 L142 70 Q80 58 18 70Z" fill="url(#roofG)" stroke="#8a3d12" strokeWidth="3" strokeLinejoin="round" />
      {/* door */}
      <rect x="66" y="94" width="28" height="44" rx="12" fill="#a4703c" stroke="#7d5227" strokeWidth="2" />
      <circle cx="88" cy="118" r="2.6" fill="#ffd97a" />
      {/* window */}
      <circle cx="44" cy="86" r="11" fill="#bfe9ff" stroke="#7d5227" strokeWidth="2.5" />
      <path d="M33 86 H55 M44 75 V97" stroke="#7d5227" strokeWidth="2" />
      <circle cx="116" cy="86" r="11" fill="#bfe9ff" stroke="#7d5227" strokeWidth="2.5" />
      <path d="M105 86 H127 M116 75 V97" stroke="#7d5227" strokeWidth="2" />
    </svg>
  );
}

export function Barn() {
  return (
    <svg viewBox="0 0 150 140" className="prop-svg" aria-hidden>
      <ellipse cx="75" cy="131" rx="58" ry="9" fill="#000" opacity="0.12" />
      <path d="M20 62 Q75 8 130 62 L130 128 L20 128 Z" fill="#d9534f" stroke="#6d1f1c" strokeWidth="3" />
      <path d="M14 66 Q75 6 136 66 L128 58 Q75 16 22 58 Z" fill="#8d4a2b" />
      <rect x="55" y="82" width="40" height="46" rx="4" fill="#8d4a2b" stroke="#6d3a22" strokeWidth="2" />
      <path d="M57 84 L93 126 M93 84 L57 126" stroke="#e8c88f" strokeWidth="4" strokeLinecap="round" />
      <rect x="66" y="50" width="18" height="16" rx="3" fill="#fff3dd" stroke="#6d3a22" strokeWidth="2" />
      <text x="75" y="78" textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffe9c9" fontFamily="inherit">KHO</text>
    </svg>
  );
}

export function Tree({ variant = 0 }: { variant?: number }) {
  const greens = ['#4fae3b', '#5cbb45', '#459a33'];
  const g = greens[variant % greens.length];
  return (
    <svg viewBox="0 0 90 110" className="prop-svg" aria-hidden>
      <ellipse cx="45" cy="103" rx="26" ry="6" fill="#000" opacity="0.12" />
      <rect x="40" y="66" width="10" height="38" rx="4" fill="#8a5a34" stroke="#5e4025" strokeWidth="2" />
      <circle cx="26" cy="54" r="17" fill={g} stroke="#3e7a2a" strokeWidth="2.5" />
      <circle cx="64" cy="54" r="17" fill={g} stroke="#3e7a2a" strokeWidth="2.5" />
      <circle cx="45" cy="42" r="26" fill={g} stroke="#3e7a2a" strokeWidth="2.5" />
      <circle cx="38" cy="34" r="6" fill="#7ed957" opacity="0.75" />
      <circle cx="55" cy="48" r="4.5" fill="#7ed957" opacity="0.6" />
    </svg>
  );
}

export function Fence() {
  // one horizontal fence strip, repeatable
  const posts = Array.from({ length: 7 }, (_, i) => 8 + i * 34);
  return (
    <svg viewBox="0 0 240 46" className="prop-svg fence-svg" preserveAspectRatio="none" aria-hidden>
      <rect x="0" y="14" width="240" height="6" rx="3" fill="#c99a62" />
      <rect x="0" y="28" width="240" height="6" rx="3" fill="#c99a62" />
      {posts.map((x) => (
        <g key={x}>
          <rect x={x} y="4" width="9" height="38" rx="3" fill="#b0824e" stroke="#8a5f33" strokeWidth="1.2" />
          <path d={`M${x} 8 Q${x + 4.5} 1 ${x + 9} 8`} fill="#b0824e" stroke="#8a5f33" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

export function Pumpkin() {
  return (
    <svg viewBox="0 0 70 56" className="prop-svg" aria-hidden>
      <ellipse cx="35" cy="50" rx="24" ry="5" fill="#000" opacity="0.12" />
      <ellipse cx="35" cy="33" rx="26" ry="19" fill="#f28c28" stroke="#a34a12" strokeWidth="3" />
      <ellipse cx="35" cy="33" rx="11" ry="19" fill="none" stroke="#a34a12" strokeWidth="2" opacity="0.5" />
      <ellipse cx="35" cy="33" rx="20" ry="19" fill="none" stroke="#a34a12" strokeWidth="2" opacity="0.3" />
      <path d="M35 14 q-2 -8 5 -10" stroke="#4c7a2a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Crate() {
  return (
    <svg viewBox="0 0 70 62" className="prop-svg" aria-hidden>
      <ellipse cx="35" cy="57" rx="26" ry="5" fill="#000" opacity="0.12" />
      <rect x="8" y="10" width="54" height="46" rx="5" fill="#d8a55f" stroke="#5e4025" strokeWidth="3" />
      <path d="M12 14 L58 52 M58 14 L12 52" stroke="#b98246" strokeWidth="5" opacity="0.55" />
      <path d="M8 25 H62 M8 41 H62" stroke="#5e4025" strokeWidth="2.5" opacity="0.55" />
    </svg>
  );
}

export function BasketArt() {
  return (
    <svg viewBox="0 0 100 100" className="prop-svg" aria-hidden>
      <path d="M20 45 H80 L72 82 Q50 90 28 82 Z" fill="#c99a62" stroke="#8a5f33" strokeWidth="3" />
      <path d="M28 52 H72 M26 62 H74 M28 72 H72" stroke="#8a5f33" strokeWidth="2" opacity="0.6" />
      <path d="M32 45 Q50 18 68 45" fill="none" stroke="#8a5f33" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** BUDDY — the little satellite-robot guide (pure SVG, animated via CSS). */
export function BuddyBot({
  mood = 'happy',
  mask = false,
  hat = false,
}: {
  mood?: 'happy' | 'worried';
  mask?: boolean;
  hat?: boolean;
}) {
  return (
    <svg viewBox="0 0 140 140" className="buddy-svg" aria-hidden>
      <defs>
        <linearGradient id="buddyBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfe3f5" />
        </linearGradient>
        <linearGradient id="panelG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2f6fd0" />
          <stop offset="1" stopColor="#67a8f4" />
        </linearGradient>
      </defs>

      {/* solar panel wings */}
      <g className="buddy-wing">
        <rect x="2" y="56" width="30" height="20" rx="4" fill="url(#panelG)" stroke="#1d4e9e" strokeWidth="2" />
        <path d="M12 56 V76 M22 56 V76 M2 66 H32" stroke="#1d4e9e" strokeWidth="1.5" opacity="0.7" />
      </g>
      <g className="buddy-wing">
        <rect x="108" y="56" width="30" height="20" rx="4" fill="url(#panelG)" stroke="#1d4e9e" strokeWidth="2" />
        <path d="M118 56 V76 M128 56 V76 M108 66 H138" stroke="#1d4e9e" strokeWidth="1.5" opacity="0.7" />
      </g>

      {/* antenna */}
      <path d="M70 30 V16" stroke="#8fa8c4" strokeWidth="4" strokeLinecap="round" />
      <circle className="buddy-antenna" cx="70" cy="12" r="6" fill="#ff5d5d" />

      {/* body */}
      <circle cx="70" cy="70" r="40" fill="url(#buddyBody)" stroke="#9db8d4" strokeWidth="3" />

      {/* visor face */}
      <rect x="42" y="50" width="56" height="32" rx="16" fill="#16324f" />
      {mood === 'happy' ? (
        <g>
          <circle className="buddy-eye" cx="58" cy="66" r="5.5" fill="#54f1ff" />
          <circle className="buddy-eye" cx="82" cy="66" r="5.5" fill="#54f1ff" />
          <path d="M62 74 Q70 79 78 74" stroke="#54f1ff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path className="buddy-eye" d="M53 63 L63 68" stroke="#54f1ff" strokeWidth="4" strokeLinecap="round" />
          <path className="buddy-eye" d="M87 63 L77 68" stroke="#54f1ff" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="70" cy="76" rx="5" ry="3.4" fill="#54f1ff" />
        </g>
      )}

      {/* protective gear */}
      {mask && (
        <g>
          <path d="M50 70 q20 16 40 0 l-2 14 q-18 10 -36 0 z" fill="#bfe9ff" stroke="#5a9cc9" strokeWidth="2.5" />
          <path d="M50 71 L40 63 M90 71 L100 63" stroke="#5a9cc9" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      {hat && (
        <g>
          <ellipse cx="70" cy="34" rx="38" ry="10" fill="#f4b840" stroke="#a3712a" strokeWidth="2.5" />
          <path d="M50 32 Q50 14 70 14 Q90 14 90 32 Q70 40 50 32Z" fill="#ffd76b" stroke="#a3712a" strokeWidth="2.5" />
        </g>
      )}

      {/* chest light + bolts */}
      <circle cx="70" cy="96" r="5" fill="#ffd23f" stroke="#d9a616" strokeWidth="1.6" />
      <circle cx="46" cy="90" r="2.2" fill="#9db8d4" />
      <circle cx="94" cy="90" r="2.2" fill="#9db8d4" />

      {/* thruster glow */}
      <ellipse className="buddy-thruster" cx="70" cy="116" rx="12" ry="5" fill="#7fd4ff" opacity="0.65" />
    </svg>
  );
}

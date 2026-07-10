import type { GearId } from '../types';

/**
 * The player's kid avatar shown in Protection missions.
 * Gear picked by the player is drawn live on the character.
 */
export function KidAvatar({ gear, happy }: { gear: GearId[]; happy?: boolean }) {
  const has = (g: GearId) => gear.includes(g);
  return (
    <svg viewBox="0 0 160 190" className="kid-svg" aria-hidden>
      {/* shadow */}
      <ellipse cx="80" cy="182" rx="42" ry="7" fill="#000" opacity="0.12" />

      {/* umbrella (behind head) */}
      {has('umbrella') && (
        <g>
          <path d="M80 6 L80 30" stroke="#8a5636" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 32 Q80 -18 138 32 Z" fill="#f4b840" stroke="#a3712a" strokeWidth="3" />
          <path d="M22 32 Q51 18 80 32 Q109 18 138 32" fill="none" stroke="#a3712a" strokeWidth="2.5" />
        </g>
      )}

      {/* legs + boots/shoes */}
      <rect x="62" y="140" width="12" height="30" rx="5" fill="#4c6a8a" />
      <rect x="86" y="140" width="12" height="30" rx="5" fill="#4c6a8a" />
      {has('boots') ? (
        <g>
          <path d="M58 160 h20 v16 q0 4 -4 4 h-20 q-4 0 -4 -4 v-8 q0 -8 8 -8z" fill="#f4b840" stroke="#a3712a" strokeWidth="2.5" />
          <path d="M82 160 h20 v16 q0 4 -4 4 h-20 q-4 0 -4 -4 v-8 q0 -8 8 -8z" fill="#f4b840" stroke="#a3712a" strokeWidth="2.5" />
        </g>
      ) : (
        <g>
          <ellipse cx="68" cy="176" rx="12" ry="7" fill="#5e4025" />
          <ellipse cx="92" cy="176" rx="12" ry="7" fill="#5e4025" />
        </g>
      )}

      {/* body: raincoat overrides shirt */}
      {has('raincoat') ? (
        <path d="M50 96 q30 -14 60 0 l6 46 q-36 12 -72 0 z" fill="#ffd23f" stroke="#c9930f" strokeWidth="3" />
      ) : (
        <path d="M52 98 q28 -12 56 0 l4 42 q-32 10 -64 0 z" fill="#67b96a" stroke="#3e7a41" strokeWidth="3" />
      )}

      {/* arms */}
      <rect x="38" y="102" width="14" height="34" rx="7" fill="#f2c79b" stroke="#c99664" strokeWidth="2" transform="rotate(14 45 119)" />
      <rect x="108" y="102" width="14" height="34" rx="7" fill="#f2c79b" stroke="#c99664" strokeWidth="2" transform="rotate(-14 115 119)" />

      {/* water bottle in hand */}
      {has('water') && (
        <g transform="rotate(-14 118 130)">
          <rect x="110" y="122" width="16" height="26" rx="6" fill="#7fd4ff" stroke="#2f6fd0" strokeWidth="2.5" />
          <rect x="114" y="116" width="8" height="8" rx="2" fill="#2f6fd0" />
        </g>
      )}

      {/* head */}
      <circle cx="80" cy="66" r="30" fill="#f7d3a4" stroke="#c99664" strokeWidth="3" />
      {/* hair */}
      <path d="M52 60 Q54 32 80 32 Q106 32 108 60 Q94 46 80 48 Q66 46 52 60Z" fill="#5e4025" />

      {/* face */}
      {has('sunglasses') ? (
        <g>
          <rect x="60" y="58" width="17" height="12" rx="5" fill="#233a56" />
          <rect x="83" y="58" width="17" height="12" rx="5" fill="#233a56" />
          <path d="M77 63 h6" stroke="#233a56" strokeWidth="3" />
        </g>
      ) : (
        <g>
          <circle cx="69" cy="64" r="3.4" fill="#3d2a16" />
          <circle cx="91" cy="64" r="3.4" fill="#3d2a16" />
        </g>
      )}
      {has('mask') ? (
        <g>
          <path d="M62 70 q18 16 36 0 l-2 14 q-16 10 -32 0 z" fill="#bfe9ff" stroke="#5a9cc9" strokeWidth="2.5" />
          <path d="M62 71 L52 64 M98 71 L108 64" stroke="#5a9cc9" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ) : (
        <path d={happy === false ? 'M72 82 Q80 76 88 82' : 'M70 79 Q80 88 90 79'} stroke="#b05f3c" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}

      {/* sun hat on top of everything */}
      {has('hat') && (
        <g>
          <ellipse cx="80" cy="42" rx="42" ry="12" fill="#f4b840" stroke="#a3712a" strokeWidth="3" />
          <path d="M58 40 Q58 18 80 18 Q102 18 102 40 Q80 48 58 40Z" fill="#ffd76b" stroke="#a3712a" strokeWidth="3" />
          <path d="M58 38 Q80 46 102 38" stroke="#c1443c" strokeWidth="4" fill="none" />
        </g>
      )}
    </svg>
  );
}

/**
 * Cinematic hero artwork: a circuit-wired human profile rendered entirely in
 * inline SVG — no raster request, crisp on every display, theme-aware.
 * Purely decorative (aria-hidden); the real content lives beside it.
 */
export function HeroVisual() {
  return (
    <svg
      viewBox="0 0 640 640"
      role="img"
      aria-label="Abstract illustration of a human profile wired with glowing circuits"
      className="h-auto w-full select-none"
    >
      <defs>
        <linearGradient id="hv-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9d6cff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="hv-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#181830" />
          <stop offset="1" stopColor="#0a0a16" />
        </linearGradient>
        <radialGradient id="hv-glow-purple" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7c3cff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7c3cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hv-glow-cyan" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <pattern id="hv-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0v44" fill="none" stroke="#ffffff" strokeOpacity="0.05" />
        </pattern>
      </defs>

      {/* ambient glows */}
      <circle cx="330" cy="290" r="290" fill="url(#hv-glow-purple)" />
      <circle cx="150" cy="470" r="200" fill="url(#hv-glow-cyan)" />

      {/* orbit rings */}
      <g fill="none">
        <circle cx="330" cy="300" r="212" stroke="url(#hv-stroke)" strokeOpacity="0.28" />
        <circle
          cx="330"
          cy="300"
          r="264"
          stroke="#ffffff"
          strokeOpacity="0.07"
          strokeDasharray="3 10"
        />
        <circle cx="330" cy="300" r="308" stroke="#ffffff" strokeOpacity="0.04" />
      </g>

      {/* head silhouette */}
      <path
        d="M262 118C210 140 178 196 176 258c-2 48 10 86-4 130-8 26-24 54-14 80 10 24 40 32 66 34 20 2 38 10 46 30l4 20h106c-8-32 0-60 18-90 22-34 54-60 64-100 14-52 4-112-28-160-32-48-78-80-124-86-16-2-34-4-48 2Z"
        fill="url(#hv-head)"
        stroke="url(#hv-stroke)"
        strokeWidth="1.6"
        strokeOpacity="0.85"
      />

      {/* faint inner grid */}
      <path
        d="M262 118C210 140 178 196 176 258c-2 48 10 86-4 130-8 26-24 54-14 80 10 24 40 32 66 34 20 2 38 10 46 30l4 20h106c-8-32 0-60 18-90 22-34 54-60 64-100 14-52 4-112-28-160-32-48-78-80-124-86-16-2-34-4-48 2Z"
        fill="url(#hv-grid)"
        fillOpacity="0.6"
      />

      {/* circuit traces */}
      <g fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M238 214h74l26 26v58" stroke="#22d3ee" strokeOpacity="0.75" />
        <path d="M222 282h56l30 30v64l-24 24" stroke="#9d6cff" strokeOpacity="0.7" />
        <path d="M300 350h58l24-24v-52" stroke="#22d3ee" strokeOpacity="0.55" />
        <path d="M258 420h72l30-30" stroke="#9d6cff" strokeOpacity="0.5" />
        <path d="M330 190v52l-26 26" stroke="#ffffff" strokeOpacity="0.25" />
        <path d="M206 236v62l26 26" stroke="#3b82f6" strokeOpacity="0.45" />
      </g>

      {/* circuit nodes */}
      <g>
        <circle cx="338" cy="298" r="4.5" fill="#22d3ee" />
        <circle cx="308" cy="376" r="4" fill="#9d6cff" />
        <circle cx="382" cy="326" r="3.5" fill="#22d3ee" fillOpacity="0.85" />
        <circle cx="330" cy="216" r="3" fill="#ffffff" fillOpacity="0.6" />
        <circle cx="232" cy="298" r="3" fill="#3b82f6" fillOpacity="0.8" />
        <circle cx="360" cy="390" r="3" fill="#9d6cff" fillOpacity="0.7" />
        <circle cx="206" cy="324" r="3.5" fill="#22d3ee" fillOpacity="0.65" />
      </g>

      {/* synapse sparks */}
      <g fill="#ffffff">
        <circle cx="452" cy="182" r="2" fillOpacity="0.7" />
        <circle cx="132" cy="230" r="2" fillOpacity="0.5" />
        <circle cx="500" cy="330" r="2.4" fill="#22d3ee" fillOpacity="0.8" />
        <circle cx="104" cy="360" r="2" fill="#9d6cff" fillOpacity="0.7" />
        <circle cx="470" cy="452" r="2" fillOpacity="0.45" />
        <circle cx="180" cy="150" r="1.8" fillOpacity="0.5" />
        <circle cx="540" cy="240" r="1.8" fillOpacity="0.4" />
      </g>

      {/* floating interface chips */}
      <g className="animate-float">
        <rect x="418" y="128" width="128" height="60" rx="15" fill="#10101f" fillOpacity="0.92" stroke="url(#hv-stroke)" strokeOpacity="0.55" />
        <rect x="434" y="146" width="56" height="6" rx="3" fill="#9d6cff" fillOpacity="0.8" />
        <rect x="434" y="162" width="88" height="6" rx="3" fill="#ffffff" fillOpacity="0.18" />
      </g>
      <g className="animate-float-slow">
        <rect x="76" y="170" width="104" height="52" rx="14" fill="#10101f" fillOpacity="0.92" stroke="url(#hv-stroke)" strokeOpacity="0.45" />
        <circle cx="102" cy="196" r="9" fill="#22d3ee" fillOpacity="0.25" stroke="#22d3ee" strokeOpacity="0.8" />
        <rect x="120" y="188" width="44" height="6" rx="3" fill="#ffffff" fillOpacity="0.22" />
        <rect x="120" y="200" width="30" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.13" />
      </g>
      <g className="animate-float">
        <rect x="402" y="420" width="136" height="64" rx="16" fill="#10101f" fillOpacity="0.92" stroke="url(#hv-stroke)" strokeOpacity="0.5" />
        <path d="M424 466v-18l12-10 12 14 12-20 12 10 12-16 12 22" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" />
      </g>
    </svg>
  );
}

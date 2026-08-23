/**
 * HeroMotif — decorative hero geometry, one motif per content family.
 *
 * Companion to the rotating compass ring on the landing page. Every hero
 * across the site gets a slow, hairline geometric figure sized to the
 * hero and tinted with that page's existing accent tone, so the motif
 * reads as part of the page rather than as generic decoration:
 *
 *   compass   navigation / institution   home, about, partners, blog, RFQ
 *   lattice   cubic halite crystal       salt, minerals
 *   molecule  bonded ring + electron     chemicals, fertilizers
 *   strata    geological contours        construction, metals
 *   radar     sweep + range rings        services, ports, trade tools
 *   orbit     distribution paths         applications, markets, presence
 *   dial      calibrated gauge           CoA, standards, quality, cases
 *   sun       solar radiance             agro & food
 *
 * Purely presentational: aria-hidden, pointer-events-none, never in the
 * accessibility tree or tab order, and always behind the copy. Motion is
 * CSS-only (see the "Hero motifs" block in globals.css) and every loop is
 * disabled under prefers-reduced-motion.
 *
 * All variants draw inside a 0 0 400 400 viewBox centred on (200,200) so
 * the shared `transform-origin: 50% 50%` spins them about their own axis
 * (SVG's default transform-box is view-box, so 50% resolves to 200).
 */

const HAIR = '#94a3b8'

/* Path prefixes win over category — these live under mixed categories. */
const PATH_RULES = [
  [/^\/ports(\/|$)/, 'radar'],
  [/^\/services(\/|$)/, 'radar'],
  [/^\/trade-tools(\/|$)/, 'radar'],
  [/^\/standards(\/|$)/, 'dial'],
  [/^\/coa(\/|$)/, 'dial'],
  [/quality-compliance/, 'dial'],
  [/^\/global-presence(\/|$)/, 'orbit'],
  [/^\/markets(\/|$)/, 'orbit'],
  [/^\/applications(\/|$)/, 'orbit'],
]

const CATEGORY_MOTIF = {
  salt: 'lattice',      minerals: 'lattice',
  chemicals: 'molecule', fertilizers: 'molecule',
  construction: 'strata', metals: 'strata',
  services: 'radar',
  applications: 'orbit', markets: 'orbit',
  agro: 'sun',
  case_studies: 'dial',
  home: 'compass', about: 'compass', partners: 'compass',
  products: 'compass', blog: 'compass', rfq: 'compass', other: 'compass',
}

export function motifFor({ category, path = '', sourceType = '' } = {}) {
  for (const [re, variant] of PATH_RULES) if (re.test(path)) return variant
  if (/rock|sea|halite/i.test(sourceType)) return 'lattice'
  return CATEGORY_MOTIF[category] || 'compass'
}

/* ── variants ─────────────────────────────────────────────────────────── */

function Compass({ tone }) {
  return (
    <g className="egg-motif-spin">
      <circle cx="200" cy="200" r="196" stroke={tone} strokeWidth="0.6" strokeDasharray="2 10" />
      <circle cx="200" cy="200" r="150" stroke={HAIR} strokeWidth="0.6" strokeDasharray="1 6" />
      <circle cx="200" cy="200" r="96" stroke={tone} strokeWidth="0.9" />
      <path d="M200 20 L200 380 M20 200 L380 200 M73 73 L327 327 M327 73 L73 327"
        stroke={HAIR} strokeWidth="0.4" />
    </g>
  )
}

/* Halite is cubic — a wireframe cube is the literal crystal habit of salt. */
function Lattice({ tone }) {
  const front = 'M110 150 H250 V290 H110 Z'
  const back  = 'M150 110 H290 V250 H150 Z'
  const join  = 'M110 150 L150 110 M250 150 L290 110 M250 290 L290 250 M110 290 L150 250'
  const nodes = [[110,150],[250,150],[250,290],[110,290],[150,110],[290,110],[290,250],[150,250]]
  return (
    <g className="egg-motif-spin">
      <path d={front} stroke={tone} strokeWidth="1" />
      <path d={back} stroke={HAIR} strokeWidth="0.7" strokeDasharray="3 5" />
      <path d={join} stroke={HAIR} strokeWidth="0.7" />
      {nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill={tone} opacity="0.5" />)}
      <circle cx="200" cy="200" r="188" stroke={tone} strokeWidth="0.5" strokeDasharray="2 12" />
    </g>
  )
}

function Molecule({ tone }) {
  const pts = [0, 60, 120, 180, 240, 300].map(d => {
    const a = (d * Math.PI) / 180
    return [200 + 92 * Math.cos(a), 200 + 92 * Math.sin(a)]
  })
  const ring = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'
  return (
    <g>
      <g className="egg-motif-spin">
        <path d={ring} stroke={tone} strokeWidth="1.1" />
        <circle cx="200" cy="200" r="58" stroke={HAIR} strokeWidth="0.6" strokeDasharray="2 7" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={tone} opacity="0.45" />)}
      </g>
      <g className="egg-motif-spin-r">
        <circle cx="200" cy="200" r="165" stroke={HAIR} strokeWidth="0.5" strokeDasharray="1 9" />
        <circle cx="365" cy="200" r="4.5" fill={tone} opacity="0.6" />
      </g>
    </g>
  )
}

function Strata({ tone }) {
  const arcs = [
    { d: 'M20 300 Q200 240 380 300', w: 1.1, c: 'tone' },
    { d: 'M20 250 Q200 186 380 250', w: 0.8, c: 'hair' },
    { d: 'M20 200 Q200 132 380 200', w: 0.8, c: 'tone' },
    { d: 'M20 150 Q200 84 380 150',  w: 0.6, c: 'hair' },
    { d: 'M20 100 Q200 30 380 100',  w: 0.6, c: 'hair' },
  ]
  return (
    <g className="egg-motif-drift">
      {arcs.map((a, i) => (
        <path key={i} d={a.d} stroke={a.c === 'tone' ? tone : HAIR} strokeWidth={a.w}
          strokeDasharray={i % 2 ? '4 8' : undefined} />
      ))}
      <circle cx="200" cy="200" r="190" stroke={tone} strokeWidth="0.5" strokeDasharray="2 12" />
    </g>
  )
}

function Radar({ tone }) {
  return (
    <g>
      <circle cx="200" cy="200" r="190" stroke={tone} strokeWidth="0.6" strokeDasharray="2 10" />
      <circle cx="200" cy="200" r="132" stroke={HAIR} strokeWidth="0.6" />
      <circle cx="200" cy="200" r="74" stroke={HAIR} strokeWidth="0.6" />
      <path d="M200 10 L200 390 M10 200 L390 200" stroke={HAIR} strokeWidth="0.4" />
      <g className="egg-motif-sweep">
        <path d="M200 200 L200 12" stroke={tone} strokeWidth="1.6" />
        <path d="M200 200 L200 12 A188 188 0 0 1 296 38 Z" fill={tone} opacity="0.07" />
      </g>
      <circle className="egg-motif-pulse" cx="286" cy="146" r="4" fill={tone} />
      <circle className="egg-motif-pulse" cx="132" cy="268" r="3.2" fill={tone}
        style={{ animationDelay: '1.4s' }} />
    </g>
  )
}

function Orbit({ tone }) {
  return (
    <g>
      <circle cx="200" cy="200" r="192" stroke={tone} strokeWidth="0.5" strokeDasharray="2 12" />
      <g className="egg-motif-spin">
        <ellipse cx="200" cy="200" rx="180" ry="72" stroke={tone} strokeWidth="0.8" />
        <circle cx="380" cy="200" r="5" fill={tone} opacity="0.55" />
      </g>
      <g className="egg-motif-spin-r">
        <ellipse cx="200" cy="200" rx="72" ry="180" stroke={HAIR} strokeWidth="0.7" />
        <circle cx="200" cy="20" r="4" fill={tone} opacity="0.5" />
      </g>
      <circle cx="200" cy="200" r="42" stroke={HAIR} strokeWidth="0.6" strokeDasharray="2 6" />
    </g>
  )
}

/* Calibrated gauge — the QA / measurement family. */
function Dial({ tone }) {
  return (
    <g>
      <circle cx="200" cy="200" r="192" stroke={HAIR} strokeWidth="0.5" strokeDasharray="1 9" />
      <circle cx="200" cy="200" r="168" stroke={tone} strokeWidth="3" strokeDasharray="1.5 12" />
      <circle cx="200" cy="200" r="120" stroke={HAIR} strokeWidth="0.6" />
      <circle cx="200" cy="200" r="54" stroke={tone} strokeWidth="0.9" />
      <g className="egg-motif-spin">
        <path d="M200 200 L200 62" stroke={tone} strokeWidth="2" />
        <circle cx="200" cy="62" r="4.5" fill={tone} opacity="0.6" />
      </g>
      <circle cx="200" cy="200" r="6" fill={tone} opacity="0.55" />
    </g>
  )
}

/* Solar radiance — Egypt's evaporation pans and growing season. */
function Sun({ tone }) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = ((i * 22.5) * Math.PI) / 180
    const r0 = 96, r1 = i % 2 ? 150 : 182
    return `M${(200 + r0 * Math.cos(a)).toFixed(1)} ${(200 + r0 * Math.sin(a)).toFixed(1)} L${(200 + r1 * Math.cos(a)).toFixed(1)} ${(200 + r1 * Math.sin(a)).toFixed(1)}`
  }).join(' ')
  return (
    <g>
      <g className="egg-motif-spin">
        <path d={rays} stroke={tone} strokeWidth="0.9" />
        <circle cx="200" cy="200" r="192" stroke={HAIR} strokeWidth="0.5" strokeDasharray="2 12" />
      </g>
      <circle cx="200" cy="200" r="80" stroke={tone} strokeWidth="1.1" />
      <circle cx="200" cy="200" r="58" stroke={HAIR} strokeWidth="0.6" strokeDasharray="3 6" />
    </g>
  )
}

const VARIANTS = { compass: Compass, lattice: Lattice, molecule: Molecule, strata: Strata, radar: Radar, orbit: Orbit, dial: Dial, sun: Sun }

export default function HeroMotif({
  category, path, sourceType, tone = '#0284c7', variant,
  className = 'absolute -right-[10%] -top-[26%] w-[min(72vw,560px)] h-[min(72vw,560px)]',
}) {
  const key = variant || motifFor({ category, path, sourceType })
  const Shape = VARIANTS[key] || Compass
  return (
    <svg className={`egg-motif ${className}`} viewBox="0 0 400 400" fill="none"
      aria-hidden="true" focusable="false" data-motif={key}>
      <Shape tone={tone} />
    </svg>
  )
}

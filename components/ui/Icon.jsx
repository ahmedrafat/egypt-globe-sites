/**
 * Icon — the site's single monochrome micro-icon set.
 *
 * Vector protocol (2026-08-23): no decorative artwork, no emoji. Every
 * pictogram on egyptglobe.com is a 24-unit single-colour stroke glyph,
 * rendered at 14–20 px with `currentColor`, used only where it aids
 * scannability (section markers, trust indicators, contact markers,
 * table bullets).
 *
 * Server-component safe (no hooks). `iconSvg()` returns a raw SVG string
 * for the markdown renderer, which builds HTML strings.
 */

export const ICON_PATHS = {
  shield:   'M12 3l7 3v5c0 4.6-3 8.6-7 10-4-1.4-7-5.4-7-10V6l7-3zM9.3 12.2l1.9 1.9 3.6-3.9',
  beaker:   'M9.5 3h5M10.5 3v6.2L5 18.4A1.8 1.8 0 006.6 21h10.8a1.8 1.8 0 001.6-2.6L13.5 9.2V3M8 15h8',
  anchor:   'M12 3.5a2 2 0 100 4 2 2 0 000-4zM12 7.5V21M5.5 12.5h-2a8.5 8.5 0 0017 0h-2',
  doc:      'M7 3h7l5 5v13H7V3zM14 3v5h5M9.5 13h5M9.5 17h5',
  pin:      'M12 21s-6-5.4-6-10.2a6 6 0 1112 0C18 15.6 12 21 12 21zM12 12.3a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z',
  check:    'M5 12.5l4.5 4.5L19 7.5',
  cross:    'M6 6l12 12M18 6L6 18',
  cube:     'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  layers:   'M12 3.5l9 4.8-9 4.8-9-4.8 9-4.8zM3 13.3l9 4.8 9-4.8M3 17.1l9 4.8 9-4.8',
  leaf:     'M5 19c0-9.4 6.2-15 15-15 0 8.8-5.6 15-15 15zM5 19l7.5-7.5',
  wheat:    'M12 21V8.5M12 8.5c-2.8 0-4.2-1.9-4.2-4.2 2.3 0 4.2 1.4 4.2 4.2zM12 8.5c2.8 0 4.2-1.9 4.2-4.2-2.3 0-4.2 1.4-4.2 4.2zM12 13.5c-2.8 0-4.2-1.9-4.2-4.2 2.3 0 4.2 1.4 4.2 4.2zM12 13.5c2.8 0 4.2-1.9 4.2-4.2-2.3 0-4.2 1.4-4.2 4.2z',
  gear:     'M12 9a3 3 0 100 6 3 3 0 000-6zM3.5 12h2.2M18.3 12h2.2M12 3.5v2.2M12 18.3v2.2M6 6l1.6 1.6M16.4 16.4L18 18M6 18l1.6-1.6M16.4 7.6L18 6',
  building: 'M4 21V5.5L12 3l8 2.5V21M3 21h18M9 9h1.5M13.5 9H15M9 13h1.5M13.5 13H15M9 17h1.5M13.5 17H15',
  clock:    'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM12 7.5v5l3 2',
  ship:     'M3 17l2 4h14l2-4M4 17l8-3 8 3M6 13V8h12v5M10 8V5h4v3',
  globe:    'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17',
  arrow:    'M5 12h14M13 6l6 6-6 6',
  box:      'M3.5 8l8.5-4.5L20.5 8v8.5L12 21l-8.5-4.5V8zM3.5 8l8.5 4.5 8.5-4.5M12 12.5V21',
  search:   'M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15.5 15.5L20 20',
  mail:     'M3.5 6h17v12h-17V6zM3.5 7l8.5 6 8.5-6',
  phone:    'M5 4h4l1.5 4.5-2 1.5a11 11 0 005.5 5.5l1.5-2L20 15v4a1.5 1.5 0 01-1.5 1.5C9.7 20.1 3.9 14.3 3.5 5.5A1.5 1.5 0 015 4z',
  factory:  'M3 21V10l5 3.5V10l5 3.5V10l5 3.5V5h3v16H3zM7 17h2M12 17h2M17 17h2',
  flask:    'M9.5 3h5M10.5 3v6.2L5 18.4A1.8 1.8 0 006.6 21h10.8a1.8 1.8 0 001.6-2.6L13.5 9.2V3M8 15h8',
  drop:     'M12 3.5s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z',
  snow:     'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4',
  pill:     'M8.5 3.5h7a5 5 0 015 5v7a5 5 0 01-5 5h-7a5 5 0 01-5-5v-7a5 5 0 015-5zM3.5 12h17',
  sparkle:  'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z',
  cow:      'M5 8l-2-3M19 8l2-3M7 8h10v7a5 5 0 01-10 0V8zM9 18v3M15 18v3M10 12h.01M14 12h.01',
  pickaxe:  'M3 21l9-9M12 12l3-3M9 9l6-6M9.5 3.5c3-1 6-1 9 0 1 3 1 6 0 9',
  wave:     'M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0',
  book:     'M4 4.5h6.5a2 2 0 012 2v14a1.5 1.5 0 00-1.5-1.5H4v-14.5zM20 4.5h-6.5a2 2 0 00-2 2v14a1.5 1.5 0 011.5-1.5H20v-14.5z',
  news:     'M4 5h13v14H6a2 2 0 01-2-2V5zM17 9h3v8a2 2 0 01-2 2M7 9h7M7 13h7M7 17h4',
  chart:    'M4 20h16M7 16V10M12 16V6M17 16v-4',
  tools:    'M14.5 6.5a3.5 3.5 0 004.8 4.8L21 13l-8 8-2-2 5-5-1.8-1.8-5 5-2-2 8-8 1.7 1.7zM3 3l6 6',
  calendar: 'M4 6h16v14H4V6zM4 10h16M8 3v4M16 3v4',
  users:    'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M21.5 20a6.5 6.5 0 00-4.5-6.2',
  target:   'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM12 8a4 4 0 100 8 4 4 0 000-8zM12 12h.01',
  coins:    'M8 9a6 2.5 0 1012 0 6 2.5 0 10-12 0zM8 9v6c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V9M4 13a6 2.5 0 006 2.5M4 13v3c0 1.4 2.7 2.5 6 2.5',
  scale:    'M12 3v18M4 8h16M6 8l-3 6a3.5 3.5 0 006 0l-3-6zM18 8l-3 6a3.5 3.5 0 006 0l-3-6zM8 21h8',
  scroll:   'M6 3h12a2 2 0 012 2v2h-3v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zM8 8h7M8 12h7M8 16h4',
  question: 'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17h.01',
  handshake:'M3 10l4-4 5 1 5-1 4 4-4 6-3 3-2-2-2 2-3-3-4-6zM9 7l3 3',
  truck:    'M3 6h11v9H3zM14 9h4l3 3v3h-7zM7 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  lock:     'M6 10h12v10H6V10zM8.5 10V7a3.5 3.5 0 017 0v3',
  print:    'M7 8V3h10v5M7 16H4v-6h16v6h-3M7 13h10v8H7z',
  bolt:     'M13 3L4 14h7l-1 7 9-11h-7l1-7z',
  sun:      'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
  grid:     'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  dot:      'M12 9a3 3 0 100 6 3 3 0 000-6z',
}

export default function Icon({ name, className = 'w-4 h-4', strokeWidth = 1.75, title }) {
  const d = ICON_PATHS[name] || ICON_PATHS.dot
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : 'true'} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <path d={d} />
    </svg>
  )
}

/** Raw SVG string for HTML-string renderers (MarkdownBody). */
export function iconSvg(name, cls = 'w-4 h-4', strokeWidth = 1.75) {
  const d = ICON_PATHS[name] || ICON_PATHS.dot
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`
}

/* ─── semantic maps (ids from lib/corporatePages.js) ─────────────────── */

export const DIVISION_ICON = {
  salt: 'cube', fertilizers: 'wheat', chemicals: 'beaker', construction: 'building',
  agro: 'leaf', minerals: 'layers', metals: 'gear', products: 'box',
}

export const APPLICATION_ICON = {
  construction: 'building', stone_architecture: 'layers', food_processing: 'leaf',
  retail_horeca: 'box', industrial_chemistry: 'beaker', water_treatment: 'drop',
  oil_gas: 'factory', agriculture: 'wheat', animal_feed: 'cow', steel_metal: 'gear',
  deicing: 'snow', pharmaceutical: 'pill', cosmetic: 'sparkle', glass_ceramics: 'grid',
  pulp_textile: 'scroll', mining_other: 'pickaxe',
}

export const SERVICE_ICON = {
  logistics: 'ship', 'port-services': 'anchor', 'added-value': 'beaker', packing: 'box',
  distribution: 'globe', inspection: 'shield', documentation: 'doc',
}

export const CATEGORY_ICON = {
  home: 'building', about: 'building', products: 'box', salt: 'cube', fertilizers: 'wheat',
  chemicals: 'beaker', construction: 'building', agro: 'leaf', minerals: 'layers', metals: 'gear',
  services: 'ship', applications: 'factory', case_studies: 'book', markets: 'chart',
  partners: 'handshake', blog: 'news', rfq: 'doc', other: 'grid', ports: 'anchor',
  standards: 'shield', wholesale: 'box', trade_tools: 'tools',
}

/** Keyword → icon name. Order matters: specific before generic. */
const KEYWORD_RULES = [
  [/\bsea salt|sea.salt|solar.evaporated\b/i, 'wave'],
  [/\brock salt|siwa|qattara|mining|mine\b/i, 'pickaxe'],
  [/\b(port|loading|damietta|alexandria|sokhna|safaga|al.?arish|el.?dekheila|bardawil|adabiya)\b/i, 'anchor'],
  [/\b(quality|qc|qa|certif|standard|inspection|sgs|intertek|tüv|bureau veritas|iso \d|en \d|astm|gmp|nsf|usp|reach|verification)\b/i, 'shield'],
  [/\b(specification|spec|analysis|chemical|physical|test|laboratory|lab)\b/i, 'beaker'],
  [/\b(document|paperwork|invoice|bill of lading|coa|certificate of analysis|l\/c|letter of credit)\b/i, 'doc'],
  [/\b(logistics|freight|shipping|vessel|truck|rail|multimodal|stevedor|transit)\b/i, 'ship'],
  [/\b(pack|bag|fibc|jumbo|pallet|container)\b/i, 'box'],
  [/\b(team|career|hire|hr|people|staff)\b/i, 'users'],
  [/\b(office|location|address|cairo|hq|headquarter|operations)\b/i, 'pin'],
  [/\b(contact|email|phone|reach|get in touch)\b/i, 'mail'],
  [/\b(mission|vision|values?|principles?)\b/i, 'target'],
  [/\b(market|global|destination|region|country|countries|export|presence|worldwide)\b/i, 'globe'],
  [/\b(application|industr|use case|sector|use)\b/i, 'factory'],
  [/\b(lead time|response|sla|24h|24 hour|turnaround|hour|day|week|month)\b/i, 'clock'],
  [/\b(price|pricing|cost|fob|cif|cfr|currency|usd|eur|finance|trade finance|payment|tariff|duty)\b/i, 'coins'],
  [/\b(history|founded|since|origin|story|journey)\b/i, 'scroll'],
  [/\b(news|blog|article|insight|press|media|update)\b/i, 'news'],
  [/\b(complian|registry|license|tax|legal|regulator)\b/i, 'scale'],
  [/\b(faq|question|answer)\b/i, 'question'],
  [/\b(preferential|free.trade|comesa|pafta|ecowas|partner)\b/i, 'handshake'],
  [/\b(agro|agricultur|food|crop|grain|harvest|fertili|urea|nitrogen|phosphate|potash|npk)\b/i, 'wheat'],
  [/\b(chemical|acid|alkali|polymer|chlor)\b/i, 'beaker'],
  [/\b(construct|cement|concrete|aggregat|granit|marble|clinker)\b/i, 'building'],
  [/\b(metal|aluminum|aluminium|copper|steel|zinc|lead|ferro)\b/i, 'gear'],
  [/\b(mineral|ore|silica|kaolin|feldspar|gypsum|limestone)\b/i, 'layers'],
  [/\b(water|pool|softener)\b/i, 'drop'],
  [/\b(de.?icing|road salt|winter)\b/i, 'snow'],
  [/\b(pharma|saline|dialysis)\b/i, 'pill'],
  [/\b(cosmetic|spa|bath)\b/i, 'sparkle'],
  [/\b(animal|livestock|feed|aquaculture)\b/i, 'cow'],
  [/\bsalt\b/i, 'cube'],
  [/\b(overview|about|introduction|summary)\b/i, 'book'],
]

export function keywordIconName(text) {
  const t = String(text || '')
  for (const [re, name] of KEYWORD_RULES) if (re.test(t)) return name
  return 'dot'
}

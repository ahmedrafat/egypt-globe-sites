/**
 * Product lines — shared helpers for the division hubs (/products/<division>)
 * and their sub-category pages (/products/<division>/<line>).
 *
 * Sep 2026: every figure on those pages' "at a glance" tables comes from the
 * `commodities` rows behind the published SKUs (origin, HS code, MOQ, lead
 * time, packing, loading ports, regions, certifications, applications) —
 * nothing is typed by hand, so the tables can't drift from the SKU pages.
 */
import { APPLICATIONS } from './corporatePages'

// Loading-port names as stored in commodities.loading_ports → port profile
// pages. "Port Said" (west) is deliberately absent: the only page is Port
// Said East, a different terminal.
const PORT_PAGE = {
  'Adabiya': '/ports/adabiya-salt',
  'Ain Sokhna': '/ports/ain-sokhna-salt',
  'Al-Arish': '/ports/al-arish-salt',
  'Alexandria': '/ports/alexandria-salt',
  'Damietta': '/ports/damietta-salt',
  'El Dekheila': '/ports/el-dekheila-salt',
  'Port Said East': '/ports/port-said-east-salt',
  'Safaga': '/ports/safaga-salt',
}
export const portPage = name => PORT_PAGE[name] || null

const uniq = xs => [...new Set(xs.filter(Boolean).map(s => String(s).trim()).filter(Boolean))]
const num = v => (v === null || v === undefined || v === '' ? null : Number(String(v).replace(/[^\d.]/g, '')))
const fmtInt = n => Math.round(n).toLocaleString('en-US')

/**
 * Origins as buyers read them: "Eastern Desert, Egypt" and "Egypt, Eastern
 * Desert" are one place, and a bare "Egypt" adds nothing next to either.
 */
function tidyOrigins(raw) {
  const tok = o => o.toLowerCase().split(/\s*,\s*|\s*\(\s*|\s*\)\s*/).map(t => t.trim()).filter(Boolean)
  const seen = new Map()
  for (const o of uniq(raw)) { const k = [...new Set(tok(o))].sort().join('|'); if (!seen.has(k)) seen.set(k, o) }
  const entries = [...seen.entries()].map(([k, o]) => ({ o, t: new Set(k.split('|')) }))
  return entries.filter(e => !entries.some(x => x !== e && x.t.size > e.t.size && [...e.t].every(t => x.t.has(t)))).map(e => e.o)
}

/** Roll a list of commodity fact rows up into one summary. */
export function summarizeFacts(facts) {
  const list = facts || []
  const moqs = list.map(f => num(f.moq_mt)).filter(n => n > 0)
  const leadMin = list.map(f => f.lead_time_min_weeks).filter(n => n > 0)
  const leadMax = list.map(f => f.lead_time_max_weeks).filter(n => n > 0)
  const count = (key) => {
    const c = new Map()
    for (const f of list) for (const v of (f[key] || [])) c.set(v, (c.get(v) || 0) + 1)
    return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([v]) => v)
  }
  return {
    skus: list.length,
    hs: uniq(list.map(f => (f.hs_code || '').replace(/(\.\d{2})\.?\d*$/, '$1'))).sort(),
    origins: tidyOrigins(list.flatMap(f => String(f.origin || '').split(/\s+\/\s+/))),
    moq: moqs.length ? { min: Math.min(...moqs), max: Math.max(...moqs) } : null,
    lead: leadMin.length ? { min: Math.min(...leadMin), max: Math.max(...(leadMax.length ? leadMax : leadMin)) } : null,
    packing: count('packing_options'),
    ports: count('loading_ports'),
    regions: count('regions'),
    certs: count('certifications'),
    tags: uniq(list.flatMap(f => f.applications || [])),
  }
}

export const fmtMoq = m => !m ? null : m.min === m.max ? `${fmtInt(m.min)} MT` : `${fmtInt(m.min)}–${fmtInt(m.max)} MT`
export const fmtLead = l => !l ? null : l.min === l.max ? `${l.min} weeks` : `${l.min}–${l.max} weeks`

/** HS codes shown in full when there are few, else collapsed to 4-digit headings. */
export function fmtHs(hs, max = 4) {
  if (!hs?.length) return null
  if (hs.length <= max) return hs.join(' · ')
  const headings = uniq(hs.map(h => h.slice(0, 4)))
  return headings.length <= max + 2 ? headings.join(' · ') : `${headings.slice(0, max + 2).join(' · ')} +${headings.length - max - 2}`
}

const list = (xs, max) => xs.length <= max ? xs.join(' · ') : `${xs.slice(0, max).join(' · ')} +${xs.length - max} more`

/** Two-column "at a glance" rows for a sub-category page. */
export function glanceRows(s) {
  return [
    ['Products in this line', `${s.skus} ${s.skus === 1 ? 'SKU' : 'SKUs'}`],
    ['HS codes', fmtHs(s.hs, 6)],
    ['Origin', s.origins.length ? list(s.origins, 6) : null],
    ['Minimum order', fmtMoq(s.moq)],
    ['Lead time', s.lead ? `${fmtLead(s.lead)} from confirmed order` : null],
    ['Packing', s.packing.length ? list(s.packing, 6) : null],
    ['Loading ports', s.ports.length ? s.ports.join(' · ') : null],
    ['Destination regions', s.regions.length ? list(s.regions, 7) : null],
    ['Standards & documents', s.certs.length ? list(s.certs, 7) : null],
    ['Incoterms', 'FOB · CFR · CIF'],
  ].filter(r => r[1])
}

/** High-level APPLICATIONS served by a set of application tags (via APPLICATIONS.matches). */
export function applicationsForTags(tags) {
  const set = new Set(tags || [])
  return APPLICATIONS.filter(a => [a.id, ...(a.matches || [])].some(t => set.has(t)))
}

/** Group fact rows by their sub-category path (/products/<division>/<line>). */
export function factsByLine(facts) {
  const out = {}
  for (const f of facts || []) {
    const line = (f.page_path || '').split('/').slice(0, 4).join('/')
    ;(out[line] ||= []).push(f)
  }
  return out
}

/**
 * CMS bodies on these pages end with a "## Request a quote" section — the
 * page template already closes with its own quote panel, so rendering both
 * put a quote block in the middle of the page. Drop that closing section,
 * but keep any paragraph in it that links somewhere other than /rfq (the
 * cement hub's link to the Turkish-cement comparison lives there).
 */
export function withoutQuoteSection(md) {
  if (!md) return md
  const m = [...md.matchAll(/^## +[^\n]*quote[^\n]*$/gim)].pop()
  if (!m) return md
  const tail = md.slice(m.index)
  if (/^## /m.test(tail.slice(3))) return md // not the closing section
  const keep = tail.slice(m[0].length).split(/\n\s*\n/)
    .filter(p => /\]\((?!\/rfq)[^)]+\)/.test(p))
    .map(p => p.trim())
  return (md.slice(0, m.index).trimEnd() + (keep.length ? '\n\n' + keep.join('\n\n') : '') + '\n')
}

/**
 * Short product-line name for cards, tables and section headings — the
 * title's first segment ("Polymers — HDPE, LDPE…" → "Polymers"), without the
 * "Egyptian" prefix or "Supplier in Egypt" / "Exporter" tails. The H1 and
 * title tag keep the full SEO title; `seo.heading` overrides as elsewhere.
 */
export function lineLabel(page) {
  const o = page?.seo?.heading
  if (typeof o === 'string' && o.trim()) return o.trim()
  const first = String(page?.title || '').split(/ — | – | \| | · /)[0].trim()
  const t = first.replace(/^Egyptian\s+/i, '').replace(/\s+(Supplier in Egypt|Exporter)$/i, '').trim()
  return t ? t[0].toUpperCase() + t.slice(1) : first
}

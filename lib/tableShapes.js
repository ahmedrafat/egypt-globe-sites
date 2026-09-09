/**
 * tableShapes — decide how a markdown table should be SHOWN.
 *
 * Sep 2026 audit follow-up ("too many tables everywhere"). Measured on the
 * live site: 429 CMS bodies carry the same five-row "Gate | Control |
 * Evidence | Who" verification chain as a table, 376 carry a two-column
 * "Parameter | Detail" fact list drawn as a grid, and most remaining
 * tables are prose (Scope / What EGG does / Evidence issued) forced into
 * cells. A buyer reads a wall of grids and the one thing that makes the
 * group different — per-lot verification — looks like every other row.
 *
 * Rules (shape only, content untouched):
 *   qa-chain  first header is "Gate", ≥3 columns  → five-step visual chain
 *   facts     exactly 2 columns, ≥3 rows           → label / value fact grid
 *   records   ≥3 columns and long cells            → one card per row
 *   table     everything else (numeric spec tables) → real table
 *
 * Both the markdown renderer (HTML strings) and the React templates use the
 * same classifier so a body table and a template table look identical.
 */

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function classifyTable(header = [], rows = []) {
  const cols = header.length
  if (cols >= 3 && /^gate$/i.test(String(header[0]).trim())) return 'qa-chain'
  if (cols === 2 && rows.length >= 3) return 'facts'
  if (cols >= 3 && rows.length >= 1) {
    const cells = rows.flat().map(c => String(c || '').replace(/[*_`\[\]()]/g, ''))
    const avg = cells.reduce((a, c) => a + c.length, 0) / Math.max(cells.length, 1)
    const longShare = cells.filter(c => c.length > 60).length / Math.max(cells.length, 1)
    if (avg > 52 || longShare > 0.3) return 'records'
  }
  return 'table'
}

/** "1 · Extraction / source" → { n: '1', stage: 'Extraction / source' } */
export function splitGate(cell) {
  const m = String(cell || '').match(/^\s*(\d+)\s*[·.\-–—:]?\s*(.*)$/)
  return m ? { n: m[1], stage: m[2].trim() || `Gate ${m[1]}` } : { n: '', stage: String(cell || '').trim() }
}

/* ── HTML builders for the markdown renderer ─────────────────────────── */

export function qaChainHtml(header, rows, inline = esc) {
  const steps = rows.map((r, i) => {
    const g = splitGate(r[0])
    if (!g.n) g.n = String(i + 1)   // CMS rows often carry the stage name without a number
    return `<li class="egg-gate">
      <div class="egg-gate-n"><span>${esc(g.n)}</span></div>
      <div class="egg-gate-body">
        <p class="egg-gate-stage">${inline(g.stage)}</p>
        <p class="egg-gate-control">${inline(r[1] || '')}</p>
        ${r[2] ? `<p class="egg-gate-evidence"><span class="egg-gate-k">Evidence</span>${inline(r[2])}</p>` : ''}
        ${r[3] ? `<p class="egg-gate-who">${inline(r[3])}</p>` : ''}
      </div>
    </li>`
  }).join('')
  return `<div class="egg-chain my-7">
    <div class="egg-chain-head"><span class="egg-chain-kicker">Verification chain</span><span class="egg-chain-meta">${rows.length} gates · every consignment</span></div>
    <ol class="egg-chain-list">${steps}</ol>
  </div>`
}

export function factsHtml(header, rows, inline = esc) {
  const cells = rows.map(r => `<div class="egg-fact"><dt class="egg-fact-k">${inline(r[0] || '')}</dt><dd class="egg-fact-v">${inline(r[1] || '')}</dd></div>`).join('')
  return `<dl class="egg-facts my-7">${cells}</dl>`
}

export function recordsHtml(header, rows, inline = esc) {
  const cards = rows.map(r => {
    const rest = header.slice(1).map((h, i) => {
      const v = r[i + 1]
      if (!v) return ''
      return `<div class="egg-rec-row"><span class="egg-rec-k">${inline(h)}</span><span class="egg-rec-v">${inline(v)}</span></div>`
    }).join('')
    return `<li class="egg-rec"><p class="egg-rec-title">${inline(r[0] || '')}</p>${rest}</li>`
  }).join('')
  return `<ul class="egg-records my-7">${cards}</ul>`
}

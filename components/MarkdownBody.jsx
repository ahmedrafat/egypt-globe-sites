
import Icon, { iconSvg, keywordIconName } from './ui/Icon'
/**
 * MarkdownBody — clean business prose with smart visual blocks.
 *
 * Auto-detects content patterns and upgrades them to visual elements:
 *   • Bold-prefix bullet lists  → icon feature card grid
 *   • H2 / H3 headings          → keyword-derived inline icon
 *   • Bullet items with bold    → mini cards
 *   • Tables                    → clean dashboard styling
 *
 * Exports parseMarkdown(content) → { html, headings, wordCount }.
 */

function escapeHtml(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function slugify(s) {
  return String(s).toLowerCase()
    .replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'section'
}

/**
 * Pick a representative icon (emoji) for a piece of text based on its
 * keywords. Used for H2 section icons + feature-card icons. Order
 * matters: more-specific patterns first.
 */
function keywordIcon(text, cls = 'w-5 h-5') { return iconSvg(keywordIconName(text), cls) }

function renderInline(text) {
  let out = escapeHtml(text)
  out = out.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#0b8f84] hover:text-[#14161a] underline underline-offset-2 decoration-1 hover:decoration-2 transition-all font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
  out = out.replaceAll(/\*\*([^*]+)\*\*/g, '<strong class="text-[#14161a] font-semibold">$1</strong>')
  out = out.replaceAll(/(^|[^*])\*([^*\n]+)\*/g, '$1<em class="text-[#3f4650] italic">$2</em>')
  out = out.replaceAll(/`([^`]+)`/g, '<code class="bg-[#f3f4f6] text-[#14161a] px-1.5 py-0.5 rounded text-[0.9em] font-mono border border-[#14161a]/10">$1</code>')
  return out
}

/** Detect a "**Bold** sep rest" item; return parts when matched. */
function parseBoldPrefixItem(line) {
  // Matches: **Title** — rest, **Title**: rest, **Title** - rest, **Title** rest
  const m = line.match(/^\*\*([^*]+)\*\*\s*(?:[—:\-–]\s*)?(.*)$/)
  if (!m) return null
  return { title: m[1].trim(), body: (m[2] || '').trim() }
}

/** Render a feature-card grid (used when a bullet list is all bold-prefix items). */
function renderFeatureCardGrid(items) {
  // Pick column count from item count: 2 → 2, 3-4 → 2 (sm) / N (lg), 5-6 → 3, 7+ → 3
  const n = items.length
  const lgCols = n === 2 ? 2 : n === 3 ? 3 : n === 4 ? 2 : n <= 6 ? 3 : n <= 9 ? 3 : 4
  const smCols = n === 2 ? 2 : 2
  let html = `<div class="my-7 grid grid-cols-1 sm:grid-cols-${smCols} lg:grid-cols-${lgCols} gap-4">`
  for (const it of items) {
    const ico = keywordIcon(it.title + ' ' + it.body)
    html += `<div class="rounded-2xl ring-1 ring-[#14161a]/10 bg-white p-5 hover:ring-[#0fb5a5]/50 hover:shadow-sm transition-all">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-10 h-10 rounded-xl ring-1 ring-[#14161a]/15 text-[#14161a] flex items-center justify-center">${ico}</div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-[#14161a] text-[0.95rem] leading-tight">${escapeHtml(it.title)}</div>
          ${it.body ? `<div class="text-sm text-[#3f4650] mt-1.5 leading-relaxed">${renderInline(it.body)}</div>` : ''}
        </div>
      </div>
    </div>`
  }
  html += '</div>'
  return html
}

/** Render a numeric stat strip when items match "**N(+|%)?** label" pattern. */
function parseStatItem(line) {
  const m = line.match(/^\*\*([\d.,]+\s*[%+]?)\*\*\s*(?:[—:\-–]\s*)?(.*)$/)
  if (!m) return null
  return { value: m[1].trim(), label: (m[2] || '').trim() }
}
function renderStatStrip(stats) {
  const n = stats.length
  const cols = n <= 4 ? n : 4
  let html = `<div class="my-7 grid grid-cols-2 sm:grid-cols-${Math.min(cols, 4)} gap-3">`
  for (const s of stats) {
    html += `<div class="rounded-2xl bg-[#f9fafb] border border-[#14161a]/10 px-5 py-5">
      <div class="text-3xl sm:text-4xl font-semibold text-[#0b8f84] tracking-tight">${escapeHtml(s.value)}</div>
      <div class="text-xs text-[#3f4650] mt-1">${escapeHtml(s.label)}</div>
    </div>`
  }
  html += '</div>'
  return html
}

export function parseMarkdown(content) {
  if (!content?.trim()) return { html: '', headings: [], wordCount: 0 }
  const lines = content.split('\n')
  const blocks = []
  const headings = []
  let buffer = []
  let listItems = []          // collected items for the current list
  let inList = false
  let inOrderedList = false
  let inTable = false
  let tableRows = []
  let inBlockquote = false
  let blockquoteLines = []
  let wordCount = 0

  const usedIds = new Set()
  function uniqueId(base) {
    let id = base; let n = 2
    while (usedIds.has(id)) id = `${base}-${n++}`
    usedIds.add(id); return id
  }
  function countWords(text) {
    wordCount += String(text).trim().split(/\s+/).filter(Boolean).length
  }

  function flushParagraph() {
    if (buffer.length) {
      buffer.forEach(countWords)
      blocks.push(`<p class="mb-5 leading-[1.75] text-[#3f4650] text-[1.0625rem]">${buffer.map(renderInline).join('<br/>')}</p>`)
      buffer = []
    }
  }

  function flushList() {
    if (!inList && !inOrderedList) return
    if (listItems.length === 0) {
      inList = false; inOrderedList = false; return
    }
    // Smart-detect: are ALL items bold-prefix? → feature card grid.
    if (inList) {
      const stats = listItems.map(parseStatItem)
      const allStats = stats.every(Boolean) && stats.length >= 2 && stats.length <= 8
      if (allStats) {
        stats.forEach(s => { countWords(s.value); countWords(s.label) })
        blocks.push(renderStatStrip(stats))
        listItems = []; inList = false; return
      }
      const features = listItems.map(parseBoldPrefixItem)
      const allFeatures = features.every(Boolean) && features.length >= 2
      if (allFeatures) {
        features.forEach(f => { countWords(f.title); countWords(f.body) })
        blocks.push(renderFeatureCardGrid(features))
        listItems = []; inList = false; return
      }
      // Plain bullet list
      let html = '<ul class="my-5 space-y-2 text-[#3f4650] leading-relaxed [list-style:none] pl-0">'
      for (const it of listItems) {
        countWords(it)
        html += `<li class="relative pl-6 text-[1.0625rem]">
          <span aria-hidden="true" class="absolute left-0 top-[0.7em] w-1.5 h-1.5 rounded-sm bg-[#0fb5a5] rotate-45"></span>
          ${renderInline(it)}
        </li>`
      }
      html += '</ul>'
      blocks.push(html)
      listItems = []; inList = false; return
    }
    // Ordered list — keep simple decimal styling
    let html = '<ol class="my-5 space-y-2 text-[#3f4650] leading-relaxed list-decimal pl-6 marker:text-[#0b8f84] marker:font-semibold">'
    for (const it of listItems) {
      countWords(it)
      html += `<li class="text-[1.0625rem] pl-1">${renderInline(it)}</li>`
    }
    html += '</ol>'
    blocks.push(html)
    listItems = []; inOrderedList = false
  }

  function flushTable() {
    if (!inTable) return
    if (tableRows.length === 0) { inTable = false; return }
    let html = '<div class="my-7 overflow-x-auto rounded-xl border border-[#14161a]/10 bg-white shadow-sm">'
    html += '<table class="w-full text-sm">'
    const [header, ...rest] = tableRows
    if (header) {
      html += '<thead class="bg-[#f9fafb] border-b border-[#14161a]/10">'
      html += '<tr>' + header.map(c => `<th class="px-4 py-3 text-left font-semibold text-[#3f4650] text-xs uppercase tracking-wider">${renderInline(c)}</th>`).join('') + '</tr>'
      html += '</thead>'
    }
    if (rest.length) {
      html += '<tbody class="divide-y divide-[#14161a]/10">'
      for (const row of rest) {
        row.forEach(countWords)
        html += '<tr class="hover:bg-[#f9fafb] transition-colors">' +
          row.map(c => `<td class="px-4 py-3 text-[#3f4650] align-top">${renderInline(c)}</td>`).join('') + '</tr>'
      }
      html += '</tbody>'
    }
    html += '</table></div>'
    blocks.push(html)
    inTable = false; tableRows = []
  }

  function flushBlockquote() {
    if (!inBlockquote) return
    blockquoteLines.forEach(countWords)
    blocks.push(`<blockquote class="my-6 border-l-2 border-[#b8862b] bg-[#fbf7ee] pl-5 pr-4 py-3 rounded-r-md text-[#3f4650] leading-relaxed text-[1.0625rem]">${blockquoteLines.map(renderInline).join(' ')}</blockquote>`)
    inBlockquote = false; blockquoteLines = []
  }

  function flushAll() {
    flushParagraph(); flushList(); flushTable(); flushBlockquote()
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line) { flushAll(); continue }

    // Markdown table row
    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph(); flushList(); flushBlockquote()
      const cells = line.slice(1, -1).split('|').map(s => s.trim())
      if (cells.every(c => /^:?-+:?$/.test(c))) continue
      if (!inTable) { inTable = true; tableRows = [] }
      tableRows.push(cells)
      continue
    }
    if (inTable) flushTable()

    // Blockquote
    if (line.startsWith('> ')) {
      flushParagraph(); flushList()
      if (!inBlockquote) { inBlockquote = true; blockquoteLines = [] }
      blockquoteLines.push(line.slice(2))
      continue
    }
    if (inBlockquote) flushBlockquote()

    // HR
    if (/^---+$/.test(line)) {
      flushAll()
      blocks.push('<hr class="my-10 border-0 h-px bg-[#e5e7eb]" />')
      continue
    }

    // Headings — H2/H3 get a keyword-derived icon prefix
    if (line.startsWith('### ')) {
      flushAll()
      const text = line.slice(4)
      const id = uniqueId(slugify(text))
      const ico = keywordIcon(text)
      countWords(text)
      headings.push({ id, level: 3, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h3 id="${id}" class="egg-display font-medium text-xl sm:text-2xl mt-9 mb-3 text-[#14161a] tracking-tight scroll-mt-28 flex items-center gap-2.5">
        <span aria-hidden="true" class="inline-flex items-center justify-center w-7 h-7 rounded-md ring-1 ring-[#14161a]/12 text-[#0b8f84]">${ico}</span>
        <span>${renderInline(text)}</span>
      </h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      flushAll()
      const text = line.slice(3)
      const id = uniqueId(slugify(text))
      const ico = keywordIcon(text)
      countWords(text)
      headings.push({ id, level: 2, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h2 id="${id}" class="egg-display font-medium text-2xl sm:text-3xl lg:text-[2rem] mt-12 mb-5 text-[#14161a] tracking-tight scroll-mt-28 flex items-center gap-3">
        <span aria-hidden="true" class="inline-flex items-center justify-center w-9 h-9 rounded-lg ring-1 ring-[#14161a]/12 text-[#0b8f84] bg-white">${ico}</span>
        <span class="flex-1">${renderInline(text)}</span>
      </h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      flushAll()
      const text = line.slice(2)
      const id = uniqueId(slugify(text))
      countWords(text)
      headings.push({ id, level: 1, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h1 id="${id}" class="egg-display text-3xl sm:text-4xl lg:text-5xl mt-10 mb-5 text-[#14161a] tracking-tight scroll-mt-28">${renderInline(text)}</h1>`)
      continue
    }

    // Ordered list line
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inList) flushList() // close any unordered list
      if (!inOrderedList) { inOrderedList = true; listItems = [] }
      listItems.push(olMatch[2])
      continue
    }

    // Unordered list line
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inOrderedList) flushList()
      if (!inList) { inList = true; listItems = [] }
      listItems.push(line.slice(2))
      continue
    }

    flushList()
    buffer.push(line)
  }
  flushAll()

  return { html: blocks.join('\n'), headings, wordCount }
}

export default function MarkdownBody({ content }) {
  const { html } = parseMarkdown(content)
  if (!html) return null
  // Drop 142 — `[&_table]:block` + `[&_table]:overflow-x-auto` handles
  // any wide table inside markdown without forcing horizontal scroll on
  // the whole page. `[&_pre]:overflow-x-auto` does the same for code
  // blocks. `[&_img]:max-w-full [&_img]:h-auto` keeps inline images
  // from breaking out of the parent's padding.
  return (
    <div
      className="max-w-none [&_a]:break-words [&_pre]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full"
      dangerouslySetInnerHTML={{ __html: html }} />
  )
}

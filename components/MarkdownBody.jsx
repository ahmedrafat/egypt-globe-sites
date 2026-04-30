/**
 * MarkdownBody — clean, business-prose markdown renderer.
 *
 * Designed for B2B export catalogue pages — readable, scannable,
 * professional. NO magazine-style ornaments (chapter numbers, drop
 * caps, giant pull-quote marks). Just clean typography with restrained
 * brand accents.
 *
 * Exports parseMarkdown(content) → { html, headings, wordCount } for
 * any consumer that wants the heading metadata.
 */

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'section'
}

function renderInline(text) {
  let out = escapeHtml(text)
  out = out.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#1d5fa1] hover:text-[#FF6321] underline underline-offset-2 decoration-1 hover:decoration-2 transition-all font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
  out = out.replaceAll(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
  out = out.replaceAll(/(^|[^*])\*([^*\n]+)\*/g, '$1<em class="text-slate-700 italic">$2</em>')
  out = out.replaceAll(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[0.9em] font-mono border border-slate-200">$1</code>')
  return out
}

export function parseMarkdown(content) {
  if (!content?.trim()) return { html: '', headings: [], wordCount: 0 }
  const lines = content.split('\n')
  const blocks = []
  const headings = []
  let buffer = []
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
      blocks.push(`<p class="mb-5 leading-[1.75] text-slate-700 text-[1.0625rem]">${buffer.map(renderInline).join('<br/>')}</p>`)
      buffer = []
    }
  }
  function flushList() {
    if (inList) { blocks.push('</ul>'); inList = false }
    if (inOrderedList) { blocks.push('</ol>'); inOrderedList = false }
  }
  function flushTable() {
    if (!inTable) return
    if (tableRows.length === 0) { inTable = false; return }
    let html = '<div class="my-7 overflow-x-auto rounded-xl border border-slate-200 bg-white">'
    html += '<table class="w-full text-sm">'
    const [header, ...rest] = tableRows
    if (header) {
      html += '<thead class="bg-slate-50 border-b border-slate-200">'
      html += '<tr>' + header.map(c => `<th class="px-4 py-3 text-left font-semibold text-slate-700 text-xs uppercase tracking-wider">${renderInline(c)}</th>`).join('') + '</tr>'
      html += '</thead>'
    }
    if (rest.length) {
      html += '<tbody class="divide-y divide-slate-100">'
      for (const row of rest) {
        row.forEach(countWords)
        html += '<tr class="hover:bg-slate-50/40 transition-colors">' +
          row.map(c => `<td class="px-4 py-3 text-slate-700 align-top">${renderInline(c)}</td>`).join('') + '</tr>'
      }
      html += '</tbody>'
    }
    html += '</table></div>'
    blocks.push(html)
    inTable = false
    tableRows = []
  }
  function flushBlockquote() {
    if (!inBlockquote) return
    blockquoteLines.forEach(countWords)
    blocks.push(`<blockquote class="my-6 border-l-2 border-[#1d5fa1] bg-blue-50/40 pl-5 pr-4 py-3 rounded-r-md text-slate-700 leading-relaxed text-[1.0625rem]">${blockquoteLines.map(renderInline).join(' ')}</blockquote>`)
    inBlockquote = false
    blockquoteLines = []
  }
  function flushAll() {
    flushParagraph()
    flushList()
    flushTable()
    flushBlockquote()
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

    // Horizontal rule — clean thin slate divider
    if (/^---+$/.test(line)) {
      flushAll()
      blocks.push('<hr class="my-10 border-0 h-px bg-slate-200" />')
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      flushAll()
      const text = line.slice(4)
      const id = uniqueId(slugify(text))
      countWords(text)
      headings.push({ id, level: 3, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h3 id="${id}" class="text-lg sm:text-xl font-bold mt-8 mb-3 text-slate-900 tracking-tight scroll-mt-28">${renderInline(text)}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      flushAll()
      const text = line.slice(3)
      const id = uniqueId(slugify(text))
      countWords(text)
      headings.push({ id, level: 2, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h2 id="${id}" class="text-xl sm:text-2xl lg:text-[1.625rem] font-bold mt-12 mb-4 text-slate-900 tracking-tight scroll-mt-28 relative pl-4 border-l-[3px] border-[#1d5fa1]">${renderInline(text)}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      flushAll()
      const text = line.slice(2)
      const id = uniqueId(slugify(text))
      countWords(text)
      headings.push({ id, level: 1, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h1 id="${id}" class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-10 mb-5 text-slate-900 tracking-tight scroll-mt-28">${renderInline(text)}</h1>`)
      continue
    }

    // Ordered list
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inList) { blocks.push('</ul>'); inList = false }
      if (!inOrderedList) {
        blocks.push('<ol class="my-5 space-y-2 text-slate-700 leading-relaxed list-decimal pl-6 marker:text-[#1d5fa1] marker:font-semibold">')
        inOrderedList = true
      }
      countWords(olMatch[2])
      blocks.push(`<li class="text-[1.0625rem] pl-1">${renderInline(olMatch[2])}</li>`)
      continue
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inOrderedList) { blocks.push('</ol>'); inOrderedList = false }
      if (!inList) {
        blocks.push('<ul class="my-5 space-y-2 text-slate-700 leading-relaxed [list-style:none] pl-0">')
        inList = true
      }
      const text = line.slice(2)
      countWords(text)
      blocks.push(
        `<li class="relative pl-6 text-[1.0625rem]">
          <span aria-hidden="true" class="absolute left-0 top-[0.7em] w-1.5 h-1.5 rounded-sm bg-[#1d5fa1] rotate-45"></span>
          ${renderInline(text)}
        </li>`
      )
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
  return (
    <div className="max-w-none [&_a]:break-words"
      dangerouslySetInnerHTML={{ __html: html }} />
  )
}

/**
 * MarkdownBody — rich-prose markdown renderer.
 *
 * Renders headings with gradient accent bars, brand-blue bullet markers,
 * styled tables, blockquotes, code chips, and proper paragraph rhythm.
 * Server-side, zero client JS, supports the basics admins use.
 *
 * Drop 103 — full visual revolution from plain prose to proper editorial layout.
 */
function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function renderInline(text) {
  let out = escapeHtml(text)
  out = out.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#1d5fa1] hover:text-[#FF6321] underline decoration-2 underline-offset-2 decoration-[#1d5fa1]/30 hover:decoration-[#FF6321] transition-colors font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
  out = out.replaceAll(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
  out = out.replaceAll(/(^|[^*])\*([^*\n]+)\*/g, '$1<em class="text-slate-700 italic">$2</em>')
  out = out.replaceAll(/`([^`]+)`/g, '<code class="bg-blue-50 text-[#1d5fa1] px-2 py-0.5 rounded-md text-[0.9em] font-mono font-semibold border border-blue-100">$1</code>')
  return out
}

export default function MarkdownBody({ content }) {
  if (!content?.trim()) return null
  const lines = content.split('\n')
  const blocks = []
  let buffer = []
  let inList = false
  let inOrderedList = false
  let inTable = false
  let tableRows = []
  let inBlockquote = false
  let blockquoteLines = []

  function flushParagraph() {
    if (buffer.length) {
      blocks.push(`<p class="mb-5 leading-[1.8] text-slate-700 text-[1.05rem]">${buffer.map(renderInline).join('<br/>')}</p>`)
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
    let html = '<div class="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">'
    html += '<table class="w-full text-sm">'
    const [header, ...rest] = tableRows
    if (header) {
      html += '<thead class="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">'
      html += '<tr>' + header.map(c => `<th class="px-4 py-3 text-left font-bold text-slate-900 text-xs uppercase tracking-wider">${renderInline(c)}</th>`).join('') + '</tr>'
      html += '</thead>'
    }
    if (rest.length) {
      html += '<tbody class="divide-y divide-slate-100">'
      for (const row of rest) {
        html += '<tr class="hover:bg-slate-50/60 transition-colors">' +
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
    blocks.push(`<blockquote class="my-6 border-l-4 border-[#FF6321] bg-orange-50/50 pl-5 pr-4 py-4 rounded-r-xl text-slate-700 italic leading-relaxed text-[1.05rem]">${blockquoteLines.map(renderInline).join(' ')}</blockquote>`)
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

    // Empty line — break paragraphs / lists / blockquotes
    if (!line) {
      flushAll()
      continue
    }

    // Markdown table row: starts and ends with |
    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph(); flushList(); flushBlockquote()
      const cells = line.slice(1, -1).split('|').map(s => s.trim())
      // Skip the alignment row (---|---)
      if (cells.every(c => /^:?-+:?$/.test(c))) continue
      if (!inTable) { inTable = true; tableRows = [] }
      tableRows.push(cells)
      continue
    }
    if (inTable) flushTable()

    // Blockquote: > text
    if (line.startsWith('> ')) {
      flushParagraph(); flushList()
      if (!inBlockquote) { inBlockquote = true; blockquoteLines = [] }
      blockquoteLines.push(line.slice(2))
      continue
    }
    if (inBlockquote) flushBlockquote()

    // Horizontal rule
    if (/^---+$/.test(line)) {
      flushAll()
      blocks.push('<hr class="my-10 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"/>')
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      flushAll()
      blocks.push(`<h3 class="text-xl sm:text-2xl font-bold mt-10 mb-4 text-slate-900 tracking-tight relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-[#1d5fa1] before:to-[#FF6321] before:rounded-full">${renderInline(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      flushAll()
      blocks.push(`<h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mt-14 mb-6 text-slate-900 tracking-tight relative pb-3 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-16 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-[#1d5fa1] after:to-[#FF6321]">${renderInline(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      flushAll()
      blocks.push(`<h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-12 mb-6 text-slate-900 tracking-tight">${renderInline(line.slice(2))}</h1>`)
      continue
    }

    // Ordered list: 1. text
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inList) { blocks.push('</ul>'); inList = false }
      if (!inOrderedList) {
        blocks.push('<ol class="my-5 space-y-2.5 text-slate-700 leading-relaxed counter-reset-[step] [list-style:none] pl-0">')
        inOrderedList = true
      }
      blocks.push(
        `<li class="relative pl-12 text-[1.05rem]">
          <span class="absolute left-0 top-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-200/50">${olMatch[1]}</span>
          ${renderInline(olMatch[2])}
        </li>`
      )
      continue
    }

    // Unordered list: - text or * text
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inOrderedList) { blocks.push('</ol>'); inOrderedList = false }
      if (!inList) {
        blocks.push('<ul class="my-5 space-y-2.5 text-slate-700 leading-relaxed [list-style:none] pl-0">')
        inList = true
      }
      blocks.push(
        `<li class="relative pl-7 text-[1.05rem]">
          <span class="absolute left-0 top-2.5 w-2 h-2 rounded-full bg-gradient-to-br from-[#1d5fa1] to-[#FF6321] shadow-sm"></span>
          ${renderInline(line.slice(2))}
        </li>`
      )
      continue
    }

    flushList()
    buffer.push(line)
  }
  flushAll()

  return (
    <div className="prose-egg max-w-none [&_a]:break-words" dangerouslySetInnerHTML={{ __html: blocks.join('\n') }} />
  )
}

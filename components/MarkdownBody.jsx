/**
 * MarkdownBody — rich-prose markdown renderer.
 *
 * Now exports both a default React component AND a `parseMarkdown` helper
 * so the new RichPageBody can grab heading metadata for a sticky TOC.
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
    '<a href="$2" class="text-[#1d5fa1] hover:text-[#FF6321] underline decoration-2 underline-offset-2 decoration-[#1d5fa1]/30 hover:decoration-[#FF6321] transition-colors font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
  out = out.replaceAll(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
  out = out.replaceAll(/(^|[^*])\*([^*\n]+)\*/g, '$1<em class="text-slate-700 italic">$2</em>')
  out = out.replaceAll(/`([^`]+)`/g, '<code class="bg-blue-50 text-[#1d5fa1] px-2 py-0.5 rounded-md text-[0.9em] font-mono font-semibold border border-blue-100">$1</code>')
  return out
}

/**
 * Parse markdown → { html, headings, wordCount }.
 * Headings is an array of { id, level, text } for TOC.
 * Word count is a rough text-only word total for reading-time estimation.
 */
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
  let h2Number = 0
  let firstParagraphRendered = false
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
      // First paragraph gets a drop-cap treatment
      const isFirst = !firstParagraphRendered
      firstParagraphRendered = true
      const cls = isFirst
        ? 'mb-6 leading-[1.85] text-slate-700 text-[1.08rem] first-paragraph'
        : 'mb-5 leading-[1.8] text-slate-700 text-[1.05rem]'
      buffer.forEach(countWords)
      blocks.push(`<p class="${cls}">${buffer.map(renderInline).join('<br/>')}</p>`)
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
    let html = '<div class="my-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">'
    html += '<table class="w-full text-sm">'
    const [header, ...rest] = tableRows
    if (header) {
      html += '<thead class="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">'
      html += '<tr>' + header.map(c => `<th class="px-5 py-3 text-left font-bold text-slate-900 text-xs uppercase tracking-wider">${renderInline(c)}</th>`).join('') + '</tr>'
      html += '</thead>'
    }
    if (rest.length) {
      html += '<tbody class="divide-y divide-slate-100">'
      for (const row of rest) {
        row.forEach(countWords)
        html += '<tr class="hover:bg-slate-50/60 transition-colors">' +
          row.map(c => `<td class="px-5 py-3 text-slate-700 align-top">${renderInline(c)}</td>`).join('') + '</tr>'
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
    blocks.push(`<figure class="my-10">
      <blockquote class="relative border-l-4 border-[#FF6321] bg-gradient-to-br from-orange-50 via-amber-50/40 to-white pl-7 pr-6 py-6 rounded-r-2xl text-slate-800 italic leading-relaxed text-[1.15rem] shadow-sm">
        <span aria-hidden="true" class="absolute -top-3 left-3 text-5xl text-[#FF6321]/30 font-serif select-none">"</span>
        ${blockquoteLines.map(renderInline).join(' ')}
      </blockquote>
    </figure>`)
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

    // Markdown table row: starts and ends with |
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

    // Horizontal rule — fancy gradient
    if (/^---+$/.test(line)) {
      flushAll()
      blocks.push('<div class="my-12 flex items-center gap-3" aria-hidden="true"><span class="flex-1 h-px bg-gradient-to-r from-transparent to-slate-300"></span><span class="text-slate-400 text-xs">◆</span><span class="flex-1 h-px bg-gradient-to-l from-transparent to-slate-300"></span></div>')
      continue
    }

    // Headings
    if (line.startsWith('### ')) {
      flushAll()
      const text = line.slice(4)
      const id = uniqueId(slugify(text))
      countWords(text)
      headings.push({ id, level: 3, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h3 id="${id}" class="text-xl sm:text-2xl font-bold mt-12 mb-4 text-slate-900 tracking-tight relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1.5 before:bg-gradient-to-b before:from-[#1d5fa1] before:to-[#FF6321] before:rounded-full scroll-mt-28">${renderInline(text)}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      flushAll()
      const text = line.slice(3)
      const id = uniqueId(slugify(text))
      h2Number++
      countWords(text)
      headings.push({ id, level: 2, text: text.replace(/[*`]/g, '') })
      // Numbered section badge + gradient underline
      blocks.push(`<div class="mt-16 mb-8 scroll-mt-28" id="${id}">
        <div class="flex items-center gap-3 mb-4">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] text-white text-sm font-bold shadow-md shadow-blue-200/50">${String(h2Number).padStart(2, '0')}</span>
          <span class="h-px flex-1 bg-gradient-to-r from-slate-200 via-slate-200 to-transparent"></span>
        </div>
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight relative pb-3 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-20 after:h-1 after:rounded-full after:bg-gradient-to-r after:from-[#1d5fa1] after:to-[#FF6321]">${renderInline(text)}</h2>
      </div>`)
      // Reset first-paragraph drop-cap so it's just on the very first ¶ of the doc
      continue
    }
    if (line.startsWith('# ')) {
      flushAll()
      const text = line.slice(2)
      const id = uniqueId(slugify(text))
      countWords(text)
      headings.push({ id, level: 1, text: text.replace(/[*`]/g, '') })
      blocks.push(`<h1 id="${id}" class="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-12 mb-6 text-slate-900 tracking-tight scroll-mt-28">${renderInline(text)}</h1>`)
      continue
    }

    // Ordered list
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inList) { blocks.push('</ul>'); inList = false }
      if (!inOrderedList) {
        blocks.push('<ol class="my-6 space-y-3 text-slate-700 leading-relaxed [list-style:none] pl-0">')
        inOrderedList = true
      }
      countWords(olMatch[2])
      blocks.push(
        `<li class="relative pl-14 text-[1.05rem] py-0.5">
          <span class="absolute left-0 top-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-200/50">${olMatch[1]}</span>
          <span class="block pt-2">${renderInline(olMatch[2])}</span>
        </li>`
      )
      continue
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph(); flushTable(); flushBlockquote()
      if (inOrderedList) { blocks.push('</ol>'); inOrderedList = false }
      if (!inList) {
        blocks.push('<ul class="my-6 space-y-2.5 text-slate-700 leading-relaxed [list-style:none] pl-0">')
        inList = true
      }
      const text = line.slice(2)
      countWords(text)
      blocks.push(
        `<li class="relative pl-7 text-[1.05rem]">
          <span aria-hidden="true" class="absolute left-0 top-[0.7em] w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#1d5fa1] to-[#FF6321] shadow-sm"></span>
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
    <div className="prose-egg max-w-none [&_a]:break-words [&_.first-paragraph::first-letter]:float-left [&_.first-paragraph::first-letter]:text-[3.5rem] [&_.first-paragraph::first-letter]:leading-[0.9] [&_.first-paragraph::first-letter]:font-extrabold [&_.first-paragraph::first-letter]:text-[#1d5fa1] [&_.first-paragraph::first-letter]:mr-2 [&_.first-paragraph::first-letter]:mt-1 [&_.first-paragraph::first-letter]:font-serif"
      dangerouslySetInnerHTML={{ __html: html }} />
  )
}

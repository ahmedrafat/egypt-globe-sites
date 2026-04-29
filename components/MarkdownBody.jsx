/**
 * MarkdownBody — minimal server-side markdown renderer for page bodies.
 *
 * Supports the basics admins use: headings (#/##/###), bold, italic,
 * links, unordered lists, paragraphs, line breaks, inline code.
 * Light prose theme — runs at request time, ships zero JS.
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
    '<a href="$2" class="text-[#1d5fa1] hover:text-[#FF6321] underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
  out = out.replaceAll(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>')
  out = out.replaceAll(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  out = out.replaceAll(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
  return out
}

export default function MarkdownBody({ content }) {
  if (!content?.trim()) return null
  const lines = content.split('\n')
  const blocks = []
  let buffer = []
  let inList = false

  function flushParagraph() {
    if (buffer.length) {
      blocks.push(`<p class="mb-5 leading-[1.75] text-slate-700">${buffer.map(renderInline).join('<br/>')}</p>`)
      buffer = []
    }
  }
  function flushList() {
    if (inList) {
      blocks.push('</ul>')
      inList = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line) { flushParagraph(); flushList(); continue }
    if (line.startsWith('### ')) { flushParagraph(); flushList(); blocks.push(`<h3 class="text-xl font-bold mt-10 mb-3 text-slate-900">${renderInline(line.slice(4))}</h3>`); continue }
    if (line.startsWith('## '))  { flushParagraph(); flushList(); blocks.push(`<h2 class="text-2xl sm:text-3xl font-bold mt-12 mb-4 text-slate-900 tracking-tight">${renderInline(line.slice(3))}</h2>`); continue }
    if (line.startsWith('# '))   { flushParagraph(); flushList(); blocks.push(`<h1 class="text-3xl sm:text-4xl font-bold mt-12 mb-4 text-slate-900 tracking-tight">${renderInline(line.slice(2))}</h1>`); continue }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph()
      if (!inList) { blocks.push('<ul class="list-disc pl-6 space-y-2 mb-5 text-slate-700 leading-relaxed marker:text-[#1d5fa1]">'); inList = true }
      blocks.push(`<li>${renderInline(line.slice(2))}</li>`)
      continue
    }
    flushList()
    buffer.push(line)
  }
  flushParagraph(); flushList()

  return (
    <div className="prose-light max-w-none" dangerouslySetInnerHTML={{ __html: blocks.join('\n') }} />
  )
}

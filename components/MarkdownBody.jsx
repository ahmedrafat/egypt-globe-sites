/**
 * MarkdownBody — minimal server-side markdown renderer for page bodies.
 *
 * Avoids pulling in remark/rehype for now; supports the basics admin will
 * use: headings (# / ## / ###), bold (**…**), italic (*…*), links
 * ([text](url)), unordered lists (- ), paragraphs, line breaks, code (`…`).
 *
 * Server component — runs at build / request time, no client bundle cost.
 */

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function renderInline(text) {
  let out = escapeHtml(text)
  // [text](url)
  out = out.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#FF6321] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
  // **bold**
  out = out.replaceAll(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // *italic*
  out = out.replaceAll(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  // `code`
  out = out.replaceAll(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-sm">$1</code>')
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
      blocks.push(`<p class="mb-4 leading-relaxed text-gray-300">${buffer.map(renderInline).join('<br/>')}</p>`)
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
    if (line.startsWith('### ')) { flushParagraph(); flushList(); blocks.push(`<h3 class="text-xl font-bold mt-8 mb-3 text-white">${renderInline(line.slice(4))}</h3>`); continue }
    if (line.startsWith('## '))  { flushParagraph(); flushList(); blocks.push(`<h2 class="text-2xl font-bold mt-10 mb-4 text-white">${renderInline(line.slice(3))}</h2>`); continue }
    if (line.startsWith('# '))   { flushParagraph(); flushList(); blocks.push(`<h1 class="text-3xl font-bold mt-10 mb-4 text-white">${renderInline(line.slice(2))}</h1>`); continue }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph()
      if (!inList) { blocks.push('<ul class="list-disc list-inside space-y-1 mb-4 text-gray-300 ml-2">'); inList = true }
      blocks.push(`<li>${renderInline(line.slice(2))}</li>`)
      continue
    }
    flushList()
    buffer.push(line)
  }
  flushParagraph(); flushList()

  return (
    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: blocks.join('\n') }} />
  )
}

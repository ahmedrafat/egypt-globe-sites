/**
 * RichPageBody — magazine-style wrapper around MarkdownBody.
 *
 * Adds:
 *   • Reading-time + word-count + section-count meta strip at top
 *   • 12-col grid: 8 cols main content / 4 cols sticky TOC sidebar (lg+)
 *   • Auto-extracted Table of Contents from the parsed h2/h3 headings
 *   • Drop-cap on first paragraph (handled inside MarkdownBody)
 *   • Numbered section badges (handled inside MarkdownBody)
 *   • Gradient section dividers via custom HR rendering
 */
import { parseMarkdown } from './MarkdownBody'

export default function RichPageBody({ content, title }) {
  const { html, headings, wordCount } = parseMarkdown(content)
  if (!html) return null

  const readingMin = Math.max(1, Math.ceil(wordCount / 220))
  const h2s = headings.filter(h => h.level === 2)

  return (
    <div className="grid grid-cols-12 gap-8 lg:gap-12">
      {/* ── Main column (8/12) ──────────────────────────────── */}
      <div className="col-span-12 lg:col-span-8">
        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mb-8 pb-4 border-b border-slate-200">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#1d5fa1]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 101.06-1.06L10.75 9.69V5z" clipRule="evenodd"/>
            </svg>
            {readingMin} min read
          </span>
          <span className="text-slate-300">·</span>
          <span>{wordCount.toLocaleString()} words</span>
          {h2s.length > 0 && <>
            <span className="text-slate-300">·</span>
            <span>{h2s.length} sections</span>
          </>}
          <span className="ml-auto text-[10px] uppercase tracking-wider text-slate-400">
            Egypt Globe Group
          </span>
        </div>

        {/* Rendered content */}
        <article
          className="prose-egg max-w-none
            [&_a]:break-words
            [&_.first-paragraph::first-letter]:float-left
            [&_.first-paragraph::first-letter]:text-[3.8rem]
            [&_.first-paragraph::first-letter]:leading-[0.9]
            [&_.first-paragraph::first-letter]:font-extrabold
            [&_.first-paragraph::first-letter]:text-[#1d5fa1]
            [&_.first-paragraph::first-letter]:mr-2
            [&_.first-paragraph::first-letter]:mt-1
            [&_.first-paragraph::first-letter]:font-serif"
          dangerouslySetInnerHTML={{ __html: html }} />

        {/* End-of-article flourish */}
        <div className="mt-16 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <a href="#top" className="hover:text-[#1d5fa1] inline-flex items-center gap-1.5 font-semibold">
            ↑ Back to top
          </a>
          <span className="inline-flex items-center gap-1.5">
            ◆ <span className="font-mono">END</span>
          </span>
        </div>
      </div>

      {/* ── Sticky TOC sidebar (lg+ only, 4/12) ────────────── */}
      <aside className="hidden lg:block col-span-4">
        <div className="sticky top-28 space-y-5">
          {h2s.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#1d5fa1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16"/>
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  On this page
                </span>
              </div>
              <ul className="space-y-1">
                {h2s.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}
                      className="group flex items-start gap-3 text-sm text-slate-600 hover:text-[#1d5fa1] hover:bg-blue-50/50 transition-colors py-2 px-2 -mx-2 rounded-lg">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold group-hover:bg-[#1d5fa1] group-hover:text-white transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-snug pt-0.5">{h.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reading-meta micro-card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50/60 to-orange-50/40 border border-blue-100 p-5">
            <div className="text-[10px] uppercase tracking-wider font-bold text-[#1d5fa1] mb-2">
              Article info
            </div>
            <dl className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Reading time</dt>
                <dd className="font-bold text-slate-900">{readingMin} min</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Word count</dt>
                <dd className="font-bold text-slate-900">{wordCount.toLocaleString()}</dd>
              </div>
              {h2s.length > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Sections</dt>
                  <dd className="font-bold text-slate-900">{h2s.length}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </aside>
    </div>
  )
}

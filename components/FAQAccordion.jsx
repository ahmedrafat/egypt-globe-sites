/**
 * FAQAccordion — Drop 127 conversion-rate optimisation.
 *
 * Renders a clean expandable Q&A accordion on any page that has FAQs +
 * emits the `FAQPage` JSON-LD block (Drop 125's FAQJsonLd) so Google
 * shows "People Also Ask" rich SERP cards — a meaningful CTR boost in
 * B2B search results.
 *
 * Server-rendered with HTML <details> elements so it works without JS,
 * doesn't ship a client bundle, and is fully accessible. Tailwind +
 * Pelot-style design. Grouped under a heading so it integrates as a
 * normal section in PageRenderer / ProductDetailBlock.
 */
import { FAQJsonLd } from './StructuredData'

export default function FAQAccordion({ faqs, title = 'Frequently asked questions', subtitle = null, dense = false }) {
  if (!faqs?.length) return null
  return (
    <section className={`max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 ${dense ? 'py-8' : 'py-14 lg:py-20'}`}>
      <FAQJsonLd qas={faqs} />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-100 text-xl shadow-sm">
            ❓
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>

      <div className="space-y-2">
        {faqs.map((qa, i) => (
          <details
            key={i}
            className="group rounded-xl border border-slate-200 bg-white open:border-[#1d5fa1] open:shadow-md transition-all"
          >
            <summary className="cursor-pointer list-none px-5 py-4 flex items-start justify-between gap-3 hover:bg-slate-50/60 rounded-xl transition-colors">
              <span className="font-bold text-slate-900 text-base sm:text-[17px] leading-tight">
                {qa.question}
              </span>
              <span
                className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-slate-100 group-open:bg-[#1d5fa1] group-open:text-white flex items-center justify-center text-sm font-bold text-slate-600 transition-colors"
                aria-hidden="true"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm sm:text-[15px] text-slate-700 leading-relaxed border-t border-slate-100">
              <div className="pt-3" dangerouslySetInnerHTML={{ __html: linkify(qa.answer) }} />
            </div>
          </details>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-6 text-center">
        Other questions?{' '}
        <a href="mailto:export@egyptglobe.com" className="text-[#1d5fa1] font-semibold hover:underline">
          Email our export desk
        </a>{' '}
        — we respond within 24 hours.
      </p>
    </section>
  )
}

// Minimal in-place linkifier — converts `[text](path)` and bare URLs to <a>
function linkify(text) {
  if (!text) return ''
  let html = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // Markdown-style links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-[#1d5fa1] font-semibold hover:underline">$1</a>'
  )
  // Bare https URLs
  html = html.replace(
    /(?<!href=")\b(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#1d5fa1] font-semibold hover:underline">$1</a>'
  )
  return html
}

/**
 * FAQAccordion — Drop 127 conversion-rate optimisation.
 *
 * Renders a clean expandable Q&A accordion on any page that has FAQs.
 *
 * Server-rendered with HTML <details> elements so it works without JS,
 * doesn't ship a client bundle, and is fully accessible. Tailwind +
 * Pelot-style design. Grouped under a heading so it integrates as a
 * normal section in PageRenderer / ProductDetailBlock.
 *
 * Drop 161 — REMOVED inline FAQJsonLd emission. Google restricted
 * FAQ rich results to government + healthcare authority sites in
 * August 2023. As a B2B trading site we get zero rich-result benefit
 * AND risk a "structured data spam" flag from emitting boilerplate
 * FAQ schema across hundreds of SKU pages. The visual accordion stays
 * (good UX + content depth + helps long-tail SEO via natural language)
 * but the JSON-LD block is gone.
 */

export default function FAQAccordion({ faqs, title = 'Frequently asked questions', subtitle = null, dense = false }) {
  if (!faqs?.length) return null
  return (
    <section className={`max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 ${dense ? 'py-8' : 'py-14 lg:py-20'}`}>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#f9fafb] ring-1 ring-[#14161a]/10 text-xl shadow-sm">
            ❓
          </span>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-[#3f4650] text-sm sm:text-base leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>

      <div className="space-y-2">
        {faqs.map((qa, i) => (
          <details
            key={i}
            className="group rounded-xl border border-[#14161a]/10 bg-white open:border-[#0fb5a5] open:shadow-[0_18px_36px_-24px_rgba(20,22,26,.35)] transition-all"
          >
            <summary className="cursor-pointer list-none px-5 py-4 flex items-start justify-between gap-3 hover:bg-[#f9fafb] rounded-xl transition-colors">
              <span className="font-bold text-[#14161a] text-base sm:text-[17px] leading-tight">
                {qa.question}
              </span>
              <span
                className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-[#f3f4f6] group-open:bg-[#ff6321] group-open:text-white flex items-center justify-center text-sm font-bold text-[#3f4650] transition-colors"
                aria-hidden="true"
              >
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 text-sm sm:text-[15px] text-[#3f4650] leading-relaxed border-t border-[#14161a]/10">
              <div className="pt-3" dangerouslySetInnerHTML={{ __html: linkify(qa.answer) }} />
            </div>
          </details>
        ))}
      </div>

      <p className="text-xs text-[#7a8290] mt-6 text-center">
        Other questions?{' '}
        <a href="mailto:export@egyptglobe.com" className="text-[#0b8f84] font-semibold hover:underline">
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
    '<a href="$2" class="text-[#0b8f84] font-semibold hover:underline">$1</a>'
  )
  // Bare https URLs
  html = html.replace(
    /(?<!href=")\b(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#0b8f84] font-semibold hover:underline">$1</a>'
  )
  return html
}

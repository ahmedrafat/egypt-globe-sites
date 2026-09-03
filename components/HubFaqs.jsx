import { FAQJsonLd } from './StructuredData'
import FAQAccordion from './FAQAccordion'

/**
 * HubFaqs — FAQ accordion + FAQPage JSON-LD for division and sub-category
 * landings and the dedicated /products/salt route.
 *
 * Those templates return before PageRenderer's FAQ block, so a CMS row could
 * carry `seo.faqs` and never render them. This reads the page's own FAQs only:
 * hubs get no generic bank, because a shared boilerplate set on every hub is
 * exactly the duplicate content the per-page FAQs exist to replace.
 */
export default function HubFaqs({ page, title = 'Frequently asked questions' }) {
  const faqs = Array.isArray(page?.seo?.faqs)
    ? page.seo.faqs.filter(f => f?.question && f?.answer)
    : []
  if (!faqs.length) return null
  return (
    <div className="bg-[#f9fafb] border-t border-[#14161a]/10">
      <FAQJsonLd qas={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
      <FAQAccordion faqs={faqs} title={title} />
    </div>
  )
}

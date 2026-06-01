/**
 * Drop 127 — FAQ Q&A generator.
 *
 * Builds a context-aware FAQ list per page so we can both render an
 * accordion to humans AND emit FAQPage JSON-LD to search engines (which
 * Google rewards with "People Also Ask" rich SERP cards — direct CTR lift).
 *
 * Two FAQ sources:
 *  - Per-product: derived from page.{specs,certifications,packing_options,
 *    loading_ports,regions,hs_code,moq_mt,lead_time_*,price_indication}.
 *    Generates 6-10 relevant Q&As without any per-page hand-writing.
 *  - Static topical sets: contact / services / how-to-import / hs-code-glossary
 *    pages get hand-written B2B-trade-specific Q&As from a curated bank.
 */

// ─── 1. Static curated FAQ banks per page surface ──────────────────────────

export const STATIC_FAQS = {
  contact: [
    {
      question: 'How fast do you respond to a quotation request?',
      answer: 'Within 24 hours, every business day. Our export desk in Cairo handles inbound RFQs Sunday through Thursday (Egyptian working week) plus reduced cover Friday + Saturday for urgent requests.',
    },
    {
      question: 'Which Incoterms do you quote on?',
      answer: 'FOB, CIF, CFR are standard. CPT, CIP, EXW, DAP, DDP, DPU, FCA, FAS available on request. Default unless specified is CIF — buyer pays customs at destination, we handle freight + insurance.',
    },
    {
      question: 'What documentation ships with each shipment?',
      answer: 'Standard set: Commercial Invoice (Egyptian Chamber stamped), Packing List, Bill of Lading (3 originals), Certificate of Origin, Mill Test Certificate / Certificate of Analysis. Country-specific add-ons: Phytosanitary, Health Certificate, SONCAP / KEBS / SABER conformity certificates as required by the destination market.',
    },
    {
      question: 'Do you handle Letter of Credit (L/C) shipments?',
      answer: 'Yes — our export desk works with banks across Egypt (CIB, Banque Misr, NBE, Alex Bank, ADIB, Mashreq) and is comfortable with sight L/C, usance L/C, transferable L/C, and back-to-back arrangements. We provide all L/C-compliant documents on the timeline your bank requires.',
    },
    {
      question: 'What is the minimum order quantity?',
      answer: 'Per-product MOQs range from 5 MT (specialty / pharma grade) to 5,000 MT (bulk-vessel cement / fertilizer). Each product page carries its specific MOQ. Containerised cargo: typically one 20ft FCL minimum.',
    },
    {
      question: 'Can you ship to my country?',
      answer: 'Most likely yes — Egypt Globe Group runs repeat shipments to 60+ countries. We do not ship to OFAC-sanctioned destinations or to any country under Egyptian export-control restrictions. Country-specific guides at /trade-tools/import-guides — or just RFQ and we will confirm.',
    },
    {
      question: 'How do you verify product quality?',
      answer: 'Every shipment ships with a Certificate of Analysis from our internal QC lab. Independent third-party pre-shipment inspection (SGS / Intertek / Bureau Veritas) is available on request — typical cost 0.3-0.5% of FOB value. Specifications are guaranteed at port of loading and binding under the Sales Contract.',
    },
    {
      question: 'Do you offer credit terms?',
      answer: 'Standard payment is 30% advance T/T + 70% against B/L copy. Confirmed L/C at sight is also accepted (no advance). Open account terms are considered for repeat buyers with credit-insurance backing (Coface / Atradius / Allianz Trade).',
    },
  ],

  services: [
    {
      question: 'What services do you provide beyond commodity supply?',
      answer: 'Logistics & freight forwarding (air, sea, road), port operations + stevedoring, packing + bagging, pre-shipment inspection coordination, distribution + bonded warehousing, trade documentation (Letter-of-Credit document set), value-added processing (sieving, blending, drying, packaging customisation).',
    },
    {
      question: 'Do you arrange ocean freight?',
      answer: 'Yes — we have framework rates with 12+ shipping lines covering bulk vessel + container routes from all 7 Egyptian ports. We can quote freight separately on request OR include it in a CIF / CFR price.',
    },
    {
      question: 'Can you customise packing for our brand?',
      answer: 'Yes — OEM / private-label printing on PP bags, jumbo bags, drums. Minimum order quantities apply (~ 10 tonnes / packing format). We coordinate artwork sign-off + a pre-production sample before mass production.',
    },
    {
      question: 'Do you handle bonded warehousing?',
      answer: 'Yes — bonded + free-zone warehousing at Damietta, Alexandria, Sokhna for goods awaiting onward shipment / re-export / customs-released delivery. Cross-docking, sorting, repackaging, light assembly all available.',
    },
  ],

  rfq: [
    {
      question: 'What information do you need to issue a quotation?',
      answer: 'Commodity + grade + quantity + destination port + Incoterm + target packing format + payment terms preference + lead-time window. The more specific, the faster the quote. Free-text descriptions are also accepted — our team will normalise.',
    },
    {
      question: 'Can I get a quote without committing to buy?',
      answer: 'Absolutely — quotations are non-binding indications. Pricing remains valid for the quotation\'s stated validity (typically 7-14 days FOB / 14-30 days CIF). Order is committed only when a Sales Contract is countersigned.',
    },
    {
      question: 'How does sample ordering work?',
      answer: 'Pre-shipment samples (1-5 kg) ship via DHL / FedEx (typically 3-5 working days). Sample cost + courier billed separately, deductible from the first commercial-order invoice.',
    },
  ],

  about: [
    {
      question: 'How long has Egypt Globe Group been operating?',
      answer: 'Founded 2014, registered in Cairo with operational footprint at all 7 Egyptian deep-water ports plus saltworks at Bardawil + mining QC teams at Siwa / Qattara.',
    },
    {
      question: 'What is your scale?',
      answer: 'Repeat customers in 60+ destination markets. Multiple commodity divisions: Salt, Cement, Fertilizers, Chemicals, Construction Materials, Agro & Food, Industrial Minerals, Metals & Alloys.',
    },
  ],

  markets: [
    {
      question: 'How do I get pricing for a commodity covered in these briefs?',
      answer: 'These briefs intentionally do not publish pricing — spot pricing on every commodity in our catalog fluctuates daily and any number we print would be out of date the moment it ships. For a binding firm quote on a specific commodity, grade, destination port, and shipment size, use the RFQ form. Quotes are returned within 24 hours.',
    },
    {
      question: 'Can I cite these reports in tender or procurement documents?',
      answer: 'Yes — these are published Egypt Globe Group market briefs. Cite as "Egypt Globe Group — Market Intelligence" with the page URL and access date. For a custom market brief with deeper depth (named producers, freight-lane economics for your specific origin-destination pair, capacity projections), contact our trade desk.',
    },
    {
      question: 'Do you supply every commodity covered in these market briefs?',
      answer: 'We directly supply salt (rock + sea, 8 grades), cement + clinker (CEM I / CEM II / SRC / White), and select gypsum + agro-minerals. For commodities outside our direct catalog (caustic soda, palm oil, vegetable oil, NPK fertilizers, mining minerals), we operate as a trade intermediary — connecting verified Egyptian producers with international buyers, structuring L/Cs, coordinating freight, and handling export documentation.',
    },
    {
      question: 'What HS codes do you most often ship under?',
      answer: 'Most-used Egyptian export HS codes in our trade: 2501 (salt), 2520 (gypsum, plaster), 2523.29 (Portland cement), 2523.10 (clinker), 3102.10 (urea), 3105.20 (compound NPK), 1511 (palm oil), 1507 (soybean oil). Full HS code reference and tariff lookup at /trade-tools/hs-codes.',
    },
    {
      question: 'How often are market briefs updated?',
      answer: 'Annual refresh on production capacity and producer directories. Significant events (sanctions, force majeure, major capacity additions) trigger out-of-cycle updates. Subscribe via the contact form for email alerts when new briefs ship.',
    },
    {
      question: 'Which markets have the highest Egyptian commodity export growth in 2026?',
      answer: 'West Africa (cement, fertilizer) and East Africa (cement, salt, gypsum) lead by volume growth. South Asia (cement, fertilizer to Bangladesh, Sri Lanka) and Mediterranean (Italy, Lebanon, Cyprus — cement, salt, gypsum) lead by stability. Russia is recovering as a sunflower-oil supply origin into Egypt rather than a destination market.',
    },
  ],

  default: [
    {
      question: 'How do I request a quote?',
      answer: 'Use the RFQ form at /rfq, or email export@egyptglobe.com directly. We respond within 24 hours.',
    },
    {
      question: 'Where are your products sourced from?',
      answer: 'Domestic Egyptian production wherever capacity exists — covering salt (Siwa, Qattara, North Sinai, Red Sea), cement, fertilizers, agro, minerals — plus curated re-export partnerships for commodities that aren\'t Egyptian-origin.',
    },
  ],
}

// ─── 2. Per-product FAQ generator ──────────────────────────────────────────

/**
 * Build 4-6 high-value FAQs from a single egg_corporate_pages row.
 *
 * Drop 131 trim — was 10 Q&As, half of which restated facts the buyer
 * could already see in ProductDetailBlock (Loading Ports card, Origin
 * card, Commercial Terms card, HS Code row in the Specs table).
 *
 * The 5 questions kept here are the highest "People Also Ask" search-
 * intent value — buyers Google these phrasings BEFORE they land on the
 * product page, so emitting FAQPage schema for them earns rich SERP
 * cards. Questions whose answer is already a card on the page (loading
 * ports / origin / Incoterms / HS) are dropped to reduce visible noise.
 */
export function generateProductFaqs(page, commodity) {
  if (!page) return []
  const out = []
  const specs = page.specs || {}
  const certs = page.certifications || []
  const packing = page.packing_options || []

  // Q1 — purity / grade / standard (highest commercial intent)
  if (specs.nacl_min) {
    out.push({
      question: `What is the NaCl purity of ${page.title}?`,
      answer: `Minimum NaCl ${specs.nacl_min}, guaranteed per shipment via Certificate of Analysis from our internal QC lab. Independent third-party verification (SGS / Intertek / Bureau Veritas) available on request.`,
    })
  } else if (specs.standard) {
    out.push({
      question: `What standard does ${page.title} comply with?`,
      answer: `${page.title} is produced and verified to ${specs.standard}. Per-shipment Mill Test Certificate or Certificate of Analysis confirms compliance.`,
    })
  } else if (specs.compressive_28d) {
    out.push({
      question: `What is the 28-day compressive strength of ${page.title}?`,
      answer: `${specs.compressive_28d}, with the full Mill Test Certificate covering Blaine fineness, SO₃, MgO, LOI, and chloride content per shipment.`,
    })
  }

  // Q2 — packing (high search intent — "what bag size", "bulk vs FCL")
  if (packing.length > 0) {
    const list = packing.slice(0, 4).join(', ')
    const more = packing.length > 4 ? ` and ${packing.length - 4} more` : ''
    out.push({
      question: `What packing formats are available for ${page.title}?`,
      answer: `Standard formats: ${list}${more}. All formats available with OEM / private-label printing on request. Minimum order quantity per format applies.`,
    })
  }

  // Q3 — MOQ
  if (page.moq_mt) {
    out.push({
      question: `What is the minimum order quantity (MOQ) for ${page.title}?`,
      answer: `${Number(page.moq_mt).toLocaleString()} MT minimum. Lower quantities can be quoted for sample orders or specialty grades — contact our export desk to confirm.`,
    })
  }

  // Q4 — lead time (transit timing — buyers Google this for delivery planning)
  if (page.lead_time_min_weeks || page.lead_time_max_weeks) {
    const lead = page.lead_time_min_weeks && page.lead_time_max_weeks
      ? `${page.lead_time_min_weeks}–${page.lead_time_max_weeks} weeks`
      : `${page.lead_time_min_weeks || page.lead_time_max_weeks} weeks`
    out.push({
      question: `What is the lead time for ${page.title}?`,
      answer: `${lead} from order confirmation to vessel sailing. Add destination transit time on top: typically 2-3 days to GCC, 7-12 days to Europe / India, 18-22 days to East Africa, 14-17 days to West Africa.`,
    })
  }

  // Q5 — certifications (compliance / regulatory questions are high-value)
  if (certs.length > 0) {
    const certList = certs.slice(0, 5).join(', ')
    const more = certs.length > 5 ? ` and ${certs.length - 5} more` : ''
    out.push({
      question: `What certifications does ${page.title} carry?`,
      answer: `${certList}${more}. Certificates ship as PDF with each consignment + originals via courier on request.`,
    })
  }

  // Loading-ports / Origin / Incoterms / HS-code Q&As intentionally dropped
  // — those facts are now exclusive to the right-rail / inline cards in
  // ProductDetailBlock so buyers don't see the same answer 3 times on one page.
  return out
}

/**
 * Pick the right FAQ set for a given page. SKU pages get auto-generated;
 * service / contact / about / RFQ / hub pages get curated bank entries.
 */
export function faqsForPage(page, commodity) {
  if (!page) return []
  if (page.path === '/contact')           return STATIC_FAQS.contact
  if (page.path === '/rfq')               return STATIC_FAQS.rfq
  if (page.path === '/services'
   || page.path?.startsWith('/services/')) return STATIC_FAQS.services
  if (page.path === '/about'
   || page.path?.startsWith('/about/'))    return STATIC_FAQS.about
  if (page.path === '/markets'
   || page.path?.startsWith('/markets/'))  return STATIC_FAQS.markets

  // Product / SKU — auto-generate from spec data
  const productFaqs = generateProductFaqs(page, commodity)
  if (productFaqs.length >= 4) return productFaqs

  // Fallback to default trade Q&As
  return STATIC_FAQS.default
}

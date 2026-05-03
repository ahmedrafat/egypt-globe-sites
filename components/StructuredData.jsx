/**
 * StructuredData — JSON-LD schema.org renderers for SEO.
 *
 * Drop 122 (cutover-blocker): the legacy Frappe site shipped a rich
 * `Organization` schema; the new build was shipping zero structured data.
 * Lossless port + extends with `WebSite` SearchAction + `BreadcrumbList`.
 *
 * Each component emits a `<script type="application/ld+json">` block.
 * Designed for use inside `<head>` (Next.js 16 supports inline <script>
 * children inside the layout's <body> or via `dangerouslySetInnerHTML`
 * in metadata.other field — we use the simpler in-body approach).
 */

const BASE = 'https://egyptglobe.com'

export function OrganizationJsonLd({ settings }) {
  const s = settings || {}
  const sameAs = [
    s.linkedin_url,
    s.twitter_url,
    s.facebook_url,
    s.instagram_url,
  ].filter(Boolean)

  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}#org`,
        name: s.brand_name || 'Egypt Globe Group',
        legalName: s.legal_name || 'Egypt Globe Group, LLC',
        url: BASE,
        logo: {
          '@type': 'ImageObject',
          url: s.logo_url || `${BASE}/og-image.png`,
          width: 1200,
          height: 630,
        },
        description:
          'Egyptian B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals, metals. FOB / CIF from 7 Egyptian ports to 60+ countries. Quote in 24h.',
        foundingDate: s.founding_date || '2014',
        ...(s.tax_card ? { taxID: s.tax_card } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: s.phone_e164 || '+201007729844',
            contactType: 'sales',
            email: s.email || 'export@egyptglobe.com',
            areaServed: ['Africa', 'Asia', 'Europe', 'Middle East', 'Americas'],
            availableLanguage: ['English', 'Arabic'],
          },
        ],
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'EG',
          addressLocality: 'Cairo',
          ...(s.head_office ? { streetAddress: s.head_office } : {}),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}#website`,
        url: BASE,
        name: s.brand_name || 'Egypt Globe Group',
        publisher: { '@id': `${BASE}#org` },
        inLanguage: 'en',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE}/products?q={query}`,
          'query-input': 'required name=query',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

/**
 * BreadcrumbList — emits a BreadcrumbList JSON-LD block.
 * `crumbs` is an ordered array of `{name, path}` from Home → current page.
 */
export function BreadcrumbJsonLd({ crumbs }) {
  if (!crumbs || crumbs.length < 2) return null
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${BASE}${c.path}`,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

/**
 * FAQPage — emits a FAQPage JSON-LD block. `qas` is an array of
 * `{question, answer}` objects. Drop 125 — used for /contact + any blog
 * post that contains a Q&A pattern. Google rewards FAQ schema with rich
 * "People Also Ask" SERP cards.
 */
export function FAQJsonLd({ qas }) {
  if (!qas?.length) return null
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map(qa => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
      },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

/**
 * WebPage — minimal WebPage schema for non-product editorial pages
 * (about, services, blog, case studies). Drop 125 — gives Google an
 * explicit page-type hint and lets us declare lastReviewed + reviewer.
 */
export function WebPageJsonLd({ page, type = 'WebPage' }) {
  if (!page) return null
  const json = {
    '@context': 'https://schema.org',
    '@type': type,  // 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'Article'
    name: page.title,
    description: page.description,
    url: `${BASE}${page.path}`,
    isPartOf: { '@id': `${BASE}#website` },
    publisher: { '@id': `${BASE}#org` },
    ...(page.updated_at ? { dateModified: new Date(page.updated_at).toISOString() } : {}),
    ...(page.hero_photo_url ? {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: page.hero_photo_url.startsWith('/') ? `${BASE}${page.hero_photo_url}` : page.hero_photo_url,
      },
    } : {}),
    inLanguage: 'en',
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

// Drop 161 — Certification issuer inference for the new hasCertification
// markup (Google added Certification type April 2025). Maps known cert
// abbreviations to their issuing organisation so the JSON-LD links cleanly.
const CERT_ISSUERS = {
  'iso 9001': 'International Organization for Standardization',
  'iso 22000': 'International Organization for Standardization',
  'iso 14001': 'International Organization for Standardization',
  'iso 45001': 'International Organization for Standardization',
  'fssc 22000': 'Foundation FSSC',
  'haccp': 'Codex Alimentarius',
  'halal': 'Islamic Food Authority (ESIC)',
  'sgs': 'SGS SA',
  'intertek': 'Intertek Group plc',
  'bureau veritas': 'Bureau Veritas',
  'tuv': 'TÜV',
  'goeic': 'General Organization for Export & Import Control of Egypt',
  'eur1': 'European Union',
  'reach': 'European Chemicals Agency (ECHA)',
  'fda': 'US Food & Drug Administration',
  'usp': 'United States Pharmacopeia',
  'ep': 'European Directorate for the Quality of Medicines',
  'bp': 'British Pharmacopoeia Commission',
  'gmp': 'Pharmaceutical Inspection Co-operation Scheme',
  'kosher': 'Orthodox Union',
  'organic': 'EU / USDA Organic Certifiers',
  'astm': 'ASTM International',
  'en 197': 'European Committee for Standardization (CEN)',
  'en 16811': 'European Committee for Standardization (CEN)',
  'bs 3247': 'British Standards Institution',
  'gost': 'Russian Federal Agency on Technical Regulating and Metrology',
}
function inferCertIssuer(cert) {
  const low = String(cert).toLowerCase()
  for (const [k, v] of Object.entries(CERT_ISSUERS)) {
    if (low.includes(k)) return v
  }
  return null
}

// Drop 161 — make any image URL absolute (Google Product schema requires it)
function absUrl(u) {
  if (!u) return null
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  return `${BASE}${u.startsWith('/') ? '' : '/'}${u}`
}

/**
 * Product — emits a Product JSON-LD block for SKU pages.
 * Drop 161 fixes:
 *   - Image now absolute URL
 *   - HS code moved to additionalProperty (was wrongly in `gtin`/`productID`)
 *   - Certifications use new `hasCertification` + `Certification` markup
 *     (Google added April 2025) instead of the wrong `award` field
 *   - Per-brand `Brand` entity sourced from egg_letterheads (when
 *     `brand` prop passed) — Pelot Salt SKUs get Pelot Salt branding
 *     instead of the umbrella org
 *   - additionalProperty filters out duplicate sku/code keys
 *   - Description spacing cleanup (period before "Available")
 *   - Offer carries indicative priceSpecification with priceType
 *
 * @param {object} page — egg_corporate_pages row
 * @param {object} commodity — joined commodities master row
 * @param {object} visibility — buyer access flags
 * @param {object} brand — egg_letterheads row (optional, from PageRenderer.brand)
 */
export function ProductJsonLd({ page, commodity, visibility, brand }) {
  if (!page) return null
  const specs = page.specs || {}
  const certs = page.certifications || []
  const ports = page.loading_ports || []
  const regions = page.regions || []

  // HS code becomes the FIRST additionalProperty (semantically correct)
  const hsCodeProperty = page.hs_code ? [{
    '@type': 'PropertyValue',
    name: 'HS Code',
    value: String(page.hs_code),
    description: 'Harmonized System tariff classification',
  }] : []

  // Build remaining additionalProperty from specs jsonb (filter dup sku/code)
  const specProperties = Object.entries(specs)
    .filter(([k, v]) => v !== null && v !== '' && v !== undefined)
    .filter(([k]) => !['sku', 'code', 'product_code', 'hs_code'].includes(k))
    .slice(0, 20)
    .map(([name, value]) => ({
      '@type': 'PropertyValue',
      name: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: String(value),
    }))

  const additionalProperty = [...hsCodeProperty, ...specProperties]

  // Per-brand Brand entity (Drop 158 letterhead system) or umbrella org fallback
  const brandEntity = brand
    ? {
        '@type': 'Brand',
        '@id': `${BASE}#brand-${brand.brand_code.toLowerCase()}`,
        name: brand.brand_name,
        ...(brand.logo_url ? { logo: absUrl(brand.logo_url) } : {}),
        ...(brand.website ? { url: brand.website.startsWith('http') ? brand.website : `https://${brand.website}` } : {}),
        ...(brand.tagline ? { slogan: brand.tagline } : {}),
        parentOrganization: { '@id': `${BASE}#org` },
      }
    : { '@id': `${BASE}#org` }

  // Offer with indicative pricing — even without a real price, emit
  // priceSpecification with priceType so Google can still build a card.
  const offers = page.price_indication && visibility?.showPrices
    ? {
        '@type': 'Offer',
        url: `${BASE}${page.path}`,
        priceCurrency: page.price_currency || 'USD',
        price: String(page.price_indication),
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: String(page.price_indication),
          priceCurrency: page.price_currency || 'USD',
          unitText: page.price_unit || 'MT',
          valueAddedTaxIncluded: false,
        },
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${BASE}#org` },
        ...(page.moq_mt ? {
          eligibleQuantity: { '@type': 'QuantitativeValue', minValue: Number(page.moq_mt), unitCode: 'TNE', unitText: 'metric tonnes' },
        } : {}),
      }
    : {
        '@type': 'Offer',
        url: `${BASE}${page.path}`,
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          valueAddedTaxIncluded: false,
          description: 'Price on request — quote within 24h. FOB / CIF / CFR from Egyptian ports.',
        },
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${BASE}#org` },
        ...(page.moq_mt ? {
          eligibleQuantity: { '@type': 'QuantitativeValue', minValue: Number(page.moq_mt), unitCode: 'TNE', unitText: 'metric tonnes' },
        } : {}),
      }

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BASE}${page.path}#product`,
    name: page.title,
    description: page.description,
    url: `${BASE}${page.path}`,
    ...(page.hero_photo_url ? { image: [absUrl(page.hero_photo_url)] } : {}),
    // productID = our internal SKU code (a true product identifier).
    // We deliberately do NOT emit `gtin` (HS codes are not GTIN barcodes).
    ...(commodity?.code ? { productID: commodity.code, sku: commodity.code }
       : commodity?.sku  ? { productID: commodity.sku,  sku: commodity.sku  } : {}),
    brand: brandEntity,
    manufacturer: { '@id': `${BASE}#org` },
    countryOfOrigin: { '@type': 'Country', name: 'Egypt' },
    // Certifications → hasCertification + Certification entities (Google
    // added Certification markup April 2025). Replaces the wrong `award` field.
    ...(certs.length ? {
      hasCertification: certs.map(c => {
        const issuer = inferCertIssuer(c)
        return {
          '@type': 'Certification',
          name: c,
          ...(issuer ? { issuedBy: { '@type': 'Organization', name: issuer } } : {}),
        }
      }),
    } : {}),
    ...(additionalProperty.length ? { additionalProperty } : {}),
    offers,
    ...(ports.length ? {
      availableAtOrFrom: ports.map(p => ({ '@type': 'Place', name: p })),
    } : {}),
    ...(regions.length ? { areaServed: regions } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

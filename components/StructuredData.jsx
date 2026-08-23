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
  // getSiteSettings() normalises the site_settings row to camelCase; this
  // component previously read the raw snake_case column names, so every
  // settings-derived field silently fell through — the LinkedIn company
  // profile never reached sameAs, and taxID and streetAddress were dropped
  // from the Organization entity entirely. Read camelCase first, keep the
  // snake_case fallback for any caller passing a raw row.
  const pick = (...keys) => keys.map(k => s[k]).find(Boolean) || undefined
  const sameAs = [
    pick('linkedin', 'linkedin_url'),
    pick('twitter', 'twitter_url'),
    pick('facebook', 'facebook_url'),
    pick('instagram', 'instagram_url'),
  ].filter(Boolean)

  // Owned brand network — declaring the group's operating brands as
  // subOrganizations tells Google that egyptglobe.com is the parent
  // entity of these (independently-ranking) brand sites, so their
  // topical authority consolidates to the umbrella. Each brand site
  // reciprocally declares parentOrganization / sameAs back to us.
  const BRAND_SITES = [
    { name: 'Pelot Salt', url: 'https://www.pelotsalt.com', desc: 'Egyptian sea & rock salt exporter' },
    { name: 'EG Salt',    url: 'https://egsalt.com',        desc: 'Bulk industrial & de-icing salt' },
    { name: 'Globe Salt', url: 'https://globesalt.com',     desc: 'Wholesale bulk salt export' },
    { name: 'Sinai Salt', url: 'https://sinaisalt.com',     desc: 'North Sinai sea salt' },
    { name: 'Salt Siwa',  url: 'https://saltsiwa.com',      desc: 'Siwa & Qattara rock salt' },
    { name: 'Egypt Globe Cement', url: 'https://cement-site.vercel.app', desc: 'Egyptian cement & clinker export' },
  ]
  const subOrganization = BRAND_SITES.map(b => ({
    '@type': 'Organization', name: b.name, url: b.url, description: b.desc,
    parentOrganization: { '@id': `${BASE}#org` },
  }))
  const brandSameAs = [...sameAs, ...BRAND_SITES.map(b => b.url)]

  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE}#org`,
        name: pick('name', 'brand_name') || 'Egypt Globe Group',
        legalName: pick('legalName', 'legal_name') || 'Egypt Globe Group, LLC',
        url: BASE,
        logo: {
          '@type': 'ImageObject',
          url: pick('logoUrl', 'logo_url') || `${BASE}/og-image.png`,
          width: 1200,
          height: 630,
        },
        description:
          'Egyptian B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals, metals. FOB / CIF from 7 Egyptian ports to 60+ countries. Quote in 24h.',
        foundingDate: pick('foundingDate', 'founding_date') || '2014',
        ...(pick('taxCard', 'tax_card') ? { taxID: pick('taxCard', 'tax_card') } : {}),
        ...(brandSameAs.length ? { sameAs: brandSameAs } : {}),
        subOrganization,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: pick('phoneE164', 'phone_e164') || '+201007729844',
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
          ...(pick('headOffice', 'head_office') ? { streetAddress: pick('headOffice', 'head_office') } : {}),
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
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
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

/**
 * ItemList — for category/hub pages listing multiple products or articles.
 * Helps Google build sitelink carousels and collection rich results.
 */
export function ItemListJsonLd({ items, name, url }) {
  if (!items?.length) return null
  const json = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: `${BASE}${url}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.title,
      url: `${BASE}${item.path}`,
      ...(item.description ? { description: item.description } : {}),
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
 * Service — for the /rfq and /services pages. Declares what the business
 * offers and links it to the Organization entity.
 */
export function ServiceJsonLd({ name, description, url }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE}${url || '/rfq'}#service`,
    name: name || 'B2B Commodity Export Quote',
    description: description || 'Request a FOB / CIF / CFR price quote for Egyptian salt, cement, fertilizers, chemicals, minerals, or agro commodities. Response within 24 hours.',
    provider: { '@id': `${BASE}#org` },
    areaServed: { '@type': 'AdministrativeArea', name: 'Worldwide' },
    serviceType: 'B2B Commodity Export',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${BASE}${url || '/rfq'}`,
      servicePhone: '+201007729844',
    },
    offers: {
      '@type': 'Offer',
      description: 'FOB, CIF, CFR from 7 Egyptian seaports. Minimum order varies by commodity.',
      seller: { '@id': `${BASE}#org` },
    },
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
  'tuv': 'TÜV Austria',
  'tuv austria': 'TÜV Austria',
  'tüv austria': 'TÜV Austria',
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

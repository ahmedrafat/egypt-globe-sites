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

/**
 * Product — emits a Product JSON-LD block for SKU pages.
 * `page` is an egg_corporate_pages row (with specs / certifications /
 * loading_ports / hs_code / moq_mt / lead_time_*_weeks / etc.).
 * `commodity` is the joined commodities master row (optional).
 * `visibility` controls whether `offers.price` is emitted (only when
 * showPrices=true, otherwise we emit offer with price 0 + AvailableForSale).
 */
export function ProductJsonLd({ page, commodity, visibility }) {
  if (!page) return null
  const specs = page.specs || {}
  const certs = page.certifications || []
  const ports = page.loading_ports || []
  const regions = page.regions || []

  // Build additionalProperty from specs jsonb
  const additionalProperty = Object.entries(specs)
    .filter(([, v]) => v !== null && v !== '' && v !== undefined)
    .slice(0, 20) // schema limit — keep it tight
    .map(([name, value]) => ({
      '@type': 'PropertyValue',
      name: name.replace(/_/g, ' '),
      value: String(value),
    }))

  const offers = page.price_indication && visibility?.showPrices
    ? {
        '@type': 'Offer',
        priceCurrency: page.price_currency || 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: page.price_indication,
          priceCurrency: page.price_currency || 'USD',
          unitText: page.price_unit || 'MT',
        },
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${BASE}#org` },
        ...(page.moq_mt ? { eligibleQuantity: { '@type': 'QuantitativeValue', minValue: page.moq_mt, unitCode: 'TNE' } } : {}),
      }
    : {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${BASE}#org` },
        ...(page.moq_mt ? { eligibleQuantity: { '@type': 'QuantitativeValue', minValue: page.moq_mt, unitCode: 'TNE' } } : {}),
      }

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BASE}${page.path}#product`,
    name: page.title,
    description: page.description,
    url: `${BASE}${page.path}`,
    ...(page.hero_photo_url ? { image: page.hero_photo_url } : {}),
    ...(page.hs_code ? { gtin: page.hs_code, productID: page.hs_code } : {}),
    ...(commodity?.code ? { sku: commodity.code } : (commodity?.sku ? { sku: commodity.sku } : {})),
    brand: { '@id': `${BASE}#org` },
    manufacturer: { '@id': `${BASE}#org` },
    countryOfOrigin: { '@type': 'Country', name: 'Egypt' },
    ...(certs.length ? { award: certs.join(', ') } : {}),
    ...(additionalProperty.length ? { additionalProperty } : {}),
    offers,
    ...(ports.length || regions.length ? {
      areaServed: regions.length ? regions : undefined,
      availableAtOrFrom: ports.length ? ports.map(p => ({ '@type': 'Place', name: p })) : undefined,
    } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

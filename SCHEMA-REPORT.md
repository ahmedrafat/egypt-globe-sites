# Schema Markup Audit — egypt-globe-sites

**Audited:** 2026-05-03 · `www.egyptglobe.com` (prod) + `localhost:3000` (dev)
**Schema component:** `components/StructuredData.jsx` (244 lines, 5 exports: `OrganizationJsonLd`, `BreadcrumbJsonLd`, `FAQJsonLd`, `WebPageJsonLd`, `ProductJsonLd`)
**Mount point:** `app/layout.js` (Organization + WebSite global) + per-page in `PageRenderer.jsx`

---

## Executive Summary

The site already ships **rich structured data** — far better than typical B2B trading sites. JSON-LD is server-rendered (good for the December 2025 Google JS-SEO guidance), uses `@graph` to link Organization ↔ WebSite, and per-SKU pages get `Product` + `BreadcrumbList`.

**Score: 6.5 / 10 — strong foundation but 3 high-impact issues blocking rich results.**

| Page | Current Schemas | Score |
|---|---|---|
| `/` (home) | Organization, WebSite, ImageObject, ContactPoint, PostalAddress, SearchAction | ✅ Good |
| `/products/.../<sku>` | Product, BreadcrumbList, FAQPage, Organization, WebSite + nested Place/Country/Offer/QuantitativeValue/PropertyValue | ⚠️ See issues 1-4 |
| `/products/salt` (division) | Organization, WebSite only | ❌ Missing CollectionPage |
| `/coa` (CoA hub) | Organization, WebSite only | ❌ Missing CollectionPage |
| `/applications` | WebPage, FAQPage, BreadcrumbList | ⚠️ FAQ misuse |
| `/contact` | ContactPage, FAQPage, BreadcrumbList | ⚠️ FAQ misuse |
| `/services/*` | Org + WebSite only | ❌ Missing Service |
| `/tds/[...path]` | Not audited — likely Org + WebSite only | ❌ Missing TechArticle |

---

## Critical Issues (Fix These First)

### 🚨 Issue 1 — FAQ schema deployed to commercial pages (will not earn rich results, may flag as spam)

**Where:** SKU pages, `/contact`, `/applications`
**Severity:** HIGH
**Status:** Misuse — Google restricted FAQ rich results to **government and healthcare authority sites** in August 2023.

The site emits `FAQPage` schema on every product detail page (4 Q&As: packing / MOQ / lead time / certs). This is a B2B export trading site — neither government nor healthcare authority — so the markup:

- ❌ Will **not** produce rich SERP cards
- ⚠️ May flag the page for "structured data spam" if Google sees the same boilerplate Q&A across hundreds of pages
- ⏱ Adds bytes to every HTML response with zero SEO upside

**Recommendation:** Remove `FAQJsonLd` calls from `PageRenderer.jsx` everywhere except true authoritative-content pages. Keep the FAQ accordion as visible HTML content (it still helps semantically + UX) but stop emitting the JSON-LD.

```js
// In components/PageRenderer.jsx — REMOVE these lines:
{faqs.length > 0 && <FAQJsonLd qas={faqs} />}
```

The visual `<FAQAccordion qas={faqs} />` component stays — it's good content, just don't emit the JSON-LD.

---

### 🚨 Issue 2 — Relative image URL in Product schema (Google requires absolute)

**Where:** Every SKU page
**Severity:** HIGH
**Current output:**
```json
"image": "/heroes/products-salt-salt-egg-salt-001.png"
```
**Required:**
```json
"image": "https://egyptglobe.com/heroes/products-salt-salt-egg-salt-001.png"
```

Per Google's Product schema spec, `image` must be a **fully-qualified URL**. Relative paths cause the Rich Results Test to silently skip the image, and you lose the product image in SERP cards.

**Fix in `components/StructuredData.jsx` line 223:**
```js
// BEFORE
...(page.hero_photo_url ? { image: page.hero_photo_url } : {}),

// AFTER
...(page.hero_photo_url ? {
  image: page.hero_photo_url.startsWith('http')
    ? page.hero_photo_url
    : `${BASE}${page.hero_photo_url.startsWith('/') ? '' : '/'}${page.hero_photo_url}`
} : {}),
```

---

### 🚨 Issue 3 — HS code wrongly emitted as `gtin` / `productID`

**Where:** Every SKU page
**Severity:** HIGH
**Current output:**
```json
"gtin": "2501.00",
"productID": "2501.00"
```

**Why it's wrong:**
- `gtin` = Global Trade Item Number = 8/12/13/14-digit barcode (UPC/EAN/JAN/ISBN)
- HS code = Harmonized System tariff classification, 6-10 digits, **not a product identifier**
- Wrong values → Google's product validator may **reject the entire Product entity**, or worse, return wrong products in SERP

**Fix in `StructuredData.jsx` line 224:**
```js
// BEFORE
...(page.hs_code ? { gtin: page.hs_code, productID: page.hs_code } : {}),

// AFTER — surface HS code via additionalProperty (semantically correct)
// productID stays but uses our internal SKU code which is a true product ID
...(commodity?.code ? { productID: commodity.code } : {}),
```

And add HS code as an additional property:
```js
const hsCodeProperty = page.hs_code ? [{
  '@type': 'PropertyValue',
  name: 'HS Code',
  value: page.hs_code,
  description: 'Harmonized System tariff classification'
}] : []

const additionalProperty = [
  ...hsCodeProperty,
  ...Object.entries(specs).filter(...).map(...)
]
```

---

### 🚨 Issue 4 — Certifications wrongly emitted as `award`

**Where:** Every SKU page with `certifications[]`
**Severity:** MEDIUM
**Current output:**
```json
"award": "ISO 9001:2015, SGS, GOEIC"
```

**Why it's wrong:**
- `award` = prizes won (e.g. "Webby Award 2023") — not regulatory compliance
- Google added formal **`Certification` markup in April 2025** (listed in this skill's ACTIVE schemas) for industry certs
- ISO / SGS / GOEIC are exactly what Certification markup is for

**Fix:** Use the new `hasCertification` property pointing to `Certification` entities:

```js
// BEFORE
...(certs.length ? { award: certs.join(', ') } : {}),

// AFTER
...(certs.length ? {
  hasCertification: certs.map(c => ({
    '@type': 'Certification',
    name: c,
    issuedBy: { '@type': 'Organization', name: inferIssuer(c) }, // optional
  }))
} : {}),
```

Where `inferIssuer(c)`:
- `'ISO 9001:2015'` → `'International Organization for Standardization'`
- `'SGS'` → `'SGS SA'`
- `'GOEIC'` → `'General Organization for Export & Import Control of Egypt'`
- `'EUR1'` → `'European Union'`

---

## Medium Issues (Worth Fixing)

### ⚠️ Issue 5 — Product `brand` should reference the per-brand entity, not Org umbrella

**Where:** Every SKU page
**Severity:** MEDIUM (now that Drop 158 brand letterheads exist)

Current emits:
```json
"brand": { "@id": "https://egyptglobe.com#org" },
"manufacturer": { "@id": "https://egyptglobe.com#org" }
```

Pelot Salt SKUs should show `brand: Pelot Salt` (with its own logo, URL, sameAs). Same for EGG Cement etc. We already have `egg_letterheads` table per-brand from Drop 158.

**Fix:** Pass `brand` (the resolved letterhead row) to ProductJsonLd and emit a per-brand Brand entity:

```js
brand: brand ? {
  '@type': 'Brand',
  '@id': `${BASE}#brand-${brand.brand_code.toLowerCase()}`,
  name: brand.brand_name,
  ...(brand.logo_url ? { logo: brand.logo_url } : {}),
  ...(brand.website ? { url: brand.website.startsWith('http') ? brand.website : `https://${brand.website}` } : {}),
  parentOrganization: { '@id': `${BASE}#org` }
} : { '@id': `${BASE}#org` }
```

---

### ⚠️ Issue 6 — Missing `CollectionPage` on division landings

**Where:** `/products/salt`, `/products/construction`, `/applications`, `/coa`
**Severity:** MEDIUM

Division landing pages list 100+ products but emit no `CollectionPage` or `ItemList` markup. Google can't tell these are catalog pages vs articles.

**Fix:** Add a `CollectionPage` block in `PageRenderer.jsx` when `isDivisionLanding` or `isApplicationsHub` true:

```jsx
{(isDivisionLanding || isApplicationsHub || isProductsHub) && (
  <CollectionPageJsonLd
    page={page}
    items={subcategoryProducts}
  />
)}
```

See `generated-schema.json` for the full CollectionPage template.

---

### ⚠️ Issue 7 — Missing `Service` schema on /services/* pages

**Where:** `/services/logistics`, `/services/packing`, `/services/inspection`, `/services/documentation`, `/services/distribution`, `/services/added-value`, `/services/port-services`
**Severity:** MEDIUM

The 7 service-division pages (logistics / packing / inspection / etc.) currently emit only Org + WebSite. They should emit `Service` schema with `serviceType`, `provider`, `areaServed`, `offers`.

**Fix:** Detect service pages in `PageRenderer.jsx` and emit `ServiceJsonLd`:

```jsx
{page.path.startsWith('/services/') && page.path !== '/services' && (
  <ServiceJsonLd page={page} />
)}
```

See `generated-schema.json` for the Service template.

---

### ⚠️ Issue 8 — Empty `Offer` may not earn rich results

**Where:** Every SKU page when buyer is anonymous (`visibility.showPrices = false`)
**Severity:** MEDIUM
**Status:** Acceptable for B2B but suboptimal

Current Offer emits:
```json
"offers": {
  "@type": "Offer",
  "availability": "https://schema.org/InStock",
  "seller": { "@id": "https://egyptglobe.com#org" },
  "eligibleQuantity": { "@type": "QuantitativeValue", "minValue": 260, "unitCode": "TNE" }
}
```

No `price`. Google's Product Rich Results may skip this card.

**Recommendations** (pick one):
- **A. Emit indicative price**: `price: "550"`, `priceCurrency: "USD"`, `priceType: "https://schema.org/EstimatedSalePrice"` — makes it clear this is a guide, not a commitment.
- **B. Use `priceSpecification.priceType: "RFQ"`** with `priceCurrency` only.
- **C. Emit `aggregateRating`** if you collect buyer reviews — that satisfies the "must have one of price/rating/review" rule.

---

## Minor Issues

### ℹ️ Issue 9 — Description has bad spacing

Current: `"Industrial Salt — Salt. Origin: Egypt, Alexandria Available FOB / CIF..."`
Should be: `"Industrial Salt — Salt. Origin: Egypt, Alexandria. Available FOB / CIF..."` (missing period)

Likely a server-side string concat issue in `PageRenderer.jsx` description build.

### ℹ️ Issue 10 — `additionalProperty` includes `sku` (duplicate)

Top-level `sku` already set + a redundant `additionalProperty` named "sku". Filter it out:

```js
.filter(([k]) => !['sku', 'code'].includes(k))
```

### ℹ️ Issue 11 — `availableAtOrFrom` uses just port names, no UN/LOCODE or country

Current:
```json
"availableAtOrFrom": [{"@type":"Place","name":"Damietta"}]
```

Better:
```json
"availableAtOrFrom": [{
  "@type": "Place",
  "name": "Port of Damietta",
  "address": {"@type":"PostalAddress","addressCountry":"EG"},
  "identifier": {"@type":"PropertyValue","propertyID":"UN/LOCODE","value":"EGDAM"}
}]
```

We have `globe_ports` table with UN/LOCODE — easy enrichment.

---

## Validation Results Table

| Schema | Type | Status | Issues |
|--------|------|--------|--------|
| Organization | Active | ✅ | Fully compliant. `@graph` linking is correct. |
| WebSite + SearchAction | Active | ✅ | Correct. `query-input` syntax right. |
| BreadcrumbList | Active | ✅ | Correct. ListItems have position + name + item URL. |
| Product | Active | ⚠️ | Issues 2, 3, 4, 5, 8, 10, 11 — needs refactor |
| Offer (nested) | Active | ⚠️ | Missing price (Issue 8) |
| FAQPage | RESTRICTED | ❌ | Issue 1 — remove from commercial pages |
| WebPage / ContactPage | Active | ✅ | Correct. |
| ImageObject (logo) | Active | ✅ | Correct dimensions. |
| ContactPoint | Active | ✅ | Correct. Has tel + email + areaServed + languages. |
| Country | Active | ✅ | Correct. |
| QuantitativeValue | Active | ✅ | Correct. Uses TNE for tonnes. |
| PropertyValue (specs) | Active | ✅ | Mostly correct (Issues 10, 11 minor). |
| **MISSING**: CollectionPage | Active | ❌ | Issue 6 — add to landing pages |
| **MISSING**: Service | Active | ❌ | Issue 7 — add to /services/* |
| **MISSING**: Brand (per-brand) | Active | ⚠️ | Issue 5 — wire egg_letterheads |
| **MISSING**: Certification | Active (Apr 2025) | ❌ | Issue 4 — replace `award` |
| **MISSING**: TechArticle (TDS) | Active | ⚠️ | Add to /tds/[...path] |

---

## Recommended Fix Plan

### Phase 1 — High-impact (1 hour) — fixes ranking issues
1. **Remove FAQJsonLd** from SKU pages, /applications, /contact (Issue 1)
2. **Absolute image URLs** in ProductJsonLd (Issue 2)
3. **HS code → additionalProperty**, drop fake gtin (Issue 3)
4. **Certifications → hasCertification** with new Certification markup (Issue 4)

### Phase 2 — Brand identity (1 hour)
5. **Per-brand `Brand` entity** sourced from `egg_letterheads` (Issue 5)
   - Pass `brand` prop to ProductJsonLd from PageRenderer (already fetched in Drop 158)
   - Emit Brand entity with logo, sameAs, parentOrganization

### Phase 3 — Catalogue completeness (1 hour)
6. **CollectionPageJsonLd** for division landings + applications hub + /coa (Issue 6)
7. **ServiceJsonLd** for /services/* pages (Issue 7)
8. **TechArticleJsonLd** for /tds/[...path] (TDS = technical data sheet)

### Phase 4 — Polish (30 min)
9. Indicative `price` or `priceType: RFQ` on Offers (Issue 8)
10. Description spacing fix (Issue 9)
11. Drop duplicate `sku` from additionalProperty (Issue 10)
12. Enrich Place with UN/LOCODE (Issue 11)

---

## Quick Wins (5-minute fixes)

```js
// 1. components/StructuredData.jsx line 223 — absolute image URL
...(page.hero_photo_url ? {
  image: page.hero_photo_url.startsWith('http')
    ? page.hero_photo_url
    : `${BASE}${page.hero_photo_url.startsWith('/') ? '' : '/'}${page.hero_photo_url}`
} : {}),

// 2. line 224 — drop fake gtin, keep productID as internal SKU only
...(commodity?.code ? { productID: commodity.code } : {}),

// 3. line 229 — Certification markup instead of award
...(certs.length ? {
  hasCertification: certs.map(c => ({ '@type': 'Certification', name: c }))
} : {}),

// 4. line 188 — drop sku/code from additionalProperty
.filter(([k]) => !['sku', 'code'].includes(k))
```

See `generated-schema.json` for full ready-to-use templates.

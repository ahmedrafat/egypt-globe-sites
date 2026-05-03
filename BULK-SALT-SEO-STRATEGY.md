# Bulk Salt SEO Strategy — Drop 162

**Goal:** Capture high-intent B2B trade keywords around "bulk Egyptian salt" + spin up 3 new brand websites (Sinai Salt / EG Salt / Globe Salt) to triple the surface area without diluting existing rankings.

---

## What just shipped (Drop 162 — DB-level, live now)

### 1. Three new brand letterheads seeded

| Brand | Website | Positioning | Primary keyword cluster |
|---|---|---|---|
| **Sinai Salt** | sinaisalt.com | Sea salt specialist — Bardawil / El-Arish origin | "north sinai sea salt", "bardawil salt", "egyptian solar salt" |
| **EG Salt** | egsalt.com | Bulk industrial / commodity-grade | "bulk industrial salt", "deicing salt suppliers", "chlor-alkali salt" |
| **Globe Salt** | globesalt.com | Wholesale export to 60+ countries | "wholesale rock salt", "salt exporters egypt", "bulk salt shipping" |
| Pelot Salt (existing) | pelotsalt.com | Premium / specialty / food-pharma | "egyptian sea salt", "pharmaceutical salt", "fleur de sel egypt" |

Each brand carries its own logo upload (via `/master/letterheads`), colour scheme, signature labels, and footer disclaimer. CoA prints + TDS pages will use the right brand letterhead per commodity.

### 2. 52 salt SKUs renamed with "Egyptian Bulk Sea/Rock Salt" prefix

**Before:** `Sea Salt — UK Highway 1.0–6.0 mm (BS 3247:2011)`
**After:** `Egyptian Bulk Sea Salt for Deicing — UK Highway 1.0–6.0 mm (BS 3247:2011)`

The 52 affected SKUs are the **deicing (25) + industrial (15) + bulk wholesale (12)** grades — exactly the SKUs B2B buyers search for with "bulk", "wholesale", "suppliers" intent. The boutique food/cosmetic/pharma SKUs (which buyers search by name, not "bulk") were left alone.

### 3. Meta descriptions auto-generated per renamed SKU

Every renamed SKU's `egg_corporate_pages.description` was rewritten to:
```
Bulk Egyptian sea salt for export — Egyptian Bulk Sea Salt for Deicing — UK Highway 1.0–6.0 mm (BS 3247:2011).
Wholesale FOB / CIF / CFR from Damietta, Alexandria, Port Said, Ain Sokhna.
Min 260 MT order. Moisture: ≤ 1.50%. Quote in 24h.
Egypt Globe Group — 60+ destination countries.
```

That's 4 high-intent phrases ("bulk Egyptian sea salt", "wholesale FOB", "min 260 MT", "60+ countries") + the canonical product spec, in the meta description that Google reads verbatim.

---

## Keyword cluster map — what to target

### Cluster A — Bulk Sea Salt (sinaisalt.com primary, www.egyptglobe.com secondary)

| Tier | Keyword | Intent | Difficulty | Target page |
|---|---|---|---|---|
| 1 | bulk sea salt | Wholesale | High | `/products/salt` (division landing) |
| 1 | bulk sea salt suppliers | Wholesale | Medium-High | new `/wholesale/sea-salt` landing |
| 1 | bulk egyptian sea salt | Wholesale | Low-Medium 🎯 | division landing — easy win |
| 1 | bulk sea salt for deicing | Industrial | Medium | new `/applications/deicing-sea-salt` |
| 2 | wholesale sea salt for export | Trade | Medium | new `/wholesale` hub |
| 2 | sea salt FOB Damietta | Logistics | Low 🎯 | new `/ports/damietta-salt` |
| 2 | bardawil sea salt | Origin | Low 🎯 | sinaisalt.com — root brand page |
| 2 | north sinai sea salt | Origin | Low 🎯 | sinaisalt.com — about page |
| 3 | solar evaporated sea salt egypt | Process | Low 🎯 | new `/process/solar-evaporated` blog |
| 3 | mediterranean sea salt bulk | Origin | Medium | sinaisalt.com — landing |

### Cluster B — Bulk Rock Salt (egsalt.com primary)

| Tier | Keyword | Intent | Difficulty | Target page |
|---|---|---|---|---|
| 1 | bulk rock salt | Wholesale | High | `/products/salt/salt` (sub-landing) |
| 1 | bulk rock salt suppliers | Wholesale | High | new `/wholesale/rock-salt` |
| 1 | bulk egyptian rock salt | Wholesale | Low-Medium 🎯 | division landing |
| 1 | bulk rock salt for deicing | Highway | Medium-High | new `/applications/deicing-rock-salt` |
| 1 | wholesale rock salt for sale | Trade | High | new `/wholesale` |
| 2 | siwa oasis rock salt | Origin | Low 🎯 | new `/origin/siwa-oasis` blog |
| 2 | qattara depression salt | Origin | Low 🎯 | new `/origin/qattara-depression` blog |
| 2 | egyptian rock salt mine | B2B | Low 🎯 | egsalt.com — about page |
| 3 | rock salt 25kg bag wholesale | Packing | Medium | new `/packing/rock-salt-25kg` |
| 3 | bulk rock salt fob alexandria | Logistics | Low 🎯 | new `/ports/alexandria-salt` |

### Cluster C — Industrial / Chemical Salt (egsalt.com)

| Tier | Keyword | Intent | Difficulty | Target page |
|---|---|---|---|---|
| 1 | bulk industrial salt | Industrial | Medium-High | new `/applications/industrial-salt` |
| 1 | chlor-alkali salt suppliers | Specific use | Medium | new `/applications/chlor-alkali` |
| 1 | bulk salt for water treatment | Specific use | Medium | new `/applications/water-treatment-salt` |
| 2 | egyptian salt for chlor alkali | Geo-specific | Low 🎯 | egsalt.com — solutions page |
| 2 | sodium chloride bulk supplier | B2B | High | new `/wholesale/sodium-chloride` |
| 2 | drilling mud salt fine | Oilfield | Medium | new `/applications/oil-gas-salt` |
| 3 | leather tanning salt wholesale | Niche | Low 🎯 | new `/applications/leather-tanning-salt` blog |
| 3 | textile dyeing salt low iron | Niche | Low 🎯 | new `/applications/textile-dyeing-salt` blog |

### Cluster D — Deicing (highest-margin bulk segment)

| Tier | Keyword | Intent | Difficulty | Target page |
|---|---|---|---|---|
| 1 | bulk deicing salt | Highway | High | `/applications/deicing` (existing — improve) |
| 1 | bulk deicing salt suppliers | Highway | High | new `/wholesale/deicing-salt` |
| 1 | bulk road salt for sale | Highway | High | new `/wholesale/road-salt` |
| 2 | EN 16811-1 grade A deicing salt | Spec-buyer | Low 🎯 | new `/standards/en-16811-grade-a` blog |
| 2 | ASTM D632 grade 1 road salt | Spec-buyer | Low 🎯 | new `/standards/astm-d632` blog |
| 2 | BS 3247 highway salt UK | Spec-buyer | Low 🎯 | new `/standards/bs-3247` blog |
| 2 | GOST 13830 deicing salt CIS | Spec-buyer | Low 🎯 | new `/standards/gost-13830` blog |
| 3 | pre-wetted deicing salt brine | Process | Medium | new `/applications/pre-wetted-deicing` blog |
| 3 | egypt deicing salt supplier europe | Geo-trade | Low 🎯 | new `/markets/europe-deicing-salt` |

### Cluster E — Geo / Origin SEO (long-tail wins)

| Tier | Keyword | Intent | Difficulty | Target page |
|---|---|---|---|---|
| 2 | egyptian salt suppliers | Trade | Medium | division landing + wholesale hub |
| 2 | salt exporters egypt | Trade | Medium-Low 🎯 | new `/about/exporters` |
| 2 | salt manufacturers egypt | Trade | Medium-Low 🎯 | new `/about/manufacturers` |
| 3 | salt from damietta egypt | Logistics | Low 🎯 | new `/ports/damietta-salt` |
| 3 | salt from alexandria port | Logistics | Low 🎯 | new `/ports/alexandria-salt` |
| 3 | salt from port said east | Logistics | Low 🎯 | new `/ports/port-said-east-salt` |

🎯 = "easy-win" geo-specific or spec-specific keywords with low competition that we can rank top-3 within 6 weeks via clean on-page + internal linking.

---

## Content cluster — blogs & application pages to add

### Blog series — "Bulk Salt Buyer's Guide" (10 articles, 2k words each)

Each article targets a single primary keyword + 4-8 secondary keywords. Internal-link back to the relevant SKU pages and the wholesale hub.

1. **"How to Buy Bulk Egyptian Sea Salt — A 2026 Buyer's Guide"**
   - Primary: bulk egyptian sea salt
   - Hooks: MOQ tables, FOB vs CIF vs CFR explained, 7 ports + lead times, sample order process, payment terms (L/C, T/T)

2. **"Bulk Rock Salt for Deicing — EU vs US vs Nordic vs CIS Grade Comparison"**
   - Primary: bulk rock salt for deicing
   - Hooks: side-by-side spec table (EN 16811 / ASTM D632 / BS 3247 / SS-EN / GOST), FOB price ranges, container vs vessel economics

3. **"EN 16811-1 Grade A vs Grade B vs Grade C — Which Egyptian Deicing Salt Do You Need?"**
   - Primary: en 16811-1 grade a deicing salt
   - Hooks: motorway vs high-speed vs lump applications, particle size, moisture, pre-wetting compatibility

4. **"Egyptian Salt Origins — Siwa Oasis, Qattara Depression, Bardawil & North Sinai Compared"**
   - Primary: egyptian salt origins
   - Hooks: geological origin, NaCl purity per source (97%+ rock vs 95-99% sea), processing chain, port distances

5. **"Bulk Salt for Chlor-Alkali Membrane Cells — Spec, Purity & Supplier Selection"**
   - Primary: chlor-alkali salt suppliers
   - Hooks: SO₄ ≤0.08%, Ca/Mg limits, ion-exchange resin compatibility, PVC production grade

6. **"FOB Damietta vs Alexandria vs Port Said East — Egyptian Salt Loading Port Comparison"**
   - Primary: salt fob damietta vs alexandria
   - Hooks: berth depth, vessel size limits, loading rates, demurrage, port costs, transit-day map to GCC / EU / Africa

7. **"How Much Does Bulk Egyptian Salt Cost? — 2026 FOB Price Guide"**
   - Primary: bulk egyptian salt price
   - Hooks: indicative ranges per grade (industrial vs deicing vs food), volume discounts, freight cost calculator widget

8. **"Egyptian Bulk Sea Salt vs Mediterranean Spanish Salt vs Greek Salt — Buyer's Spec Comparison"**
   - Primary: egyptian sea salt vs mediterranean
   - Hooks: NaCl purity comparison, moisture profiles, FOB price, lead time, certifications

9. **"L/C-Compliant Salt Documentation — Full B/L Set From Egypt to Anywhere"**
   - Primary: salt import documentation egypt
   - Hooks: 7-doc L/C set walkthrough (Proforma / Commercial Invoice / Packing List / B/L / COO / Phytosanitary / Certificate of Analysis), bank-side checks

10. **"Pre-Wetted Deicing Salt — When You Need It and When Bulk Dry Salt Wins"**
    - Primary: pre-wetted deicing salt
    - Hooks: working temperature curves (NaCl brine vs MgCl₂), spreader compatibility, cost/km comparison

### Application landing pages (deeper than blog, transactional intent)

Each lives at `/applications/<slug>` and follows the existing IndustryPageTemplate pattern (already built in PageRenderer.jsx):

1. `/applications/deicing-sea-salt` — Bulk Sea Salt for Deicing (lists the 14 deicing sea salt SKUs)
2. `/applications/deicing-rock-salt` — Bulk Rock Salt for Deicing (lists the 12 deicing rock salt SKUs)
3. `/applications/chlor-alkali-salt` — Bulk Salt for Chlor-Alkali (PCA + PVC SKUs)
4. `/applications/water-treatment-salt` — Pool / Aquaculture / Softener
5. `/applications/oil-gas-salt` — Drilling Mud / Workover Brine
6. `/applications/leather-tanning-salt` — Hide preservation
7. `/applications/textile-dyeing-salt` — Reactive dye fixation
8. `/applications/agricultural-salt` — Soil conditioning + livestock lick
9. `/applications/road-salt` — Generic catch-all (highway / municipal)
10. `/wholesale/sea-salt`, `/wholesale/rock-salt`, `/wholesale/deicing-salt`, `/wholesale/sodium-chloride` — pure wholesale-intent landings

### Port landing pages (geo-specific bulk-FOB intent)

7 pages, one per Egyptian salt-loading port:
1. `/ports/damietta-salt` — primary salt port, all grades
2. `/ports/alexandria-salt` — rock salt + chemical grade
3. `/ports/port-said-east-salt` — North Sinai sea salt focus
4. `/ports/al-arish-salt` — Bardawil sea salt direct
5. `/ports/ain-sokhna-salt` — Red Sea salt + GCC routes
6. `/ports/el-dekheila-salt` — bulk industrial
7. `/ports/damietta-salt-loading-rates` — vessel size / demurrage / loading-rate FAQ

### Standards pages (spec-buyer intent — long-tail goldmine)

6 pages, one per international deicing / industrial standard:
1. `/standards/en-16811-1` — EU motorway / high-speed / lump
2. `/standards/astm-d632` — US/Canada
3. `/standards/bs-3247` — UK Highway
4. `/standards/ss-en-16811` — Nordic
5. `/standards/gost-13830` — CIS
6. `/standards/iso-9001-salt-suppliers` — quality-management buyer trust

---

## Internal linking pattern

Every salt SKU page should link out to:
- Its **applications landing** (e.g. deicing SKU → `/applications/deicing-rock-salt`)
- Its **standards** page (e.g. UK Highway SKU → `/standards/bs-3247`)
- Its **port** page (e.g. North Sinai SKU → `/ports/port-said-east-salt`)
- Its **brand** root (e.g. via brand_code → sinaisalt.com / egsalt.com / globesalt.com)
- The **wholesale hub** (`/wholesale/sea-salt` or `/wholesale/rock-salt`)

The blog articles should:
- Anchor-link the **primary keyword** in body to the relevant landing
- Include a "Request a Quote" CTA above the fold AND in the conclusion
- Carry `Article` schema with `mainEntity` linking to a Product entity

---

## Multi-brand domain strategy

Three new brands → three new Vercel deployments (single Next.js codebase, multi-tenant). Each domain serves a **brand-filtered subset** of the catalogue:

| Domain | Filters | Pages served |
|---|---|---|
| sinaisalt.com | `brand_code IN ('SINAI_SALT','PELOT_SALT')` AND `source_type='Sea Salt'` | ~50 sea salt SKUs + sea-salt blogs + Sinai/Bardawil origin pages |
| egsalt.com | `brand_code IN ('EG_SALT','PELOT_SALT')` AND industrial/deicing/chemical categories | ~70 bulk industrial SKUs + bulk + chlor-alkali + deicing content |
| globesalt.com | `brand_code='GLOBE_SALT'` (umbrella) — all 100 salt SKUs | Full salt catalogue + wholesale-export-focused content |

**Implementation pattern (follow-up drop):**
- Single Next.js codebase, multi-tenant via Vercel rewrites
- `middleware.ts` reads `request.headers.get('host')` → sets `BRAND_FILTER` cookie
- `lib/corporatePages.js` queries: `WHERE brand_code = ANY(...)` based on cookie
- Each brand has its own `egg_letterheads` row → letterhead component renders correct logo/colours
- Each brand has its own `sitemap.xml` (filtered) + `robots.txt`
- All point at the same Supabase DB → zero data duplication

This way you get 3 SEO surfaces with **zero content duplication risk** because each domain serves a meaningfully-different commodity slice.

---

## Recommended next drops (not yet shipped)

| Drop | Effort | Impact |
|---|---|---|
| 163 — Build the 11 wholesale + applications landing pages (use IndustryPageTemplate) | 4 hrs | High — directly captures Tier-1 bulk keywords |
| 164 — Write the 10 buyer's-guide blog articles (2k words each, sample chemistry tables) | 2-3 days | Very high — long-tail compound win |
| 165 — Build the 7 port landing pages | 3 hrs | Medium-high — easy-win geo SEO |
| 166 — Build the 6 standards pages | 2 hrs | High — spec-buyer intent (cold but high-value) |
| 167 — Spin up sinaisalt.com / egsalt.com / globesalt.com as multi-tenant Next deployments | 4 hrs | Very high — 3× SEO surface area |
| 168 — Internal link migration: every SKU links to its app/standard/port/brand/wholesale | 2 hrs | Medium-high — passes ranking equity |

---

## Live verification (right now)

- Live API: `PS_DEIC_01` returns `"Egyptian Bulk Sea Salt for Deicing — Road Grade"` ✅
- Live API: 4 brand letterheads visible (`PELOT_SALT`, `SINAI_SALT`, `EG_SALT`, `GLOBE_SALT`) ✅
- Local Next: `localhost:3000/products/salt/salt/<sku>` renders the new bulk-prefixed title ✅
- Admin: `localhost:5173/master/letterheads` shows all 4 salt brands ready for logo upload ✅

---

## Want me to ship Drop 163 next?

The wholesale + applications landing pages (Tier-1 keyword targets) are the single highest-leverage next move. They're bread-and-butter Next.js pages using the existing `IndustryPageTemplate` — ~4 hours to build all 11, no new infra needed. Just say the word.

# Apex cutover runbook — egyptglobe.com → Vercel

**Status:** ready · waiting on Cloudflare DNS A-record swap
**Owner:** Ahmed
**SEO drops covered:** 122 (foundation) + 123 (legacy redirects)

---

## What's in place (Drop 122 + 123)

| File | Purpose | Status |
|---|---|---|
| `app/robots.ts` | Allows everything, blocks `/buyer` + `/login` + `/auth/` + `/api/` | ✓ live on `egypt-globe-sites.vercel.app/robots.txt` |
| `app/sitemap.ts` | Reads all 349 published `egg_corporate_pages` rows + case studies, ISR=3600 | ✓ live on `…/sitemap.xml` (349 URLs) |
| `components/StructuredData.jsx` | `Organization` + `WebSite` + `BreadcrumbList` + `Product` JSON-LD | ✓ rich SERP cards verified |
| `public/og-image.png` | 200kB Sharp-generated fallback OG card (1200×630) | ✓ live |
| `next.config.mjs` `redirects()` | 236 hand-tuned 301 rules from `lib/legacy-redirects.json` | ✓ in build |
| `scripts/build-legacy-redirects.mjs` | Regenerator — re-run if legacy sitemap changes (`npm run redirects`) | ✓ |

---

## Cutover-day checklist (~10 minutes)

### 1. Pre-flight (T-30 minutes)
- [ ] Re-pull legacy sitemap in case anything changed
  ```bash
  curl -sk https://egyptglobe.com/sitemap.xml \
    | grep -oE 'https://egyptglobe.com[^<]*' \
    | sed 's|https://egyptglobe.com||g' \
    | sort -u > scripts/legacy-paths.txt
  npm run redirects
  ```
- [ ] If `lib/legacy-redirects.json` changed, deploy a fresh build:
  ```bash
  cd egypt-globe-sites && vercel --prod --yes
  vercel alias set <new-url> egypt-globe-sites.vercel.app
  ```
- [ ] Verify `egypt-globe-sites.vercel.app/sitemap.xml` returns 349 URLs
- [ ] Verify `egypt-globe-sites.vercel.app/robots.txt` returns the right body
- [ ] Verify `egypt-globe-sites.vercel.app/og-image.png` returns 200

### 2. Add `egyptglobe.com` to the Vercel project
- [ ] In Vercel dashboard → `egypt-globe-sites` → Settings → Domains
- [ ] Add `egyptglobe.com` and `www.egyptglobe.com`
- [ ] Vercel will display an A-record (currently `76.76.21.21`) and a CNAME for www

### 3. Cutover the DNS at Cloudflare
- [ ] Cloudflare → `egyptglobe.com` zone → DNS
- [ ] Edit the apex `A` record: change from Frappe Cloud's IP → `76.76.21.21`
- [ ] Edit the `www` `CNAME`: point to `cname.vercel-dns.com` (or whatever Vercel suggests)
- [ ] Set TTL to 60s for the cutover window (revert to Auto post-verification)
- [ ] **Disable** the orange-cloud proxy temporarily so Vercel can issue the SSL cert

### 4. Wait for SSL provisioning (~2 minutes)
- [ ] Vercel auto-provisions Let's Encrypt
- [ ] Verify `https://egyptglobe.com/` returns 200 with `server: Vercel` header

### 5. Verify legacy URLs all redirect cleanly
```bash
# Should be 200 (redirect target reached)
curl -sIk -L -o /dev/null -w "%{http_code}\n" https://egyptglobe.com/agro-products
curl -sIk -L -o /dev/null -w "%{http_code}\n" https://egyptglobe.com/products/chemicals/acids/sulfuric-acid-h2so4
curl -sIk -L -o /dev/null -w "%{http_code}\n" https://egyptglobe.com/customer-success-stories
```
Sample 25 random legacy paths and confirm 200 → 200 chain (no 404):
```bash
awk 'NR%9==0' scripts/legacy-paths.txt | head -25 | while read p; do
  code=$(curl -sIk -L -o /dev/null -w "%{http_code}" "https://egyptglobe.com$p")
  printf "  %-3s  %s\n" "$code" "$p"
done
```

### 6. GSC re-submission (T+10 minutes)
- [ ] Google Search Console → property `egyptglobe.com` → Sitemaps
- [ ] Remove the legacy `sitemap.xml` (was the Frappe one)
- [ ] Submit `https://egyptglobe.com/sitemap.xml` (the new Vercel one with 349 URLs)
- [ ] Click "Validate fix" on every URL that previously showed as a soft-404
- [ ] In URL Inspection, paste the most-trafficked legacy URLs and click "Request indexing"

### 7. Re-enable Cloudflare proxy (T+1 hour, once SSL is stable)
- [ ] Re-enable orange cloud on `A egyptglobe.com` and `CNAME www`
- [ ] Cache rules: bypass for `/sitemap.xml` and `/robots.txt` (Vercel ISR will handle freshness)

---

## Rollback plan (if something blows up)

DNS is reversible:

1. Cloudflare → `egyptglobe.com` zone → DNS
2. Revert apex A record to Frappe Cloud's original IP
3. TTL 60s means propagation is < 5 min worldwide
4. Frappe install is untouched — all old URLs come back online

The new `egypt-globe-sites.vercel.app` keeps working independently. No data loss possible.

---

## Verification numbers

Pre-cutover audit baseline (2026-05-02):
- Legacy sitemap: 267 URLs
- New site coverage: 349 published pages in `egg_corporate_pages`
- 60% of legacy URLs would 404 without redirects (15/25 sample)
- 12% of legacy URLs match new paths cleanly (3/25 sample)
- 28% of legacy URLs hit a 308 (7/25 sample)

Drop 123 redirect map:
- 30 legacy URLs are now direct 200 hits (no redirect needed)
- 224 legacy URLs map cleanly to new equivalents via 301
- 12 legacy URLs soft-fall to homepage (no equivalent — would otherwise 404)
- **Net: 0 expected 404s on cutover day** (vs ~160 without this drop)

---

## Files in this drop

- `next.config.mjs` — wires `lib/legacy-redirects.json` into Next's `redirects()`
- `lib/legacy-redirects.json` — 236-rule 301 map
- `scripts/build-legacy-redirects.mjs` — regenerator
- `scripts/legacy-paths.txt` — snapshot of pre-cutover apex sitemap (266 paths)
- `scripts/new-paths.txt` — snapshot of new site path tree (113 paths — division/sub-cat landings + service pages)
- `package.json` — `npm run redirects` script

Re-run `npm run redirects` whenever the legacy sitemap or new paths change. Commit the resulting `lib/legacy-redirects.json` and redeploy.

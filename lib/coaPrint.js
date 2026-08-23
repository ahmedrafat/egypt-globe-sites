/**
 * coaPrint.js — Drop 155 / 158. Render a stored Certificate of Analysis
 * (commodity_coa row) as a printable A4 document and trigger the
 * browser's native print dialog (which also offers "Save as PDF").
 *
 * Drop 158 — accepts a `brand` object via opts so the letterhead /
 * colours / signatures / footer / contact / legal IDs all swap per brand
 * (Pelot Salt CoAs use Pelot Salt branding, EGG Cement uses cement, etc.)
 * Brand resolved by commodity.brand_code → egg_letterheads, falls back
 * to BRAND_DEFAULTS (Egypt Globe Group umbrella) if no brand passed.
 *
 * Used by CoaCenter on the public site and CoaAdmin in egg-os.
 *
 * Design choice: native window.print() over html2pdf.js because it
 * (a) avoids the 1 MB chunk on every page that loads CoaCenter,
 * (b) lets the buyer pick paper printer OR Save-as-PDF in one dialog,
 * (c) works on every browser without polyfills.
 */

const BORDER  = '#cbd5e1'
const SOFT_BG = '#f8fafc'

// Drop 158 — fallback letterhead values used when no brand row is passed.
// Mirrors the seed for the EGG default brand in egg_letterheads.
export const BRAND_DEFAULTS = {
  brand_code: 'EGG',
  brand_name: 'Egypt Globe Group',
  short_name: 'EG',
  tagline: null,
  logo_url: null,
  logo_alt: 'Egypt Globe Group',
  address_line: 'Cairo, Egypt · Damietta operations',
  contact_email: 'export@egyptglobe.com',
  contact_phone: '+20 100 772 9844',
  website: 'www.egyptglobe.com',
  legal_identifiers: 'Commercial Registry 73418 · Tax 655-527-427 · Export Lic 600010794',
  primary_color: '#1d5fa1',
  accent_color: '#FF6321',
  ink_color: '#0f1f3a',
  footer_disclaimer: 'This Certificate of Analysis is issued by Egypt Globe Group based on test results from our internal Egypt Globe QC Lab. Independent third-party verification (SGS / Intertek / Bureau Veritas / TUV) is available on request. Specifications are guaranteed at the port of loading.',
  signature_left_label: 'QC Manager',
  signature_left_subtitle: 'Egypt Globe Group · Damietta',
  signature_right_label: 'Authorising Officer',
  signature_right_subtitle: 'Egypt Globe Group · Cairo head office',
}

// Pretty-print a parameter key like 'compressive_28d_mpa' → 'Compressive 28-day (MPa)'
const PARAM_LABELS = {
  blaine_fineness_m2_kg: 'Blaine fineness (m²/kg)',
  compressive_2d_mpa: 'Compressive 2-day (MPa)',
  compressive_7d_mpa: 'Compressive 7-day (MPa)',
  compressive_28d_mpa: 'Compressive 28-day (MPa)',
  so3_pct: 'SO₃ (%)', mgo_pct: 'MgO (%)', loi_pct: 'Loss on Ignition (%)',
  insoluble_residue_pct: 'Insoluble Residue (%)', c3a_pct: 'C₃A (%)',
  chloride_pct: 'Chloride (%)', initial_setting_min: 'Initial setting (min)',
  final_setting_min: 'Final setting (min)',
  nacl_pct: 'NaCl (%)', moisture_pct: 'Moisture (%)',
  ca_pct: 'Calcium (%)', mg_pct: 'Magnesium (%)',
  so4_pct: 'Sulphate SO₄ (%)', water_insolubles_pct: 'Water insolubles (%)',
  pb_ppm: 'Lead Pb (ppm)', as_ppm: 'Arsenic As (ppm)',
  cd_ppm: 'Cadmium Cd (ppm)', hg_ppm: 'Mercury Hg (ppm)',
  whiteness_index: 'Whiteness Index', ph: 'pH',
  nitrogen_pct: 'Nitrogen N (%)', biuret_pct: 'Biuret (%)',
  particle_size_2_4mm_pct: 'Particle size 2-4 mm (%)',
  free_acidity_pct: 'Free acidity (%)',
  sio2_pct: 'SiO₂ (%)', fe2o3_pct: 'Fe₂O₃ (%)', al2o3_pct: 'Al₂O₃ (%)',
  tio2_pct: 'TiO₂ (%)', cr2o3_pct: 'Cr₂O₃ (%)',
  particle_d50_micron: 'Particle d50 (μm)',
}

function paramLabel(k) {
  if (PARAM_LABELS[k]) return PARAM_LABELS[k]
  return String(k).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) }
  catch { return '—' }
}

function escape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

// Merge brand from opts on top of defaults — null/empty fields fall through
function resolveBrand(brand) {
  if (!brand) return BRAND_DEFAULTS
  const out = { ...BRAND_DEFAULTS }
  for (const k of Object.keys(BRAND_DEFAULTS)) {
    if (brand[k] != null && brand[k] !== '') out[k] = brand[k]
  }
  return out
}

/**
 * Build the full A4 HTML document for one CoA row (from commodity_coa
 * or commodity_coa_full). Includes letterhead, title, parties, parameters,
 * pass/fail verdict, cargo strip, signatures and footer.
 *
 * @param {object} coa — row from commodity_coa_full (joined with commodities)
 * @param {object} opts — { commodityName, commoditySku, commodityHsCode,
 *                          commodityOrigin, commodityGrade, buyer, brand }
 *                       brand: row from egg_letterheads (or null → EGG default)
 */
export function buildCoaPrintHtml(coa, opts = {}) {
  const brand = resolveBrand(opts.brand)
  const PRIMARY = brand.primary_color
  const ACCENT  = brand.accent_color
  const INK     = brand.ink_color

  const params = coa?.parameters || {}
  const passFail = coa?.pass_fail || {}
  const paramKeys = Object.keys(params).filter(k => k !== 'compliance_tested')

  const commodityName = opts.commodityName || coa?.commodity_name || 'Commodity'
  const commoditySku  = opts.commoditySku  || coa?.commodity_sku  || coa?.commodity_code || '—'
  const commodityHs   = opts.commodityHsCode || coa?.commodity_hs_code || '—'
  const commodityOrigin = opts.commodityOrigin || coa?.commodity_origin || ''
  const commodityGrade  = opts.commodityGrade  || coa?.commodity_grade  || ''

  // Verdict colour & label
  const overallPass = coa?.pass_fail === true
  const overallFail = coa?.pass_fail === false
  const verdictColour = overallPass ? '#10b981' : overallFail ? '#dc2626' : '#64748b'
  const verdictLabel  = overallPass ? '✓ PASS' : overallFail ? '✗ FAIL' : 'PENDING'

  const paramRows = paramKeys.map(k => {
    const verdictKey = `${k}_pass`
    const v = passFail[verdictKey]
    const verdictCell = v === true
      ? `<span style="color:#059669;font-weight:700">✓ Pass</span>`
      : v === false
      ? `<span style="color:#dc2626;font-weight:700">✗ Fail</span>`
      : `<span style="color:#94a3b8">—</span>`
    return `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid ${BORDER};font-weight:600;color:${INK}">${escape(paramLabel(k))}</td>
        <td style="padding:6px 8px;border-bottom:1px solid ${BORDER};font-family:'Courier New',monospace;font-weight:700;color:${PRIMARY}">${escape(params[k])}</td>
        <td style="padding:6px 8px;border-bottom:1px solid ${BORDER};text-align:center">${verdictCell}</td>
      </tr>`
  }).join('')

  // Cargo strip
  const cargoChips = []
  if (coa?.packing_name || coa?.packing_label) {
    cargoChips.push(`${escape(coa.packing_name || coa.packing_label)}${coa.packing_size_kg ? ' · ' + Number(coa.packing_size_kg) + ' kg' : ''}`)
  }
  if (coa?.quantity_mt) cargoChips.push(`${Number(coa.quantity_mt)} MT`)
  if (coa?.container_count) cargoChips.push(`${coa.container_count}× container`)
  if (coa?.vessel_name) cargoChips.push(`${escape(coa.vessel_name)}`)
  if (coa?.pol_unlocode && coa?.pod_unlocode) cargoChips.push(`${escape(coa.pol_unlocode)} → ${escape(coa.pod_unlocode)}`)
  if (coa?.bl_no) cargoChips.push(`B/L ${escape(coa.bl_no)}`)

  const cargoRow = cargoChips.length === 0 ? '' : `
    <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:14px">
      <tr>
        <td style="padding:8px 10px;border:1px solid ${BORDER};background:${SOFT_BG}">
          <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:4px">Cargo &amp; Packing</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:11px;color:${INK}">
            ${cargoChips.map(c => `<span style="background:white;border:1px solid ${BORDER};padding:3px 8px;border-radius:6px">${c}</span>`).join('')}
          </div>
        </td>
      </tr>
    </table>`

  // Letterhead — logo image OR coloured tile with short_name fallback
  const logoBlock = brand.logo_url
    ? `<img src="${escape(brand.logo_url)}" alt="${escape(brand.logo_alt || brand.brand_name)}" style="height:46px;width:auto;max-width:140px;object-fit:contain" />`
    : `<div style="width:46px;height:46px;background:${ACCENT};border-radius:10px;color:white;font-weight:900;font-size:20px;display:flex;align-items:center;justify-content:center">${escape(brand.short_name || brand.brand_code.slice(0,2))}</div>`

  const taglineLine = brand.tagline
    ? `<div style="font-size:10px;color:#64748b;margin-top:2px;font-style:italic">${escape(brand.tagline)}</div>`
    : ''

  const headerContact = [
    brand.address_line,
    [brand.contact_email, brand.website].filter(Boolean).join(' · '),
    brand.legal_identifiers,
  ].filter(Boolean).map(l => escape(l)).join('<br>')

  return `
<div id="coa-print-doc" style="width:794px;font-family:Inter,Arial,sans-serif;color:${INK};padding:32px 40px;background:white;box-sizing:border-box">
  <!-- Letterhead -->
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid ${PRIMARY};padding-bottom:14px;margin-bottom:18px">
    <div style="display:flex;align-items:center;gap:12px">
      ${logoBlock}
      <div>
        <div style="font-weight:900;font-size:18px;letter-spacing:1px;color:${INK}">${escape(brand.brand_name).toUpperCase()}</div>
        ${taglineLine}
      </div>
    </div>
    <div style="text-align:right;font-size:10.5px;color:#64748b;line-height:1.5">
      ${headerContact}
    </div>
  </div>

  <!-- Title + verdict -->
  <div style="display:flex;align-items:stretch;gap:12px;margin-bottom:14px">
    <div style="flex:1;background:linear-gradient(90deg,${PRIMARY},${PRIMARY}cc);color:white;padding:14px 18px;border-radius:8px">
      <div style="font-size:20px;font-weight:900;letter-spacing:1px">CERTIFICATE OF ANALYSIS</div>
      <div style="font-size:11px;opacity:0.85;margin-top:2px">Issued by ${escape(coa?.lab_name || 'Egypt Globe QC Lab')}${coa?.lab_certificate_no ? ' · Cert ' + escape(coa.lab_certificate_no) : ''}</div>
    </div>
    <div style="background:${verdictColour};color:white;padding:14px 22px;border-radius:8px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-width:120px">
      <div style="font-size:9px;font-weight:700;opacity:0.9;letter-spacing:1px">VERDICT</div>
      <div style="font-size:18px;font-weight:900;letter-spacing:0.5px;margin-top:2px">${verdictLabel}</div>
    </div>
  </div>

  <!-- Reference + product header -->
  <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:14px">
    <tr>
      <td style="width:50%;padding:8px;border:1px solid ${BORDER};background:${SOFT_BG};vertical-align:top">
        <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px">CoA Reference</div>
        <div style="font-family:'Courier New',monospace;font-weight:700;color:${PRIMARY};font-size:13px;margin-top:2px">${escape(coa?.ref_code || '—')}</div>
        <div style="margin-top:8px;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase">Issue date · Expiry</div>
        <div style="font-weight:600;margin-top:1px">${fmtDate(coa?.issue_date)} → ${fmtDate(coa?.expiry_date)}</div>
        ${coa?.market_region ? `<div style="margin-top:8px;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase">Market region</div>
          <div style="font-weight:600;margin-top:1px">${escape(coa.market_region)}</div>` : ''}
      </td>
      <td style="width:50%;padding:8px;border:1px solid ${BORDER};vertical-align:top">
        <div style="font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px">Buyer</div>
        <div style="font-weight:700;margin-top:2px">${escape(opts.buyer || '________________________')}</div>
        ${coa?.batch_ref ? `<div style="margin-top:8px;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase">Batch / Lot reference</div>
          <div style="font-family:'Courier New',monospace;font-weight:700;color:${INK};margin-top:1px">${escape(coa.batch_ref)}</div>` : ''}
        ${coa?.sample_date || coa?.analysis_date ? `<div style="margin-top:8px;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase">Sampled · Analysed</div>
          <div>${fmtDate(coa?.sample_date)} · ${fmtDate(coa?.analysis_date)}</div>` : ''}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:8px;border:1px solid ${BORDER};border-top:none;background:#fff7ed">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:18px">
          <div style="flex:1">
            <div style="font-size:9px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:0.6px">Product</div>
            <div style="font-weight:900;font-size:14px;color:${INK};margin-top:1px">${escape(commodityName)}</div>
            <div style="font-size:10px;color:#64748b;margin-top:1px">
              SKU <span style="font-family:'Courier New',monospace;font-weight:700;color:${PRIMARY}">${escape(commoditySku)}</span>
              · HS <span style="font-family:'Courier New',monospace;font-weight:700">${escape(commodityHs)}</span>
              ${commodityGrade  ? ' · Grade '  + escape(commodityGrade)  : ''}
              ${commodityOrigin ? ' · Origin ' + escape(commodityOrigin) : ''}
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>

  ${cargoRow}

  <!-- Spec table -->
  <table style="width:100%;border-collapse:collapse;font-size:11px">
    <thead>
      <tr style="background:${PRIMARY};color:white;font-size:9.5px;text-transform:uppercase;letter-spacing:0.6px">
        <th style="padding:8px 10px;text-align:left;width:55%">Parameter</th>
        <th style="padding:8px 10px;text-align:left;width:25%">Result</th>
        <th style="padding:8px 10px;text-align:center;width:20%">Pass / Fail</th>
      </tr>
    </thead>
    <tbody>
      ${paramRows || `<tr><td colspan="3" style="padding:24px;text-align:center;color:#94a3b8;font-style:italic">No measured parameters recorded for this CoA yet.</td></tr>`}
    </tbody>
  </table>

  ${coa?.overall_result ? `
    <div style="margin-top:10px;padding:10px 14px;border-left:4px solid ${verdictColour};background:${SOFT_BG};font-size:11px;color:${INK}">
      <strong style="text-transform:uppercase;font-size:9px;color:#64748b;letter-spacing:0.6px">Overall result</strong><br>
      ${escape(coa.overall_result)}
    </div>` : ''}

  ${coa?.notes ? `
    <div style="margin-top:10px;font-size:10.5px;color:#475569;line-height:1.5">
      <strong style="color:${INK}">Notes:</strong> ${escape(coa.notes)}
    </div>` : ''}

  <!-- Signatures -->
  <table style="width:100%;border-collapse:collapse;margin-top:30px;font-size:10.5px">
    <tr>
      <td style="width:50%;padding:8px;vertical-align:bottom">
        <div style="border-top:1px solid ${INK};padding-top:5px">
          <div style="font-weight:700;font-size:11px">${escape(brand.signature_left_label)}</div>
          ${brand.signature_left_subtitle ? `<div style="font-size:9.5px;color:#64748b">${escape(brand.signature_left_subtitle)}</div>` : ''}
          <div style="margin-top:14px;font-size:9px;color:#94a3b8">Stamp / Signature / Date</div>
        </div>
      </td>
      <td style="width:50%;padding:8px;vertical-align:bottom">
        <div style="border-top:1px solid ${INK};padding-top:5px">
          <div style="font-weight:700;font-size:11px">${escape(brand.signature_right_label)}</div>
          ${brand.signature_right_subtitle ? `<div style="font-size:9.5px;color:#64748b">${escape(brand.signature_right_subtitle)}</div>` : ''}
          <div style="margin-top:14px;font-size:9px;color:#94a3b8">Stamp / Signature / Date</div>
        </div>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div style="border-top:1px solid ${BORDER};margin-top:24px;padding-top:8px;font-size:8.5px;color:#94a3b8;text-align:center;line-height:1.5">
    ${escape(brand.footer_disclaimer)}
    <br>Document reference: ${escape(coa?.ref_code || '—')}
  </div>
</div>`
}

/**
 * Open a popup window with the CoA HTML and trigger the browser's print
 * dialog. The user can then choose Save-as-PDF or paper printer.
 *
 * @param {object} coa  — CoA row from commodity_coa_full
 * @param {object} opts — see buildCoaPrintHtml — pass `brand` for per-brand
 *                        letterhead, otherwise EGG default is used
 */
export function printCoa(coa, opts = {}) {
  if (typeof window === 'undefined') return false
  const brand = resolveBrand(opts.brand)
  const html = buildCoaPrintHtml(coa, opts)
  const win = window.open('', '_blank', 'width=900,height=1200')
  if (!win) {
    alert('Print window blocked by your browser. Please allow popups for this site and try again.')
    return false
  }
  const refCode = coa?.ref_code || 'CoA'
  const title = `${refCode} — ${brand.brand_name}`
  win.document.open()
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escape(title)}</title>
  <style>
    @page { size: A4; margin: 0; }
    @media screen {
      body { background: #e2e8f0; padding: 24px 0; margin: 0; }
      #coa-print-doc { box-shadow: 0 8px 32px rgba(0,0,0,0.14); margin: 0 auto; }
      #print-toolbar {
        position: fixed; top: 12px; right: 12px; z-index: 10;
        display: flex; gap: 8px; font-family: Inter, Arial, sans-serif;
      }
      #print-toolbar button {
        background: ${brand.primary_color}; color: white; border: 0; font-weight: 700;
        font-size: 13px; padding: 10px 16px; border-radius: 8px;
        cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      #print-toolbar button:hover { opacity: 0.9; }
      #print-toolbar .secondary { background: white; color: ${brand.primary_color}; border: 1px solid #cbd5e1; }
      #print-toolbar .secondary:hover { background: #f8fafc; }
    }
    @media print {
      #print-toolbar { display: none !important; }
      body { background: white; padding: 0; margin: 0; }
      #coa-print-doc { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div id="print-toolbar">
    <button onclick="window.print()">Print / Save as PDF</button>
    <button class="secondary" onclick="window.close()">Close</button>
  </div>
  ${html}
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>
</body>
</html>`)
  win.document.close()
  return true
}

// Drop 158 — brand resolution lives in lib/corporatePages.js (server) for
// the public site, and in egg-os it's done inline in CoaAdmin (client). The
// resolved brand is passed in via opts.brand. Keep this module pure (no
// supabase import) so it works in any context — RSC, client, popup window.

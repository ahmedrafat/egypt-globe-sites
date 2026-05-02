'use client'

/**
 * RFQForm — public B2B request-for-quote form.
 *
 * Submits a row to `market_rfqs` via the anon publishable key (RLS
 * allows anon INSERT only — no SELECT). Source is tagged
 * `egyptglobe-website` so the EGG OS triage UI can route correctly.
 *
 * Product selector pulls the full product row from the catalogue
 * (specs jsonb + certifications + packing + applications + regions +
 * commercial terms) so the form can render every QC parameter inline
 * the moment a product is chosen — no second round trip.
 *
 * Destination ports come from the master `globe_ports` registry
 * grouped by region (Mediterranean / North Europe / Far East / etc.).
 */
import { useState, useMemo, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const INCOTERMS = ['FOB', 'CIF', 'CFR', 'CPT', 'CIP', 'EXW', 'DAP', 'DDP', 'DPU', 'FCA', 'FAS']
const UNITS = ['MT', 'kg', 'FCL 20ft', 'FCL 40ft', 'FCL 40HC', 'L', 'tonnes (1000 kg)', 'units']
const CURRENCIES = ['USD', 'EUR', 'EGP', 'GBP', 'CNY']
const COUNTRIES = [
  'United Arab Emirates','Saudi Arabia','Kuwait','Qatar','Oman','Bahrain',
  'Kenya','Tanzania','Uganda','Rwanda','South Africa','Nigeria','Ghana','Ivory Coast','Senegal',
  'Italy','Spain','Greece','France','Germany','Netherlands','Belgium','United Kingdom','Ireland','Portugal','Romania',
  'Turkey','Lebanon','Jordan','Iraq','Israel',
  'India','Pakistan','Bangladesh','Sri Lanka','Indonesia','Vietnam','Philippines','Malaysia','Singapore','Thailand','China','South Korea','Japan',
  'United States','Canada','Mexico','Brazil','Argentina','Chile','Peru',
  'Australia','New Zealand',
  'Other',
]

const SPEC_LABELS = {
  nacl_min: 'NaCl min',
  moisture_max: 'Moisture max',
  particle_size: 'Particle size',
  bulk_density: 'Bulk density',
  ca_max: 'Ca max',
  mg_max: 'Mg max',
  so4_max: 'SO₄ max',
  water_insolubles: 'Water insolubles',
  pb_max: 'Lead (Pb)',
  as_max: 'Arsenic (As)',
  cd_max: 'Cadmium (Cd)',
  hg_max: 'Mercury (Hg)',
  ph_range: 'pH range',
  colour: 'Colour',
  appearance: 'Appearance',
  grain_label: 'Grain',
  source_type: 'Source',
  origin: 'Origin',
  storage_conditions: 'Storage',
  shelf_life_months: 'Shelf life',
  product_code: 'Product code',
  // Cement / fertilizer / chemical fallbacks
  standard: 'Standard',
  compressive_28d: 'Compressive 28-day',
  blaine_fineness: 'Blaine fineness',
  so3_max: 'SO₃ max',
  c3a: 'C₃A',
  nitrogen_min: 'N min',
  k2o_min: 'K₂O min',
  p2o5_min: 'P₂O₅ min',
  concentration: 'Concentration',
  un_number: 'UN number',
}
const prettyKey = k => SPEC_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export default function RFQForm({ products, destPorts, preselectPath, requestType = 'quote', supabaseUrl, supabaseAnon }) {
  const isCoa = requestType === 'coa'
  const supabase = useMemo(
    () => createClient(supabaseUrl, supabaseAnon),
    [supabaseUrl, supabaseAnon]
  )

  // Group products by category for the dropdown
  const productGroups = useMemo(() => {
    const g = {}
    for (const p of (products || [])) {
      const cat = p.category || 'other'
      if (!g[cat]) g[cat] = []
      g[cat].push(p)
    }
    return g
  }, [products])

  // Group dest ports by region for optgroup display
  const portGroups = useMemo(() => {
    const g = {}
    for (const port of (destPorts || [])) {
      const r = port.region || 'Other'
      if (!g[r]) g[r] = []
      g[r].push(port)
    }
    return g
  }, [destPorts])

  const initialProduct = useMemo(() => {
    if (!preselectPath) return null
    return (products || []).find(p => p.path === preselectPath) || null
  }, [products, preselectPath])

  const [form, setForm] = useState({
    company: '', contact: '', email: '', phone: '', country: '',
    productCategory: initialProduct?.category || '',
    productPath: initialProduct?.path || '',
    commodity: initialProduct?.title || '',
    quantity: '', unit: 'MT',
    target_price: '', currency: 'USD',
    incoterm: 'CIF', dest_port: '',
    packaging: (initialProduct?.packing_options?.[0]) || '',
    certs_needed: (initialProduct?.certifications || []).slice(0, 3).join(', '),
    timeline: '',
    message: '',
    requested_specs: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [refCode, setRefCode] = useState(null)
  const [showAllSpecs, setShowAllSpecs] = useState(false)

  // Sorted category list with icons for the first-step picker
  const CATEGORY_META_LIST = [
    { id: 'salt',         label: 'Salt',                icon: '🧂' },
    { id: 'fertilizers',  label: 'Fertilizers',         icon: '🌾' },
    { id: 'chemicals',    label: 'Chemicals',           icon: '⚗️' },
    { id: 'construction', label: 'Construction',        icon: '🏗' },
    { id: 'agro',         label: 'Agro & Food',         icon: '🍅' },
    { id: 'minerals',     label: 'Industrial Minerals', icon: '⛰' },
    { id: 'metals',       label: 'Metals & Alloys',     icon: '⚙️' },
  ]
  // Only show categories that actually have products
  const availableCategories = useMemo(
    () => CATEGORY_META_LIST.filter(c => (productGroups[c.id] || []).length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productGroups]
  )

  // Products filtered to the chosen category (alphabetically)
  const productsInCategory = useMemo(() => {
    if (!form.productCategory) return []
    return [...(productGroups[form.productCategory] || [])]
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [form.productCategory, productGroups])

  function selectCategory(catId) {
    setForm(f => ({
      ...f,
      productCategory: catId,
      // Clear the product selection when category changes
      productPath: '',
      commodity: '',
    }))
    setShowAllSpecs(false)
  }

  function selectProduct(path) {
    const p = (products || []).find(x => x.path === path)
    setForm(f => ({
      ...f,
      productPath: path,
      productCategory: p?.category || f.productCategory,
      commodity: p?.title || '',
      packaging: p?.packing_options?.[0] || f.packaging,
      certs_needed: (p?.certifications || []).slice(0, 3).join(', ') || f.certs_needed,
    }))
    setShowAllSpecs(false)
  }

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const selected = useMemo(
    () => (products || []).find(p => p.path === form.productPath) || null,
    [products, form.productPath]
  )

  // Spec entries we can show (only fields with values)
  const specEntries = useMemo(() => {
    if (!selected?.specs) return []
    return Object.entries(selected.specs).filter(([, v]) => v != null && v !== '')
  }, [selected])

  const visibleSpecs = showAllSpecs ? specEntries : specEntries.slice(0, 4)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    // Drop 129 — if the buyer is signed in (egyptglobe.com /buyer flow),
    // stamp buyer_user_id so the RFQ shows up in their dashboard.
    let buyerUserId = null
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) buyerUserId = user.id
    } catch { /* anon — leave null */ }

    const refPrefix = isCoa ? 'EGG-COA' : 'EGG-RFQ'
    const ref = `${refPrefix}-${Date.now().toString(36).toUpperCase()}`
    const payload = {
      ref_code: ref,
      source: isCoa ? 'egyptglobe-website-coa' : 'egyptglobe-website',
      buyer_company: form.company.trim(),
      company:       form.company.trim(),
      buyer_name:    form.contact.trim(),
      contact:       form.contact.trim(),
      buyer_email:   form.email.trim(),
      email:         form.email.trim(),
      buyer_phone:   form.phone.trim() || null,
      phone:         form.phone.trim() || null,
      buyer_country: form.country || null,
      country:       form.country || null,
      buyer_user_id: buyerUserId,  // Drop 129 — back-link for /buyer/rfqs
      commodity_name: form.commodity.trim(),
      quantity:      form.quantity ? Number(form.quantity) : null,
      unit:          form.unit,
      target_price_usd: form.target_price ? Number(form.target_price) : null,
      quoted_currency:  form.currency,
      incoterm:      form.incoterm,
      incoterms:     form.incoterm,
      delivery_port: form.dest_port || null,
      dest_port:     form.dest_port || null,
      packaging:     form.packaging || null,
      requested_packing: form.packaging || null,
      message:       buildMessage(form, selected),
      status:        'new',
      referenced_page_id: selected?.id || null,
      requested_specs: selected?.specs
        ? { product_specs: selected.specs, buyer_notes: form.requested_specs || null }
        : (form.requested_specs ? { buyer_notes: form.requested_specs } : {}),
    }

    const { error: insertError } = await supabase.from('market_rfqs').insert(payload)
    setSubmitting(false)

    if (insertError) {
      setError(insertError.message || 'Could not submit your RFQ. Please email us at export@egyptglobe.com.')
      return
    }
    setRefCode(ref)
    setSubmitted(true)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 p-10 text-center animate-scale-in">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
          {isCoa ? 'CoA request received — thank you.' : 'RFQ received — thank you.'}
        </h2>
        <p className="text-slate-700 max-w-xl mx-auto leading-relaxed mb-5">
          {isCoa
            ? 'Your Certificate of Analysis request is in our queue. The QC team will email the latest signed CoA from the production plant within 24 hours.'
            : 'Your request is in our queue. Our export desk reviews every RFQ within 1 hour and replies with a priced offer within 24 hours.'}
        </p>
        <div className="inline-block bg-white border border-slate-200 rounded-xl px-5 py-3 mb-6">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Reference</div>
          <div className="font-mono font-bold text-lg text-slate-900">{refCode}</div>
        </div>
        <p className="text-sm text-slate-500">
          Save this reference — quote any reply about it.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Buyer info */}
      <FormSection title="Your details" subtitle="So our export desk can reach back to you.">
        <Grid>
          <Field label="Company name *" required>
            <Input value={form.company} onChange={v => update('company', v)} placeholder="ACME Trading FZE" required autoComplete="organization" />
          </Field>
          <Field label="Contact name *" required>
            <Input value={form.contact} onChange={v => update('contact', v)} placeholder="Your full name" required autoComplete="name" />
          </Field>
          <Field label="Email *" required>
            <Input type="email" value={form.email} onChange={v => update('email', v)} placeholder="you@company.com" required autoComplete="email" />
          </Field>
          <Field label="Phone (optional)">
            <Input type="tel" value={form.phone} onChange={v => update('phone', v)} placeholder="+971 50 …" autoComplete="tel" />
          </Field>
          <Field label="Country *" required>
            <Select value={form.country} onChange={v => update('country', v)} options={COUNTRIES} placeholder="Select your country" required />
          </Field>
        </Grid>
      </FormSection>

      {/* Product */}
      <FormSection title="What are you sourcing?" subtitle="Pick from our catalogue and we'll auto-fill the spec sheet.">
        <Grid>
          {/* Step 1 — Pick a category (chip grid) */}
          <Field label={form.productCategory ? '✓ Step 1 — Category selected' : 'Step 1 — Choose a product category'} full>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableCategories.map(c => {
                const isActive = form.productCategory === c.id
                const count = (productGroups[c.id] || []).length
                return (
                  <button key={c.id} type="button" onClick={() => selectCategory(c.id)}
                    className={`text-left px-3 py-2.5 rounded-xl border transition-all ${isActive
                      ? 'bg-[#1d5fa1] text-white border-[#1d5fa1] shadow-md shadow-blue-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#1d5fa1] hover:bg-blue-50/50'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold leading-tight truncate">{c.label}</div>
                        <div className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                          {count} {count === 1 ? 'product' : 'products'}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            {form.productCategory && (
              <button type="button"
                onClick={() => setForm(f => ({ ...f, productCategory: '', productPath: '', commodity: '' }))}
                className="text-xs text-slate-500 hover:text-[#1d5fa1] mt-2 inline-flex items-center gap-1">
                ← Change category
              </button>
            )}
          </Field>

          {/* Step 2 — Pick a specific product within the chosen category */}
          {form.productCategory && (
            <Field label={`Step 2 — Choose a ${availableCategories.find(c => c.id === form.productCategory)?.label || 'product'} SKU`} full>
              <select value={form.productPath} onChange={e => selectProduct(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d5fa1] focus:border-transparent">
                <option value="">— Select a product (or describe in the commodity field below) —</option>
                {productsInCategory.map(p => (
                  <option key={p.id} value={p.path}>
                    {p.title}{p.hs_code ? ` (HS ${p.hs_code})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {productsInCategory.length} {productsInCategory.length === 1 ? 'product' : 'products'} in this category.
              </p>
            </Field>
          )}

          {/* Skip-step: free-text commodity (always visible as escape hatch) */}
          {!form.productCategory && (
            <div className="sm:col-span-2 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              <strong>Don't see your category?</strong> Skip the picker and describe your
              commodity in the field below — our export desk handles bespoke sourcing too.
            </div>
          )}

          {/* Auto-filled spec preview when a product is selected */}
          {selected && (specEntries.length > 0 || selected.certifications?.length || selected.packing_options?.length || selected.applications?.length) && (
            <div className="sm:col-span-2 rounded-2xl bg-blue-50 border border-blue-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-[#1d5fa1] flex items-center gap-2">
                    🧪 Auto-filled from catalogue: <span className="text-slate-900">{selected.title}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    {selected.hs_code && <span><strong>HS:</strong> <span className="font-mono">{selected.hs_code}</span></span>}
                    {selected.moq_mt && <span><strong>MOQ:</strong> {Number(selected.moq_mt).toLocaleString()} MT</span>}
                    {(selected.lead_time_min_weeks || selected.lead_time_max_weeks) && (
                      <span><strong>Lead time:</strong> {selected.lead_time_min_weeks || '?'}–{selected.lead_time_max_weeks || '?'} weeks</span>
                    )}
                    {selected.price_indication && (
                      <span><strong>Price:</strong> {selected.price_indication}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs grid */}
              {specEntries.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Quality specifications ({specEntries.length} parameters)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {visibleSpecs.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs border-b border-blue-200/60 pb-1">
                        <span className="text-slate-600">{prettyKey(k)}</span>
                        <span className="font-mono font-semibold text-slate-900 text-right">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                  {specEntries.length > 4 && (
                    <button type="button" onClick={() => setShowAllSpecs(s => !s)}
                      className="mt-2 text-xs font-semibold text-[#1d5fa1] hover:underline">
                      {showAllSpecs ? '▴ Show fewer specs' : `▾ Show all ${specEntries.length} parameters`}
                    </button>
                  )}
                </div>
              )}

              {/* Certifications */}
              {selected.certifications?.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Certifications & standards
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.certifications.map(c => (
                      <span key={c} className="text-[11px] font-semibold bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-500 leading-relaxed border-t border-blue-200/60 pt-2">
                The full specification sheet ships with your quote. Adjust anything below if your tender requires different parameters.
              </div>
            </div>
          )}

          <Field label="Commodity *" full required>
            <Input value={form.commodity} onChange={v => update('commodity', v)} placeholder="e.g. Cement OPC 52.5 / Industrial Salt 99% / Urea 46% N" required />
          </Field>

          <Field label="Quantity *" required>
            <Input type="number" value={form.quantity} onChange={v => update('quantity', v)} placeholder="5000" required min="0" />
          </Field>
          <Field label="Unit">
            <Select value={form.unit} onChange={v => update('unit', v)} options={UNITS} />
          </Field>

          <Field label="Target price (optional)">
            <Input type="number" value={form.target_price} onChange={v => update('target_price', v)} placeholder="e.g. 58" min="0" step="0.01" />
          </Field>
          <Field label="Currency">
            <Select value={form.currency} onChange={v => update('currency', v)} options={CURRENCIES} />
          </Field>

          <Field label="Incoterm *" required>
            <Select value={form.incoterm} onChange={v => update('incoterm', v)} options={INCOTERMS} required />
          </Field>
          <Field label="Destination port (master registry)">
            <select value={form.dest_port} onChange={e => update('dest_port', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d5fa1] focus:border-transparent">
              <option value="">— Select a destination port —</option>
              {Object.entries(portGroups).map(([region, ports]) => (
                <optgroup key={region} label={`${region} (${ports.length} ports)`}>
                  {ports.map(p => (
                    <option key={p.id} value={`${p.name}, ${p.country}`}>
                      {p.name}{p.unlocode ? ` (${p.unlocode})` : ''} — {p.country}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">Or type a custom port in the box below.</span>
            <Input value={form.dest_port} onChange={v => update('dest_port', v)} placeholder="Custom destination port" />
          </Field>

          <Field label="Preferred packing" full>
            {selected?.packing_options?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {selected.packing_options.map(p => (
                  <button key={p} type="button" onClick={() => update('packaging', p)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${form.packaging === p
                      ? 'bg-[#1d5fa1] text-white border-[#1d5fa1]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#1d5fa1] hover:text-[#1d5fa1]'}`}>
                    {p}
                  </button>
                ))}
              </div>
            ) : null}
            <Input value={form.packaging} onChange={v => update('packaging', v)} placeholder="50 kg PP bags / 1 MT FIBC / Bulk vessel" />
          </Field>

          <Field label="Required by (optional)">
            <Input value={form.timeline} onChange={v => update('timeline', v)} placeholder="e.g. ASAP / Q2 2026 / by 15 May" />
          </Field>
          <Field label="Specific certifications">
            <Input value={form.certs_needed} onChange={v => update('certs_needed', v)} placeholder="ISO 22000 / SGS / EUR1 / Halal" />
          </Field>
        </Grid>
      </FormSection>

      <FormSection title="Specs and notes" subtitle="The more detail, the tighter the quote.">
        <Field label="Custom specs / tender deviations" full>
          <Textarea value={form.requested_specs} onChange={v => update('requested_specs', v)}
            placeholder={selected
              ? `e.g. tighter NaCl threshold than ${(selected.specs?.nacl_min || 'std')}, custom particle range, additional cert. Or paste a tender clause.`
              : 'e.g. NaCl ≥ 99.5%, moisture ≤ 0.5%, particle 0.5–2 mm. Or paste a tender clause.'}
            rows={3} />
        </Field>
        <Field label="Anything else?" full>
          <Textarea value={form.message} onChange={v => update('message', v)}
            placeholder="Vessel size, delivery instructions, payment preference (L/C, T/T, D/P), trial-order vs long-term offtake, etc."
            rows={4} />
        </Field>
      </FormSection>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button type="submit" disabled={submitting}
          className={`flex-1 inline-flex items-center justify-center gap-2 ${isCoa ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-[#FF6321] hover:bg-[#e0541b] shadow-orange-500/20'} disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-7 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:transform-none`}>
          {submitting ? '⏳ Submitting…' : (isCoa ? '🧪 Request CoA' : '📋 Submit RFQ')}
        </button>
        <p className="text-xs text-slate-500 text-center sm:text-left max-w-xs">
          By submitting, you agree we may contact you about your RFQ. We do not send marketing email.
        </p>
      </div>
    </form>
  )
}

/* Form primitives ─────────────────────────────────────────────── */

function FormSection({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}

function Field({ label, full = false, required = false, children }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs font-semibold text-slate-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d5fa1] focus:border-transparent transition-shadow'

function Input({ value, onChange, type = 'text', ...rest }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputCls} {...rest} />
}

function Textarea({ value, onChange, rows = 3, ...rest }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className={inputCls + ' resize-y'} {...rest} />
}

function Select({ value, onChange, options, placeholder, required, ...rest }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} required={required}
      className={inputCls} {...rest}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

/** Compose a free-text message body that captures every populated form
 *  field plus the auto-filled product specs, so the inbox has a fully
 *  readable summary. */
function buildMessage(f, selected) {
  const parts = []
  parts.push(`RFQ from ${f.company} (${f.country || 'country n/a'})`)
  parts.push(``)
  if (f.commodity) parts.push(`Commodity: ${f.commodity}`)
  if (selected?.path) parts.push(`Catalogue ref: egyptglobe.com${selected.path}`)
  if (f.quantity) parts.push(`Quantity: ${f.quantity} ${f.unit}`)
  if (f.target_price) parts.push(`Target price: ${f.target_price} ${f.currency}/${f.unit}`)
  if (f.incoterm) parts.push(`Incoterm: ${f.incoterm}`)
  if (f.dest_port) parts.push(`Destination port: ${f.dest_port}`)
  if (f.packaging) parts.push(`Packing: ${f.packaging}`)
  if (f.timeline) parts.push(`Required by: ${f.timeline}`)
  if (f.certs_needed) parts.push(`Certifications: ${f.certs_needed}`)
  if (f.requested_specs) {
    parts.push(``)
    parts.push(`Custom specs / deviations: ${f.requested_specs}`)
  }
  if (selected?.specs && Object.keys(selected.specs).length > 0) {
    parts.push(``)
    parts.push(`Catalogue specs:`)
    for (const [k, v] of Object.entries(selected.specs)) {
      if (v != null && v !== '') parts.push(`  • ${prettyKey(k)}: ${v}`)
    }
  }
  if (f.message) {
    parts.push(``)
    parts.push(`Notes: ${f.message}`)
  }
  parts.push(``)
  parts.push(`— Submitted via egyptglobe.com`)
  return parts.join('\n')
}

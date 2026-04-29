'use client'

/**
 * RFQForm — public B2B request-for-quote form.
 *
 * Submits a row to `market_rfqs` via the anon publishable key (RLS
 * allows anon INSERT only — no SELECT). Source is tagged
 * `egyptglobe-website` so the EGG OS triage UI can route correctly.
 *
 * Product selector pre-fills packaging + MOQ + HS code suggestions
 * from the chosen page row. `preselectPath` (from /rfq?product=...)
 * picks the dropdown automatically when arriving from a product page.
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
const COMMON_DEST_PORTS = [
  'Rotterdam','Antwerp','Hamburg','Marseille','Genoa','Algeciras','Beirut','Mersin','Izmir',
  'Mombasa','Dar es Salaam','Beira','Lagos','Tema','Abidjan',
  'Mumbai','Karachi','Chittagong','Colombo','Singapore','Shanghai','Shenzhen',
  'Houston','Veracruz','Buenos Aires','Sydney','Melbourne',
]

export default function RFQForm({ products, preselectPath, supabaseUrl, supabaseAnon }) {
  // Lazy supabase client (created on first submit)
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

  const initialProduct = useMemo(() => {
    if (!preselectPath) return null
    return (products || []).find(p => p.path === preselectPath) || null
  }, [products, preselectPath])

  const [form, setForm] = useState({
    company: '', contact: '', email: '', phone: '', country: '',
    productPath: initialProduct?.path || '',
    commodity: initialProduct?.title || '',
    quantity: '', unit: 'MT',
    target_price: '', currency: 'USD',
    incoterm: 'CIF', dest_port: '',
    packaging: (initialProduct?.packing_options?.[0]) || '',
    certs_needed: '',
    timeline: '',
    message: '',
    requested_specs: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [refCode, setRefCode] = useState(null)

  // When the user picks a different product, sync the commodity name +
  // suggest the first packing option.
  function selectProduct(path) {
    const p = (products || []).find(x => x.path === path)
    setForm(f => ({
      ...f,
      productPath: path,
      commodity: p?.title || '',
      packaging: p?.packing_options?.[0] || f.packaging,
    }))
  }

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  // Selected product object (for sidebar hint card)
  const selected = useMemo(
    () => (products || []).find(p => p.path === form.productPath) || null,
    [products, form.productPath]
  )

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const ref = `EGG-RFQ-${Date.now().toString(36).toUpperCase()}`
    const payload = {
      ref_code: ref,
      source: 'egyptglobe-website',
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
      message:       buildMessage(form),
      status:        'new',
      referenced_page_id: selected?.id || null,
      requested_specs: form.requested_specs ? { notes: form.requested_specs } : {},
    }

    const { error: insertError } = await supabase.from('market_rfqs').insert(payload)
    setSubmitting(false)

    if (insertError) {
      setError(insertError.message || 'Could not submit your RFQ. Please email us at export@egyptglobe.com.')
      return
    }
    setRefCode(ref)
    setSubmitted(true)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 p-10 text-center animate-scale-in">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">RFQ received — thank you.</h2>
        <p className="text-slate-700 max-w-xl mx-auto leading-relaxed mb-5">
          Your request is in our queue. Our export desk reviews every RFQ within
          1 hour and replies with a priced offer within 24 hours.
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
      <FormSection title="What are you sourcing?" subtitle="Pick from our catalogue or describe your requirement.">
        <Grid>
          <Field label="Choose a product (optional)" full>
            <select value={form.productPath} onChange={e => selectProduct(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d5fa1] focus:border-transparent">
              <option value="">— or describe in the commodity field below —</option>
              {Object.entries(productGroups).map(([cat, items]) => (
                <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                  {items.map(p => (
                    <option key={p.id} value={p.path}>
                      {p.title}{p.hs_code ? ` (HS ${p.hs_code})` : ''}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>

          {selected && (
            <div className="sm:col-span-2 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm">
              <div className="font-semibold text-[#1d5fa1] mb-1">Linked: {selected.title}</div>
              <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                {selected.hs_code && <span><strong>HS:</strong> <span className="font-mono">{selected.hs_code}</span></span>}
                {selected.moq_mt && <span><strong>Min order:</strong> {selected.moq_mt.toLocaleString()} MT</span>}
                {selected.packing_options?.length > 0 && (
                  <span><strong>Packing options:</strong> {selected.packing_options.join(' · ')}</span>
                )}
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
          <Field label="Destination port">
            <input list="rfq-dest-ports" value={form.dest_port} onChange={e => update('dest_port', e.target.value)} placeholder="e.g. Mombasa, Kenya"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d5fa1] focus:border-transparent" />
            <datalist id="rfq-dest-ports">
              {COMMON_DEST_PORTS.map(p => <option key={p} value={p} />)}
            </datalist>
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
        <Field label="Custom specs / tender requirements" full>
          <Textarea value={form.requested_specs} onChange={v => update('requested_specs', v)}
            placeholder="e.g. NaCl ≥ 99.5%, moisture ≤ 0.5%, particle 0.5–2 mm. Or paste a tender clause."
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
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold px-7 py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 disabled:transform-none">
          {submitting ? '⏳ Submitting…' : '📋 Submit RFQ'}
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

/** Compose a free-text message body from the form fields so the
 *  backend trigger / inbox surface a readable summary. */
function buildMessage(f) {
  const parts = []
  parts.push(`RFQ from ${f.company} (${f.country || 'country n/a'})`)
  parts.push(``)
  if (f.commodity) parts.push(`Commodity: ${f.commodity}`)
  if (f.quantity) parts.push(`Quantity: ${f.quantity} ${f.unit}`)
  if (f.target_price) parts.push(`Target price: ${f.target_price} ${f.currency}/${f.unit}`)
  if (f.incoterm) parts.push(`Incoterm: ${f.incoterm}`)
  if (f.dest_port) parts.push(`Destination port: ${f.dest_port}`)
  if (f.packaging) parts.push(`Packing: ${f.packaging}`)
  if (f.timeline) parts.push(`Required by: ${f.timeline}`)
  if (f.certs_needed) parts.push(`Certifications: ${f.certs_needed}`)
  if (f.requested_specs) {
    parts.push(``)
    parts.push(`Specs: ${f.requested_specs}`)
  }
  if (f.message) {
    parts.push(``)
    parts.push(`Notes: ${f.message}`)
  }
  parts.push(``)
  parts.push(`— Submitted via egyptglobe.com`)
  return parts.join('\n')
}

'use client'

/**
 * InlineQuoteCard — Drop 132 interactive widget.
 *
 * Pre-filled mini RFQ form that POSTs to market_rfqs directly from the
 * product page — replaces the static "Quote in 24 hours" markdown section
 * with a one-click capture surface.
 *
 * Pre-fills:
 *  - commodity: page.title
 *  - referenced_page_id: page.id
 *  - quantity unit: 'MT'
 *  - incoterm: defaults from selected POL/region in TransitTimeCalculator (via prop)
 *  - dest_port / region: from prop
 *  - buyer_user_id: stamped if logged in
 *
 * On submit shows success ref + "Open full RFQ" link if buyer wants to
 * add more detail. No anti-spam beyond the existing market_rfqs RLS.
 */
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function InlineQuoteCard({ page, prefill = {} }) {
  const [email, setEmail]     = useState('')
  const [company, setCompany] = useState('')
  const [quantity, setQuantity] = useState('')
  const [destPort, setDestPort] = useState('')
  const [incoterm, setIncoterm] = useState('CIF')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState(null)
  const [refCode, setRefCode] = useState(null)

  // Prefill from TransitCalculator selection (if any)
  useEffect(() => {
    if (prefill.dest_port && !destPort) setDestPort(prefill.dest_port)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill])

  async function onSubmit(e) {
    e.preventDefault()
    if (!email || !quantity) {
      setError('Email + quantity are required')
      return
    }
    setSubmitting(true); setError(null)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )

    let buyerUserId = null
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) buyerUserId = user.id
    } catch { /* anon */ }

    const ref = `EGG-RFQ-${Date.now().toString(36).toUpperCase()}`
    const payload = {
      ref_code: ref,
      source: 'egyptglobe-website-inline',
      buyer_email: email.trim(),
      email:       email.trim(),
      buyer_name:  company.trim() || email.trim(),
      contact:     company.trim() || email.trim(),
      buyer_company: company.trim() || null,
      company:       company.trim() || null,
      buyer_user_id: buyerUserId,
      commodity_name: page.title,
      quantity:      Number(quantity),
      unit:          'MT',
      incoterm,
      incoterms:     incoterm,
      dest_port:     destPort || null,
      delivery_port: destPort || null,
      message:       `Inline quote request from ${page.path}.\n\nProduct: ${page.title}\nQty: ${quantity} MT\nIncoterm: ${incoterm}${destPort ? '\nDest port: '+destPort : ''}${prefill.region ? '\nRegion: '+prefill.region : ''}`,
      status:        'new',
      referenced_page_id: page.id,
    }

    const { error: insertError } = await supabase.from('market_rfqs').insert(payload)
    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }
    setRefCode(ref)
  }

  if (refCode) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-7 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Quote request received</h3>
        <p className="text-slate-700 mb-1">
          Ref <span className="font-mono font-bold text-emerald-700">{refCode}</span>
        </p>
        <p className="text-sm text-slate-600 mb-5">
          Our export desk will respond to <strong>{email}</strong> within 24 hours with FOB / CIF / CFR pricing, available origin port, packing options + a sample CoA.
        </p>
        <a href={`/rfq?product=${encodeURIComponent(page.path)}&ref=${refCode}`}
          className="inline-flex items-center gap-2 bg-[#1d5fa1] hover:bg-[#14467a] text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-sm">
          Add more detail (full RFQ form) →
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50/60 via-white to-orange-50/30 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-orange-100 bg-white/40">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FF6321] text-white text-lg shadow-sm">📋</span>
          <h3 className="text-xl font-extrabold text-slate-900">Get a quote in 24 hours</h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">Pre-filled with <strong className="text-slate-700">{page.title}</strong>. Add quantity + email and we'll do the rest.</p>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Quantity" required>
            <div className="flex">
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required
                className="flex-1 border border-slate-200 rounded-l-lg px-3 py-2.5 text-sm focus:border-[#FF6321] focus:ring-2 focus:ring-orange-100 outline-none"
                placeholder="500" />
              <div className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-3 py-2.5 text-sm font-bold text-slate-700">MT</div>
            </div>
          </Field>
          <Field label="Incoterm">
            <select value={incoterm} onChange={e => setIncoterm(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold focus:border-[#FF6321] focus:ring-2 focus:ring-orange-100 outline-none">
              {['FOB', 'CIF', 'CFR', 'DAP', 'DDP', 'EXW', 'CPT', 'CIP'].map(i => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Destination port (optional — we'll suggest if blank)">
          <input value={destPort} onChange={e => setDestPort(e.target.value)}
            placeholder={prefill.dest_port || 'Mombasa, Lagos, JNPT, Jeddah…'}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#FF6321] focus:ring-2 focus:ring-orange-100 outline-none" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Your email" required>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@company.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#FF6321] focus:ring-2 focus:ring-orange-100 outline-none" />
          </Field>
          <Field label="Company name (optional)">
            <input value={company} onChange={e => setCompany(e.target.value)}
              placeholder="ACME Trading FZE"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#FF6321] focus:ring-2 focus:ring-orange-100 outline-none" />
          </Field>
        </div>

        {error && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">⚠ {error}</div>}

        <button type="submit" disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] disabled:bg-orange-300 text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-orange-500/25 transition-all">
          {submitting ? '⏳ Sending…' : '📋 Get my quote in 24 hours'}
        </button>
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          Your details go to our Cairo export desk only. No marketing email. Need a richer RFQ form? <a href={`/rfq?product=${encodeURIComponent(page.path)}`} className="text-[#1d5fa1] font-semibold hover:underline">Use the full form →</a>
        </p>
      </form>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}

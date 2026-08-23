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
      <div className="rounded-3xl ring-1 ring-[#0fb5a5]/40 bg-[#e6fbf8] p-7 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="egg-display text-3xl text-[#14161a] mb-2">Quote request received</h3>
        <p className="text-[#3f4650] mb-1">
          Ref <span className="font-mono font-bold text-[#0b8f84]">{refCode}</span>
        </p>
        <p className="text-sm text-[#3f4650] mb-5">
          Our export desk will respond to <strong>{email}</strong> within 24 hours with FOB / CIF / CFR pricing, available origin port, packing options + a sample CoA.
        </p>
        <a href={`/rfq?product=${encodeURIComponent(page.path)}&ref=${refCode}`}
          className="egg-btn-primary text-sm py-2.5">
          Add more detail (full RFQ form) →
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-3xl ring-1 ring-[#ff6321]/25 bg-[#fff8f3] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#ff6321]/15 bg-white/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FF6321] text-white text-lg shadow-sm">📋</span>
          <h3 className="egg-display text-2xl text-[#14161a]">Get a quote in 24 hours</h3>
        </div>
        <p className="text-xs text-[#7a8290] mt-1">Pre-filled with <strong className="text-[#3f4650]">{page.title}</strong>. Add quantity + email and we'll do the rest.</p>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Quantity" required>
            <div className="flex">
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required
                className="flex-1 border border-[#14161a]/10 rounded-l-lg px-3 py-2.5 text-sm focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none"
                placeholder="500" />
              <div className="bg-[#f3f4f6] border border-l-0 border-[#14161a]/10 rounded-r-lg px-3 py-2.5 text-sm font-bold text-[#3f4650]">MT</div>
            </div>
          </Field>
          <Field label="Incoterm">
            <select value={incoterm} onChange={e => setIncoterm(e.target.value)}
              className="w-full border border-[#14161a]/10 rounded-lg px-3 py-2.5 text-sm font-semibold focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none">
              {['FOB', 'CIF', 'CFR', 'DAP', 'DDP', 'EXW', 'CPT', 'CIP'].map(i => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Destination port (optional — we'll suggest if blank)">
          <input value={destPort} onChange={e => setDestPort(e.target.value)}
            placeholder={prefill.dest_port || 'Mombasa, Lagos, JNPT, Jeddah…'}
            className="w-full border border-[#14161a]/10 rounded-lg px-3 py-2.5 text-sm focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Your email" required>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@company.com"
              className="w-full border border-[#14161a]/10 rounded-lg px-3 py-2.5 text-sm focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none" />
          </Field>
          <Field label="Company name (optional)">
            <input value={company} onChange={e => setCompany(e.target.value)}
              placeholder="ACME Trading FZE"
              className="w-full border border-[#14161a]/10 rounded-lg px-3 py-2.5 text-sm focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none" />
          </Field>
        </div>

        {error && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5">⚠ {error}</div>}

        <button type="submit" disabled={submitting}
          className="egg-btn-primary w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
          {submitting ? '⏳ Sending…' : '📋 Get my quote in 24 hours'}
        </button>
        <p className="text-[11px] text-[#7a8290] text-center leading-relaxed">
          Your details go to our Cairo export desk only. No marketing email. Need a richer RFQ form? <a href={`/rfq?product=${encodeURIComponent(page.path)}`} className="text-[#0b8f84] font-semibold hover:underline">Use the full form →</a>
        </p>
      </form>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-[#3f4650] mb-1.5 block">
        {label} {required && <span className="text-[#ff6321]">*</span>}
      </span>
      {children}
    </label>
  )
}

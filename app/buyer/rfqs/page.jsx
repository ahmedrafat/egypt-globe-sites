/**
 * /buyer/rfqs — buyer's own RFQ history (Drop 129).
 *
 * Lists every market_rfqs row that links back to the signed-in buyer
 * either via buyer_user_id (Drop 129 column, set when authenticated
 * buyers submit through /rfq) OR via email match (catches RFQs the
 * buyer submitted via the public form before they signed up).
 *
 * Authenticated-only — anon hits get redirected to /login.
 */
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getBuyerVisibility, createSupabaseServerClient } from '../../../lib/supabaseServer'

// Drop 139c — auth-cookie-dependent, must be dynamic.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Your RFQs',
  description: 'Recent quotation requests you submitted to Egypt Globe Group.',
  robots: { index: false, follow: false },
}

const STATUS_META = {
  new:        { label: 'Submitted',        color: 'bg-amber-50 text-amber-800 border-amber-200',     dot: 'bg-amber-500' },
  reviewed:   { label: 'Reviewed',         color: 'bg-blue-50 text-blue-800 border-blue-200',         dot: 'bg-blue-500' },
  quoted:     { label: 'Quote sent',       color: 'bg-violet-50 text-violet-800 border-violet-200',   dot: 'bg-violet-500' },
  contacted:  { label: 'In conversation',  color: 'bg-cyan-50 text-cyan-800 border-cyan-200',         dot: 'bg-cyan-500' },
  sample:     { label: 'Sample sent',      color: 'bg-pink-50 text-pink-800 border-pink-200',         dot: 'bg-pink-500' },
  won:        { label: 'Order placed',     color: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  lost:       { label: 'Closed',           color: 'bg-slate-100 text-slate-700 border-slate-200',     dot: 'bg-slate-400' },
}

function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) }
  catch { return '—' }
}

function fmtAge(d) {
  if (!d) return ''
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days/30)} mo ago`
  return `${Math.floor(days/365)} yr ago`
}

export default async function BuyerRfqs() {
  const v = await getBuyerVisibility()
  if (!v.authenticated) redirect('/login')

  const supabase = await createSupabaseServerClient()
  // Two-source query — match on buyer_user_id (Drop 129) OR email (catches
  // historical RFQs the buyer submitted before signing up).
  const filters = []
  if (v.user?.id) filters.push(`buyer_user_id.eq.${v.user.id}`)
  if (v.email)    filters.push(`email.eq.${v.email}`)
  if (v.email)    filters.push(`buyer_email.eq.${v.email}`)
  const orFilter = filters.join(',')

  const { data: rfqs, error } = orFilter
    ? await supabase
        .from('market_rfqs')
        .select('id, ref_code, commodity_name, quantity, unit, status, incoterm, dest_port, country, dest_country, message, created_at, quoted_price, quoted_currency')
        .or(orFilter)
        .order('created_at', { ascending: false })
        .limit(100)
    : { data: [], error: null }

  const list = rfqs || []
  const counts = list.reduce((acc, r) => {
    const k = r.status || 'new'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <article>
      <section className="relative bg-gradient-to-br from-[#1d5fa1] via-[#14467a] to-[#0f1f3a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
          <nav className="text-xs text-white/60 mb-3 flex items-center gap-2 flex-wrap">
            <Link href="/buyer" className="hover:text-white">← Buyer dashboard</Link>
            <span>/</span>
            <span className="text-white/90">Your RFQs</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Your recent RFQs</h1>
          <p className="text-blue-100 mt-2 text-sm sm:text-base">
            Every quotation request you've submitted via egyptglobe.com — both
            from your authenticated account and historical anonymous submissions
            matched by email ({v.email}).
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {/* Status KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="font-bold text-2xl text-slate-900">{list.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Total</div>
          </div>
          {Object.entries(STATUS_META).map(([s, meta]) => (
            <div key={s} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`inline-block w-2 h-2 rounded-full ${meta.dot}`} />
                <span className="font-bold text-2xl text-slate-900">{counts[s] || 0}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 truncate">{meta.label}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-4">
            ⚠ {error.message}
          </div>
        )}

        {list.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 sm:p-12 text-center">
            <div className="text-5xl mb-3">📋</div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">No RFQs yet</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              When you submit a quotation request through the catalogue or the
              RFQ form, it'll appear here so you can track its status from
              "Submitted" through "Quote sent" and "Order placed".
            </p>
            <Link href="/rfq"
              className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all">
              📋 Submit your first RFQ
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map(r => {
              const meta = STATUS_META[r.status || 'new'] || STATUS_META.new
              return (
                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-[#1d5fa1] transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-slate-500">{r.ref_code || '—'}</span>
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{r.commodity_name || 'Quote request'}</h3>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        {r.quantity && <span>📦 {Number(r.quantity).toLocaleString()} {r.unit || 'MT'}</span>}
                        {r.incoterm && <span>📜 {r.incoterm}</span>}
                        {(r.dest_port || r.country || r.dest_country) && (
                          <span>📍 {r.dest_port || r.country || r.dest_country}</span>
                        )}
                        <span>📅 Submitted {fmtDate(r.created_at)} ({fmtAge(r.created_at)})</span>
                      </div>
                      {r.quoted_price && (
                        <div className="mt-2 inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-900 text-xs font-bold px-3 py-1.5 rounded-lg">
                          ✓ Quoted: {r.quoted_currency || 'USD'} {Number(r.quoted_price).toLocaleString()}
                          {r.unit && <span className="font-normal">/ {r.unit}</span>}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      <a href={`mailto:export@egyptglobe.com?subject=RFQ%20${encodeURIComponent(r.ref_code || r.id)}%20-%20${encodeURIComponent(r.commodity_name || '')}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1d5fa1] hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors">
                        ✉ Follow up
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/rfq"
            className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all">
            📋 Submit a new RFQ
          </Link>
        </div>
      </section>
    </article>
  )
}

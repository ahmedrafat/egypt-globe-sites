/**
 * /buyer — minimal buyer dashboard. Shows account status, scoped
 * catalogue summary, and a sign-out button.
 */
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getBuyerVisibility, createSupabaseServerClient } from '../../lib/supabaseServer'
import {
  PRODUCT_DIVISIONS,
  getPagesInCategory,
} from '../../lib/corporatePages'
import SignOutButton from '../../components/auth/SignOutButton'

export const metadata = {
  title: 'Buyer Dashboard',
  description: 'Your Egypt Globe Group buyer profile, scoped catalogue, and recent quotes.',
  robots: { index: false, follow: false },
}

export default async function BuyerDashboard() {
  const v = await getBuyerVisibility()
  if (!v.authenticated) redirect('/login')

  // Show counts of products visible to this buyer
  const supabase = await createSupabaseServerClient()
  const { count: totalSkus } = await supabase
    .from('egg_corporate_pages')
    .select('*', { count: 'exact', head: true })
    .not('commodity_id', 'is', null)
    .eq('is_published', true)

  const statusBadge = {
    pending:    { label: 'Pending approval',  cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    approved:   { label: 'Approved',          cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    suspended:  { label: 'Suspended',         cls: 'bg-red-50 text-red-800 border-red-200' },
    rejected:   { label: 'Rejected',          cls: 'bg-red-50 text-red-800 border-red-200' },
    no_profile: { label: 'Profile incomplete', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
  }[v.status] || { label: v.status, cls: 'bg-slate-100 text-slate-700 border-slate-200' }

  return (
    <article>
      <section className="relative bg-gradient-to-br from-[#1d5fa1] via-[#14467a] to-[#0f1f3a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Buyer dashboard</div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Welcome{v.contactName ? `, ${v.contactName}` : ''}.
              </h1>
              {v.company && <p className="text-blue-100 mt-2">{v.company}{v.country ? ` · ${v.country}` : ''}</p>}
              <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full border mt-4 ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {v.status === 'pending' && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-900 mb-6">
            Your account is awaiting approval. Catalogue and RFQ form are usable now;
            <strong> prices unlock once our export desk verifies your company</strong> (usually within 24h).
          </div>
        )}
        {v.status === 'approved' && !v.visibleAll && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-sm text-emerald-900 mb-6">
            ✓ You have a scoped catalogue assigned —
            {v.visibleCategories.length > 0 && ` ${v.visibleCategories.length} categor${v.visibleCategories.length === 1 ? 'y' : 'ies'}`}
            {v.visiblePaths.length > 0 && ` and ${v.visiblePaths.length} specific product${v.visiblePaths.length === 1 ? '' : 's'}`}.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your access</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {v.visibleAll ? 'Full' : v.visibleCategories.length + v.visiblePaths.length}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {v.visibleAll ? 'catalogue access' : 'scoped products'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total catalogue</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalSkus || 0}</div>
            <p className="text-sm text-slate-500 mt-1">SKUs across 7 divisions</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Prices</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {v.showPrices ? '✓ Visible' : 'Hidden'}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {v.showPrices ? 'You see indicative pricing' : 'Unlock with approval'}
            </p>
          </div>
        </div>

        {/* Drop 129 — quick-action cards (Your RFQs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/buyer/rfqs"
            className="card-lift group rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-5 flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#1d5fa1] text-white flex items-center justify-center text-2xl">📋</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 group-hover:text-[#1d5fa1]">Your RFQs</div>
              <div className="text-xs text-slate-500">Track quotation requests + their status</div>
            </div>
            <span className="text-[#1d5fa1] font-bold">→</span>
          </Link>
          <Link href="/rfq"
            className="card-lift group rounded-2xl border border-slate-200 bg-gradient-to-br from-orange-50 to-white p-5 flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#FF6321] text-white flex items-center justify-center text-2xl">＋</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 group-hover:text-[#FF6321]">New RFQ</div>
              <div className="text-xs text-slate-500">Submit a new quotation request — 24h response</div>
            </div>
            <span className="text-[#FF6321] font-bold">→</span>
          </Link>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-5">Your catalogue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PRODUCT_DIVISIONS
            .filter(d => v.visibleAll || v.visibleCategories.includes(d.id))
            .map(d => (
              <Link key={d.id} href={d.path}
                className="card-lift group rounded-2xl border border-slate-200 bg-white p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: `${d.color}1A`, color: d.color }}>{d.icon}</div>
                <h3 className="font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors">
                  {d.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{d.blurb}</p>
              </Link>
            ))}
        </div>

        {!v.visibleAll && v.visibleCategories.length === 0 && v.visiblePaths.length === 0 && (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-6 py-10 text-center text-slate-500 mt-6">
            No catalogue scope assigned yet. Contact <a href="mailto:export@egyptglobe.com" className="text-[#1d5fa1] font-semibold">export@egyptglobe.com</a> with your sourcing requirements and we'll set it up.
          </div>
        )}
      </section>
    </article>
  )
}

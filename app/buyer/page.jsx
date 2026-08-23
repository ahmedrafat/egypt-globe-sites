/**
 * /buyer — minimal buyer dashboard. Shows account status, scoped
 * catalogue summary, and a sign-out button.
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getBuyerVisibility, createSupabaseServerClient } from '../../lib/supabaseServer'
import {
  PRODUCT_DIVISIONS,
  getPagesInCategory,
} from '../../lib/corporatePages'
import SignOutButton from '../../components/auth/SignOutButton'

// Drop 139c — buyer dashboard reads cookies → must be dynamic anyway.
// Force-dynamic so the build worker doesn't try to pre-render it.
export const dynamic = 'force-dynamic'

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
    pending:    { label: 'Pending approval',  cls: 'bg-[#fbf7ee] text-[#8a6d3b] border-[#b8862b]/40' },
    approved:   { label: 'Approved',          cls: 'bg-[#e6fbf8] text-[#0b8f84] border-[#0fb5a5]/40' },
    suspended:  { label: 'Suspended',         cls: 'bg-red-50 text-red-800 border-red-200' },
    rejected:   { label: 'Rejected',          cls: 'bg-red-50 text-red-800 border-red-200' },
    no_profile: { label: 'Profile incomplete', cls: 'bg-[#f3f4f6] text-[#3f4650] border-[#14161a]/10' },
  }[v.status] || { label: v.status, cls: 'bg-[#f3f4f6] text-[#3f4650] border-[#14161a]/10' }

  return (
    <article className="bg-white text-[#14161a]">
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(2,132,199,.14), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(15,181,165,.12), transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="egg-eyebrow text-[#0369a1] mb-2">Buyer dashboard</div>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a]">
                Welcome{v.contactName ? `, ${v.contactName}` : ''}.
              </h1>
              {v.company && <p className="text-[#3f4650] mt-2">{v.company}{v.country ? ` · ${v.country}` : ''}</p>}
              <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full border mt-4 ${statusBadge.cls}`}>
                {statusBadge.label}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {v.status === 'pending' && (
          <div className="rounded-2xl bg-[#fbf7ee] border border-[#b8862b]/35 px-5 py-4 text-sm text-[#5c4a25] mb-6">
            Your account is awaiting approval. Catalogue and RFQ form are usable now;
            <strong> prices unlock once our export desk verifies your company</strong> (usually within 24h).
          </div>
        )}
        {v.status === 'approved' && !v.visibleAll && (
          <div className="rounded-2xl bg-[#e6fbf8] border border-[#0fb5a5]/40 px-5 py-4 text-sm text-[#0b5f57] mb-6">
            ✓ You have a scoped catalogue assigned —
            {v.visibleCategories.length > 0 && ` ${v.visibleCategories.length} categor${v.visibleCategories.length === 1 ? 'y' : 'ies'}`}
            {v.visiblePaths.length > 0 && ` and ${v.visiblePaths.length} specific product${v.visiblePaths.length === 1 ? '' : 's'}`}.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="egg-card p-6 hover:transform-none">
            <div className="egg-eyebrow mb-1">Your access</div>
            <div className="egg-display text-4xl text-[#14161a] mt-1">
              {v.visibleAll ? 'Full' : v.visibleCategories.length + v.visiblePaths.length}
            </div>
            <p className="text-sm text-[#7a8290] mt-1">
              {v.visibleAll ? 'catalogue access' : 'scoped products'}
            </p>
          </div>
          <div className="egg-card p-6 hover:transform-none">
            <div className="egg-eyebrow mb-1">Total catalogue</div>
            <div className="egg-display text-4xl text-[#14161a] mt-1">{totalSkus || 0}</div>
            <p className="text-sm text-[#7a8290] mt-1">SKUs across 7 divisions</p>
          </div>
          <div className="egg-card p-6 hover:transform-none">
            <div className="egg-eyebrow mb-1">Prices</div>
            <div className="egg-display text-4xl text-[#14161a] mt-1">
              {v.showPrices ? '✓ Visible' : 'Hidden'}
            </div>
            <p className="text-sm text-[#7a8290] mt-1">
              {v.showPrices ? 'You see indicative pricing' : 'Unlock with approval'}
            </p>
          </div>
        </div>

        {/* Drop 129 — quick-action cards (Your RFQs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Link href="/buyer/rfqs"
            className="egg-card group p-5 flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#0b8f84] text-white flex items-center justify-center text-2xl">📋</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#14161a] group-hover:text-[#0b8f84]">Your RFQs</div>
              <div className="text-xs text-[#7a8290]">Track quotation requests + their status</div>
            </div>
            <span className="text-[#0b8f84] font-bold">→</span>
          </Link>
          <Link href="/rfq"
            className="egg-card group p-5 flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#FF6321] text-white flex items-center justify-center text-2xl">＋</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#14161a] group-hover:text-[#d9501a]">New RFQ</div>
              <div className="text-xs text-[#7a8290]">Submit a new quotation request — 24h response</div>
            </div>
            <span className="text-[#FF6321] font-bold">→</span>
          </Link>
        </div>

        <h2 className="egg-display text-3xl text-[#14161a] mb-5">Your catalogue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PRODUCT_DIVISIONS
            .filter(d => v.visibleAll || v.visibleCategories.includes(d.id))
            .map(d => (
              <Link key={d.id} href={d.path}
                className="egg-card group p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: `${d.color}1f`, boxShadow: `inset 0 0 0 1px ${d.color}66` }}>{d.icon}</div>
                <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors">
                  {d.label}
                </h3>
                <p className="text-xs text-[#7a8290] mt-1.5 line-clamp-2">{d.blurb}</p>
              </Link>
            ))}
        </div>

        {!v.visibleAll && v.visibleCategories.length === 0 && v.visiblePaths.length === 0 && (
          <div className="egg-panel px-6 py-10 text-center text-[#7a8290] mt-6">
            No catalogue scope assigned yet. Contact <a href="mailto:export@egyptglobe.com" className="egg-link">export@egyptglobe.com</a> with your sourcing requirements and we'll set it up.
          </div>
        )}
      </section>
    </article>
  )
}

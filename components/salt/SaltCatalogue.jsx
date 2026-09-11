/**
 * Salt SKU catalogue — the card grid + compact list that used to sit on the
 * salt hub. It now lives on the two source pages (/products/salt/rock-salt,
 * /products/salt/sea-salt): the hub is an overview, each source page is where
 * a buyer browses that source's SKUs. Every SKU stays linked from exactly one
 * source page plus its grade hub, so no SKU loses its internal links.
 */
import Link from 'next/link'
import CardImage from '../ui/CardImage'
import Icon from '../ui/Icon'
import { cardUrl } from '../../lib/corporatePages'

// The first CARD_LIMIT keep the card treatment; the rest stay linked as a
// compact list (Batch 2: 100 full cards was 551 KB of HTML).
const CARD_LIMIT = 12

export default function SaltCatalogue({ items, type }) {
  if (!items?.length) return null
  const tone = type === 'sea' ? '#087a70' : '#8a6d3b'
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {items.slice(0, CARD_LIMIT).map(p => <SaltCard key={p.id} p={p} type={type} />)}
      </div>
      <CompactSkuList items={items.slice(CARD_LIMIT)} tone={tone} />
    </>
  )
}

function CompactSkuList({ items, tone }) {
  if (!items?.length) return null
  return (
    <div className="mt-6 rounded-2xl border border-[#14161a]/10 bg-white p-5 sm:p-6">
      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5b6577] mb-3">{items.length} more SKUs in this source</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {items.map(p => (
          <li key={p.id} className="flex items-baseline gap-2 text-sm leading-snug">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full shrink-0 translate-y-[-2px]" style={{ background: tone }} />
            <Link href={p.path} className="text-[#14161a] hover:text-[#087a70] hover:underline underline-offset-4">{p.title}</Link>
            {p.specs?.nacl_min && <span className="font-mono text-[11px] text-[#5b6577] shrink-0">NaCl {p.specs.nacl_min}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SaltCard({ p, type }) {
  const isSea = type === 'sea'
  return (
    <Link href={p.path} className="egg-card group overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden rounded-t-2xl"
        style={{ background: isSea ? 'linear-gradient(135deg, #e6fbf8, #f9fafb)' : 'linear-gradient(135deg, #fbf3e3, #f9fafb)' }}>
        {cardUrl(p) ? (
          <CardImage src={cardUrl(p)} className="group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#14161a]/20"><Icon name={isSea ? 'wave' : 'pickaxe'} className="w-10 h-10" strokeWidth={1.25} /></div>
        )}
      </div>
      <div className="p-4">
        {p.hs_code && <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#67707f] mb-1">HS {p.hs_code}</div>}
        <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#087a70] transition-colors min-h-[2.5em]">{p.title}</h3>
        {p.specs?.nacl_min && <div className="text-xs font-mono text-[#5b6472] mt-1.5">NaCl {p.specs.nacl_min}</div>}
        {p.applications?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {p.applications.slice(0, 2).map(a => (
              <span key={a} className="text-[11px] font-semibold bg-[#f3f0ff] text-[#6d28d9] ring-1 ring-[#7c3aed]/25 px-2 py-0.5 rounded-full">{a.replace(/_/g, ' ')}</span>
            ))}
            {p.applications.length > 2 && <span className="text-[11px] text-[#67707f]">+{p.applications.length - 2}</span>}
          </div>
        )}
      </div>
    </Link>
  )
}

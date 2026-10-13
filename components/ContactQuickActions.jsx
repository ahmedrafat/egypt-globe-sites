import Link from 'next/link'
import { getSiteSettings } from '../lib/corporatePages'
import Icon from './ui/Icon'

/**
 * ContactQuickActions — the four ways to reach the export desk, as one row above the
 * contact document. The page used to open with two paragraphs of prose before any phone
 * number or form appeared.
 */
export default async function ContactQuickActions() {
  const s = await getSiteSettings()
  const tiles = [
    { href: '/rfq', icon: 'doc', title: 'Request a quote', sub: 'Grade, tonnage, destination', primary: true },
    s.whatsappUrl && { href: s.whatsappUrl, icon: 'chat', title: 'WhatsApp', sub: s.phone, ext: true },
    { href: `tel:${s.phoneE164}`, icon: 'phone', title: 'Call the export desk', sub: s.phone },
    { href: `mailto:${s.email}`, icon: 'mail', title: 'Email', sub: s.email },
  ].filter(Boolean)
  return (
    <nav aria-label="Contact the export desk" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {tiles.map(t => {
        const cls = `group flex items-start gap-3 rounded-2xl p-4 ring-1 transition-colors ${t.primary
          ? 'bg-[#d0450f] text-white ring-[#d0450f] hover:bg-[#14161a] hover:ring-[#14161a]'
          : 'bg-white text-[#14161a] ring-[#14161a]/12 hover:ring-[#087a70]/60 hover:bg-[#f9fafb]'}`
        const inner = (
          <>
            <span className={`mt-0.5 inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-lg ${t.primary ? 'bg-white/15' : 'ring-1 ring-[#14161a]/15'}`}>
              <Icon name={t.icon} className="w-[18px] h-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold leading-snug">{t.title}</span>
              <span className={`block mt-0.5 text-[13px] leading-snug break-words ${t.primary ? 'text-white/85' : 'text-[#5b6472]'}`}>{t.sub}</span>
            </span>
          </>
        )
        return t.ext
          ? <a key={t.title} href={t.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
          : t.href.startsWith('/') ? <Link key={t.title} href={t.href} className={cls}>{inner}</Link>
          : <a key={t.title} href={t.href} className={cls}>{inner}</a>
      })}
    </nav>
  )
}

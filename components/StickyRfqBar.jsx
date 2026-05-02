'use client'

/**
 * StickyRfqBar — Drop 127 conversion-rate optimisation.
 *
 * Sticky bottom bar on every product / SKU page that surfaces the RFQ
 * CTA on mobile (where the right-rail "Request a Quote" card from
 * ProductDetailBlock scrolls offscreen). Hidden on tablet/desktop where
 * the right rail is always visible.
 *
 * Behavior:
 *  - Visible only on `<lg` viewports
 *  - Slides up from bottom after 600px scroll (threshold = "user is past the hero")
 *  - Dismissable per-session (sessionStorage flag)
 *  - Two CTAs: green WhatsApp + brand-orange Quote
 *  - On product pages, embeds the SKU title in the URL so the RFQ form pre-fills
 */
import { useEffect, useState } from 'react'

export default function StickyRfqBar({ pageTitle, pagePath, whatsappUrl }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.sessionStorage.getItem('eggSrb:dismissed') === '1') {
      setDismissed(true)
      return
    }
    function onScroll() {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function dismiss() {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('eggSrb:dismissed', '1')
    }
  }

  if (dismissed) return null

  const rfqHref = `/rfq?product=${encodeURIComponent(pagePath || '/')}`
  const wa = whatsappUrl || 'https://wa.me/201007729844'
  const waMessage = `Hi, I'm interested in ${pageTitle || 'a product'} from your egyptglobe.com site. Can I get a quote?`
  const waHref = `${wa}?text=${encodeURIComponent(waMessage)}`

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(15,31,58,0.18)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="region"
      aria-label="Quick request"
    >
      <div className="px-3 sm:px-4 py-2.5 flex items-center gap-2">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 w-8 h-8 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center"
        >
          ✕
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-slate-500 leading-tight">Quote in 24 hours · No spam</div>
          <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {pageTitle ? `Get pricing for ${pageTitle}` : 'Request a quote'}
          </div>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-11 h-11 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold flex items-center justify-center shadow-md shadow-emerald-500/20 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a
          href={rfqHref}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold text-sm px-4 py-3 rounded-xl shadow-md shadow-orange-500/25 transition-colors"
        >
          📋 Quote
        </a>
      </div>
    </div>
  )
}

'use client'

/**
 * StickyRfqBar — sticky bottom CTA bar on product / SKU pages.
 *
 * Drop 139 mobile polish:
 *  - iOS safe-area-inset-bottom respected via inline style — the home
 *    indicator no longer overlaps the buttons on notched iPhones
 *  - Orange accent stripe on top so the bar reads as deliberate UI
 *    (was just a hairline border that disappeared on white pages)
 *  - Slides in after only 200px (was 600px) — mobile users hit the
 *    CTA much faster, before they leave the hero
 *  - Removed the inline WhatsApp button — the floating FAB already
 *    sits above this bar (Drop 139 fix), so two WA targets is noise
 *  - Pill-shaped buttons with bigger 44×44 tap targets
 *  - Compact title/subtitle so it never wraps to 3 lines
 */
import { useEffect, useState } from 'react'

export default function StickyRfqBar({ pageTitle, pagePath }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.sessionStorage.getItem('eggSrb:dismissed') === '1') {
      setDismissed(true)
      return
    }
    function onScroll() {
      setVisible(window.scrollY > 200)
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

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white shadow-[0_-8px_28px_rgba(15,31,58,0.18)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      role="region"
      aria-label="Quick request"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Accent stripe */}
      <div className="h-0.5 bg-gradient-to-r from-[#FF6321] via-[#ff8c55] to-[#FF6321]" aria-hidden="true" />

      <div className="px-3 sm:px-4 py-2.5 flex items-center gap-2.5">
        <button
          onClick={dismiss}
          aria-label="Dismiss quote bar"
          className="shrink-0 w-9 h-9 rounded-full text-[#8a93a3] hover:text-[#14161a] hover:bg-[#f3f4f6] active:bg-[#e5e7eb] transition-colors flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF6321] leading-none mb-0.5">
            24-hour SLA
          </div>
          <div className="text-sm font-bold text-[#14161a] truncate leading-tight">
            {pageTitle ? `Quote ${pageTitle}` : 'Request a Quote'}
          </div>
        </div>

        <a
          href={rfqHref}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#ff6321] hover:bg-[#14161a] text-white font-semibold text-sm px-5 h-11 rounded-full shadow-[0_10px_30px_-10px_rgba(255,99,33,.55)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Get Quote
        </a>
      </div>
    </div>
  )
}

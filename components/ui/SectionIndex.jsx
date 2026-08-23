'use client'

/**
 * SectionIndex — sticky "Contents" rail for long document pages.
 *
 * Replaces the tab bars that used to front SKU and editorial pages. Tabs
 * put six to eleven clicks between a buyer and the specification they
 * came for, and hid roughly two thirds of each page behind display:none.
 * A bulk-commodity buyer scans and prints a spec sheet — so the page is
 * now one continuous document and this rail is how you move around it.
 *
 * Progressive enhancement: every section is plain, always-visible HTML.
 * This component only adds wayfinding — a desktop rail with an
 * IntersectionObserver scrollspy, and a collapsed <details> on mobile so
 * a long contents list never buries the content itself.
 *
 * Anchors rely on `scroll-mt-28` on each section (see SECTION_ANCHOR) to
 * clear the sticky site header.
 */
import { useEffect, useState } from 'react'
import Icon from './Icon'

/** Put this on every section wrapper so anchor jumps clear the header. */
export const SECTION_ANCHOR = 'scroll-mt-28'

export default function SectionIndex({ sections, className = '', variant = 'both' }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    if (typeof window === 'undefined' || !sections.length) return
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean)
    if (!els.length) return

    // Track the section whose top is closest to just under the header.
    const io = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (!visible.length) return
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        setActive(visible[0].target.id)
      },
      { rootMargin: '-112px 0px -60% 0px', threshold: 0 },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [sections])

  if (sections.length < 2) return null

  const list = (
    <ol className="space-y-0.5">
      {sections.map((s, i) => {
        const on = active === s.id
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={on ? 'true' : undefined}
              className={`group flex items-start gap-2.5 rounded-lg py-1.5 pl-2.5 pr-2 text-sm transition-colors border-l-2 ${
                on
                  ? 'border-[#ff6321] bg-[#fff4ec] text-[#14161a] font-semibold'
                  : 'border-transparent text-[#5b6472] hover:text-[#14161a] hover:bg-[#f6f7f9]'
              }`}
            >
              <span className={`mt-0.5 font-mono text-[10px] tabular-nums ${on ? 'text-[#d9501a]' : 'text-[#9aa2ae]'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="leading-snug">{s.label}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )

  const mobile = (
    <>
      {/* Mobile — collapsed by default so it never buries the document */}
      <details className="lg:hidden mb-8 rounded-2xl border border-[#14161a]/10 bg-[#f9fafb] overflow-hidden">
        <summary className="cursor-pointer select-none list-none px-4 py-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#5b6472]">
            <Icon name="grid" className="w-3.5 h-3.5" />
            Contents
            <span className="text-[#9aa2ae] normal-case tracking-normal">· {sections.length} sections</span>
          </span>
          <span aria-hidden="true" className="text-[#7a8290] text-xs">▾</span>
        </summary>
        <div className="px-2 pb-3">{list}</div>
      </details>
    </>
  )

  const desktop = (
      <aside className={`hidden lg:block lg:sticky lg:top-24 self-start ${className}`}>
        <nav aria-label="On this page" className="rounded-2xl border border-[#14161a]/10 bg-white p-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mb-3 flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#FF6321] rounded-full" />
            Contents
          </div>
          {list}
        </nav>
      </aside>
  )

  if (variant === 'mobile') return mobile
  if (variant === 'desktop') return desktop
  return <>{mobile}{desktop}</>
}

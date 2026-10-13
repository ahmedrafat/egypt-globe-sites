'use client'
/**
 * HeaderSearch — a search affordance in the main nav. The site has ~500
 * pages and /search existed but was reachable only from a dropdown footer link.
 * Plain GET form to /search?q=…, so it works without JS once opened; "/" opens it
 * from anywhere that is not a text field, Esc closes it.
 */
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const QUICK = [
  ['Rock salt', '/products/salt/rock-salt'],
  ['Sea salt', '/products/salt'],
  ['Cement and clinker', '/products/construction/cement-and-clinker'],
  ['Fertilizers', '/products/fertilizers'],
  ['Port codes', '/ports/egypt-port-codes'],
  ['HS codes', '/trade-tools/hs-codes'],
]

export default function HeaderSearch() {
  const [open, setOpen] = useState(false)
  const input = useRef(null)
  const button = useRef(null)

  useEffect(() => {
    const onKey = e => {
      const t = e.target
      const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setOpen(true) }
      if (e.key === 'Escape' && open) { setOpen(false); button.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => { if (open) input.current?.focus() }, [open])

  return (
    <>
      <button ref={button} type="button" onClick={() => setOpen(o => !o)}
        aria-expanded={open} aria-controls="site-search-panel" aria-label="Search the site"
        className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-[#3f4650] hover:text-[#087a70] hover:bg-[#f9fafb] transition-colors">
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M20 20l-3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div id="site-search-panel" role="search"
          className="absolute left-0 right-0 top-full border-b border-[#14161a]/10 bg-white shadow-[0_24px_40px_-28px_rgba(20,22,26,.4)]">
          <div className="max-w-3xl mx-auto px-5 py-5">
            <form action="/search" method="get" className="flex gap-2">
              <label htmlFor="site-search-q" className="sr-only">Search Egypt Globe Group</label>
              <input id="site-search-q" ref={input} type="search" name="q" autoComplete="off" required
                placeholder="Search products, ports, standards, HS codes"
                className="flex-1 min-w-0 px-5 py-3 rounded-full bg-white text-[#14161a] text-[15px] placeholder-[#67707f] ring-1 ring-[#14161a]/20 focus:outline-none focus:ring-2 focus:ring-[#087a70]" />
              <button type="submit" className="px-6 py-3 rounded-full bg-[#14161a] text-white text-sm font-semibold hover:bg-[#087a70] transition-colors">Search</button>
              <button type="button" onClick={() => { setOpen(false); button.current?.focus() }} aria-label="Close search"
                className="w-11 h-11 shrink-0 rounded-full text-[#5b6472] hover:bg-[#f2f3f5] transition-colors">
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-[#5b6472]">
              <span>Go straight to</span>
              {QUICK.map(([l, h]) => (
                <Link key={h} href={h} onClick={() => setOpen(false)}
                  className="px-3 py-1 rounded-full ring-1 ring-[#14161a]/12 text-[#3f4650] hover:text-[#087a70] hover:ring-[#087a70]/50 transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'
/**
 * BackToTop — pages here run to 10–15 thousand pixels on a phone. The button shows once the
 * reader is well down a page and is heading back up, and it stays out of the way otherwise.
 * Bottom-left, mirroring the WhatsApp button on the right and clearing the sticky quote bar.
 */
import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let last = window.scrollY, ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < 1400) setShow(false)
        else if (y < last - 8) setShow(true)
        else if (y > last + 8) setShow(false)
        last = y; ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const up = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' })
  }
  return (
    <button type="button" onClick={up} aria-label="Back to top" tabIndex={show ? 0 : -1} aria-hidden={!show}
      className={`fixed left-4 sm:left-5 z-30 w-11 h-11 rounded-full bg-white text-[#14161a] ring-1 ring-[#14161a]/15 shadow-[0_8px_24px_-10px_rgba(20,22,26,.4)] flex items-center justify-center transition-all duration-300 motion-reduce:transition-none hover:bg-[#14161a] hover:text-white ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      style={{ bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom) + 5.5rem))' }}>
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  )
}

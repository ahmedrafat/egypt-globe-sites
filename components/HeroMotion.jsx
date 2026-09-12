'use client'

/**
 * HeroMotion — gives every hero the landing page's scroll behaviour: the
 * backdrop drifts down while the copy lifts and fades out as the hero
 * leaves the viewport.
 *
 * The landing does this with GSAP ScrollTrigger as part of its scrollytelling
 * timeline; loading GSAP site-wide would put ~70 KB back on every page right
 * after we took 232 KB off, so this is the same motion in a passive rAF
 * scroll listener. It stands down on the landing (GSAP already owns that
 * hero) and under prefers-reduced-motion.
 *
 * Markup contract: a hero is `[data-hero]`, its backdrop `[data-hero-bg]`
 * (set by HeroBackdrop) and its copy the first relative-positioned child.
 */
import { useEffect } from 'react'

export default function HeroMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    // The landing's GSAP timeline already parallaxes its own hero.
    if (document.querySelector('[data-egg-scrolly]')) return

    const hero = document.querySelector('[data-hero]')
    if (!hero) return
    const bg   = hero.querySelector('[data-hero-bg]')
    const copy = hero.querySelector(':scope > div.relative') || hero.querySelector('div.relative')
    if (!bg && !copy) return

    let frame = 0
    const draw = () => {
      frame = 0
      const h = hero.offsetHeight || 1
      // 0 while the hero is fully in view, 1 once it has scrolled past.
      const p = Math.min(1, Math.max(0, window.scrollY / h))
      if (bg) bg.style.transform = `translate3d(0, ${(p * h * 0.06).toFixed(1)}px, 0) scale(1.14)`
      if (copy) {
        // Copy starts moving at 40% like the landing's second tween.
        const q = Math.min(1, Math.max(0, (p - 0.4) / 0.6))
        copy.style.transform = `translate3d(0, ${(q * -40).toFixed(1)}px, 0)`
        copy.style.opacity = String(1 - q * 0.75)
      }
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(draw) }

    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      if (bg) bg.style.transform = ''
      if (copy) { copy.style.transform = ''; copy.style.opacity = '' }
    }
  }, [])

  return null
}

'use client'

/**
 * ScrollRevealInit — tiny client island that adds `.in-view` to any
 * element with `.scroll-reveal` once it crosses 15% of the viewport.
 * Uses IntersectionObserver, no observer churn after first reveal.
 *
 * Mount once at the root of <body> via app/layout.js.
 */
import { useEffect } from 'react'

export default function ScrollRevealInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('IntersectionObserver' in window)) {
      // Browser doesn't support — just reveal everything immediately.
      document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('in-view'))
      return
    }

    const seen = new WeakSet()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target)
          entry.target.classList.add('in-view')
          observer.unobserve(entry.target)
        }
      }
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.05 })

    function arm() {
      document.querySelectorAll('.scroll-reveal:not(.in-view)').forEach(el => observer.observe(el))
    }
    arm()

    // Also re-arm when route changes (Next App Router fires popstate + click)
    const reArm = () => requestAnimationFrame(arm)
    window.addEventListener('popstate', reArm)
    return () => {
      window.removeEventListener('popstate', reArm)
      observer.disconnect()
    }
  }, [])

  return null
}

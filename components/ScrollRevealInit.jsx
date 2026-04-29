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
    // Mark JS as enabled so the .scroll-reveal hide-state activates.
    // Until this runs, content stays visible (avoids first-paint blank).
    document.documentElement.classList.add('js-enabled')

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
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 })

    // First, immediately reveal anything already in viewport so above-the-fold
    // content never sits hidden waiting for the observer's microtask
    function revealInViewportNow() {
      const vh = window.innerHeight
      document.querySelectorAll('.scroll-reveal:not(.in-view)').forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < vh * 0.95 && rect.bottom > 0) {
          el.classList.add('in-view')
        }
      })
    }
    revealInViewportNow()

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

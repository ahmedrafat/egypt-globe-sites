/**
 * HeroBgSlider — auto-advancing image carousel that lives BEHIND the hero
 * section content. Each slide gets a dark gradient overlay so the
 * headline + subtitle + CTA on top stay legible.
 *
 * Drop 171. Replaces the standalone HeroSlider section approach with an
 * in-place backdrop: the hero text/buttons sit on top of a rotating image
 * stack. When no photos are passed, renders nothing — caller is expected
 * to fall back to the plain white hero.
 *
 * Design-review pass (2026-06-12):
 *  - <img> → next/image (fill + sizes + preload on slide 0) — responsive
 *    srcset stops mobile users downloading the desktop-size LCP image
 *  - Arrows now visible on touch devices (no hover state on touch) —
 *    low-opacity resting state on <md, hover-reveal kept on desktop
 *  - prefers-reduced-motion pauses the auto-advance entirely
 *  - Dot hit-targets enlarged to ≥24px with a visible ≥10px dot
 */
'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

export default function HeroBgSlider({ photos = [], interval = 6000 }) {
  const slides = (photos || []).filter(Boolean)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const next = useCallback(() => setIndex(i => (i + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setIndex(i => (i - 1 + slides.length) % slides.length), [slides.length])

  // Respect prefers-reduced-motion: no auto-advance, slides switch instantly
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = e => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (slides.length <= 1 || paused || reducedMotion) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [slides.length, paused, reducedMotion, interval, next])

  if (slides.length === 0) return null

  return (
    <>
      {/* Slides stacked behind the hero content. Each one fades in / out.
       *  z-0 (not -z-10) so we stay within the section's stacking context
       *  and don't get clipped behind the <main> element's bg-white. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((url, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={`absolute inset-0 ease-in-out ${reducedMotion ? '' : 'transition-opacity duration-1000'} ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="100vw"
              quality={70}
              preload={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="object-cover"
            />
          </div>
        ))}
        {/* Dark gradient over the photo so the hero text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/65 to-slate-900/40" />
      </div>

      {/* Controls — only when there's more than one slide. Sit above text. */}
      {slides.length > 1 && (
        <>
          {/* Prev / Next — resting low-opacity on touch (<md has no hover),
              hover/focus-reveal on desktop */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/15 hover:bg-white/30 text-white backdrop-blur rounded-full flex items-center justify-center opacity-50 md:opacity-0 md:hover:opacity-100 focus:opacity-100 transition-opacity z-20"
          >
            <span className="text-xl leading-none">‹</span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/15 hover:bg-white/30 text-white backdrop-blur rounded-full flex items-center justify-center opacity-50 md:opacity-0 md:hover:opacity-100 focus:opacity-100 transition-opacity z-20"
          >
            <span className="text-xl leading-none">›</span>
          </button>

          {/* Dots — bottom centre. ≥24px hit-targets, ≥10px visible dot. */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex z-20">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className="p-2 flex items-center justify-center"
              >
                <span
                  className={`transition-all rounded-full ${i === index ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}

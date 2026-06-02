/**
 * HeroSlider — auto-advancing image carousel used right under the
 * hero on the homepage and any other page that wants it.
 *
 * Drop 170. Inputs: photos[] (array of image URLs). Shows arrows + dots.
 * Auto-advances every 6s but pauses on hover. Lazy-loads non-active
 * slides via the browser's native lazy="lazy" attribute.
 *
 * Client component because it needs useState + useEffect for the
 * slide rotation + manual prev/next controls.
 */
'use client'

import { useEffect, useState, useCallback } from 'react'

export default function HeroSlider({ photos = [], label = 'Photos', interval = 6000 }) {
  const slides = (photos || []).filter(Boolean)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setIndex(i => (i + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setIndex(i => (i - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [slides.length, paused, interval, next])

  if (slides.length === 0) return null

  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="px-6 sm:px-10 lg:px-16 pt-10 pb-2 flex items-center justify-between">
        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">{label}</p>
        {slides.length > 1 && (
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </p>
        )}
      </div>

      <div
        className="relative w-full aspect-[16/8] sm:aspect-[16/7] bg-slate-200 overflow-hidden group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        {slides.map((url, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${label} ${i + 1}`}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}

        {/* Prev / Next controls — only if more than one slide */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            >
              <span className="text-xl leading-none">‹</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
            >
              <span className="text-xl leading-none">›</span>
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all rounded-full ${i === index ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/60 hover:bg-white/90'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

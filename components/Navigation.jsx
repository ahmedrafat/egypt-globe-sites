'use client'
import { useState, useEffect } from 'react'

const defaultLinks = [
  { id: 'home', label: 'Home', href: '#', external: false },
  { id: 'about', label: 'About', href: '#about', external: false },
  { id: 'services', label: 'Services', href: '#services', external: false },
  { id: 'contact', label: 'Contact', href: '#contact', external: false },
]

export default function Navigation({ site, basePath = '' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const rawLinks = site.navigation?.length > 0 ? site.navigation : defaultLinks
  const primary = site.theme.primaryColor

  // Detect scroll to intensify backdrop
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Smooth-scroll helper for anchor links
  function handleAnchorClick(e, href) {
    if (!href.startsWith('#')) return
    const id = href.slice(1)
    if (!id) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setOpen(false)
      return
    }
    const target = document.getElementById(id)
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  // Resolve href: if it starts with / and isn't an anchor, prepend basePath
  function resolveHref(href) {
    if (!href) return '#'
    if (href.startsWith('#')) return href
    if (href.startsWith('http')) return href
    if (href === '/') return basePath || '/'
    return `${basePath}${href}`
  }

  const links = rawLinks.map((l) => ({ ...l, resolvedHref: resolveHref(l.href) }))

  return (
    <nav
      className="sticky top-0 z-50 border-b transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8,8,8,0.96)' : 'rgba(10,10,10,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 1px 40px rgba(0,0,0,0.6)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group"
            onClick={(e) => handleAnchorClick(e, '#')}
          >
            <span className="text-2xl">{site.brandLogo}</span>
            <span className="font-bold text-lg tracking-tight" style={{ color: primary }}>
              {site.brandName}
            </span>
            {/* Color dot accent */}
            <span
              className="w-1.5 h-1.5 rounded-full mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ background: primary }}
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.id || link.label}
                href={link.resolvedHref}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                onClick={(e) => handleAnchorClick(e, link.resolvedHref)}
              >
                {link.label}
                {link.external && (
                  <span className="ml-1 text-xs opacity-50">↗</span>
                )}
              </a>
            ))}
            <a
              href={resolveHref('#contact')}
              className="ml-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: primary, boxShadow: `0 4px 16px ${primary}40` }}
              onClick={(e) => handleAnchorClick(e, '#contact')}
            >
              Contact
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg transition-colors hover:bg-white/5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '400px' : '0', opacity: open ? 1 : 0 }}
      >
        <div className="border-t border-white/10 bg-black/95 px-4 py-4 space-y-1">
          {links.map((link) => (
            <a
              key={link.id || link.label}
              href={link.resolvedHref}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
              onClick={(e) => handleAnchorClick(e, link.resolvedHref)}
            >
              {link.label}
              {link.external && <span className="text-xs opacity-50">↗</span>}
            </a>
          ))}
          <div className="pt-2">
            <a
              href={resolveHref('#contact')}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: primary }}
              onClick={(e) => handleAnchorClick(e, '#contact')}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

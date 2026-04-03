'use client'
import { useState } from 'react'

const defaultLinks = [
  { id: 'home', label: 'Home', href: '#', external: false },
  { id: 'about', label: 'About', href: '#about', external: false },
  { id: 'services', label: 'Services', href: '#services', external: false },
  { id: 'contact', label: 'Contact', href: '#contact', external: false },
]

export default function Navigation({ site, basePath = '' }) {
  const [open, setOpen] = useState(false)
  const rawLinks = site.navigation?.length > 0 ? site.navigation : defaultLinks
  const primary = site.theme.primaryColor

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
      className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10"
      style={{ background: 'rgba(10,10,10,0.85)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-2xl">{site.brandLogo}</span>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ color: primary }}
            >
              {site.brandName}
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.id || link.label}
                href={link.resolvedHref}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
                {link.external && (
                  <span className="ml-1 text-xs opacity-50">↗</span>
                )}
              </a>
            ))}
            <a
              href={resolveHref('/contact')}
              className="ml-2 px-4 py-1.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: primary }}
            >
              Contact
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/95 px-4 py-4 space-y-2">
          {links.map((link) => (
            <a
              key={link.id || link.label}
              href={link.resolvedHref}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="block py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

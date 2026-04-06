'use client'

const QUICK_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'About Us', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

const SOCIAL_ICONS = {
  linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
}

export default function Footer({ site }) {
  const { social, domain, brandName, brandLogo, theme, navigation, sections } = site
  const primary = theme.primaryColor
  const year = new Date().getFullYear()

  const socialLinks = [
    { key: 'linkedin', label: 'LinkedIn', url: social?.linkedin },
    { key: 'twitter', label: 'X / Twitter', url: social?.twitter },
    { key: 'instagram', label: 'Instagram', url: social?.instagram },
    { key: 'github', label: 'GitHub', url: social?.github },
  ].filter((s) => s.url)

  // Build quick links from site navigation or defaults
  const quickLinks = navigation?.length > 0
    ? navigation.slice(0, 5).map(l => ({ label: l.label, href: l.href }))
    : QUICK_LINKS

  // Contact info
  const contact = sections?.contact || {}

  return (
    <footer className="border-t border-white/8 mt-24">
      {/* Top gradient line */}
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(to right, transparent, ${primary}60, transparent)` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* 3-column grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Col 1: Brand info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">{brandLogo}</span>
              <span className="font-bold text-lg" style={{ color: primary }}>
                {brandName}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-xs">
              {site.seo?.metaDescription || `${brandName} — premium Egyptian exports connecting local excellence to global markets.`}
            </p>
            <p className="text-xs text-gray-600 mb-1">{domain}</p>
            <p className="text-xs text-gray-600">
              Part of the{' '}
              <a
                href="https://egyptglobegroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
                style={{ color: primary }}
              >
                Egypt Globe Group
              </a>
            </p>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-5">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white border border-white/8 hover:border-white/20 transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {SOCIAL_ICONS[s.key] || s.label[0]}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: primary }}
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-gray-500">
              {contact.email && (
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 opacity-60">✉</span>
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors break-all">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 opacity-60">☎</span>
                  <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.address && (
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 opacity-60">📍</span>
                  <span className="leading-relaxed">{contact.address}</span>
                </div>
              )}
              {!contact.email && !contact.phone && !contact.address && (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="opacity-60">📍</span>
                    <span>Cairo, Egypt</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="opacity-60">✉</span>
                    <a href={`mailto:info@${domain}`} className="hover:text-white transition-colors">
                      info@{domain}
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
          <p>
            &copy; {year} {brandName}. All rights reserved.
          </p>
          <p>
            Powered by{' '}
            <a
              href="https://egyptglobegroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: primary }}
            >
              Egypt Globe Group
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

export default function Footer({ site }) {
  const { social, domain, brandName, brandLogo, theme } = site
  const primary = theme.primaryColor
  const year = new Date().getFullYear()

  const socialLinks = [
    { key: 'linkedin', label: 'LinkedIn', url: social?.linkedin },
    { key: 'twitter', label: 'X / Twitter', url: social?.twitter },
    { key: 'instagram', label: 'Instagram', url: social?.instagram },
    { key: 'github', label: 'GitHub', url: social?.github },
  ].filter((s) => s.url)

  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{brandLogo}</span>
              <span className="font-bold text-lg" style={{ color: primary }}>
                {brandName}
              </span>
            </div>
            <p className="text-sm text-gray-500">{domain}</p>
            <p className="text-xs text-gray-600 mt-2">
              Part of the{' '}
              <a
                href="https://egyptglobegroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-400 transition-colors"
                style={{ color: primary }}
              >
                Egypt Globe Group
              </a>
            </p>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <p>
            &copy; {year} {brandName}. All rights reserved.
          </p>
          <p>
            Powered by{' '}
            <span style={{ color: primary }}>Egypt Globe Group</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

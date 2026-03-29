'use client'

export default function HeroSection({ site }) {
  const { theme, sections, brandName, brandLogo } = site
  const hero = sections.hero
  const primary = theme.primaryColor
  const accent = theme.accentColor

  // Split title on \n for line breaks
  const titleLines = (hero.title || '').split('\n')

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: hero.bgImage
          ? `linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(${hero.bgImage}) center/cover no-repeat`
          : `radial-gradient(ellipse at 60% 30%, ${primary}22 0%, transparent 70%), radial-gradient(ellipse at 10% 80%, ${accent}11 0%, transparent 60%)`,
      }}
    >
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(${primary}33 1px, transparent 1px), linear-gradient(90deg, ${primary}33 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border"
            style={{ borderColor: `${primary}44`, color: primary, background: `${primary}11` }}
          >
            <span>{brandLogo}</span>
            <span>{brandName}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            {titleLines.map((line, i) => (
              <span key={i} className={i > 0 ? 'block' : 'block'}>
                {i === 1 ? (
                  <span style={{ color: primary }}>{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
            {hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            {hero.ctaText && (
              <a
                href={hero.ctaLink || '#contact'}
                className="px-6 py-3 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                style={{ background: primary, boxShadow: `0 4px 24px ${primary}44` }}
              >
                {hero.ctaText}
              </a>
            )}
            {hero.secondaryCta && (
              <a
                href={hero.secondaryCtaLink || '#'}
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:bg-white/10 border border-white/20 text-white"
              >
                {hero.secondaryCta} →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }}
      />
    </section>
  )
}

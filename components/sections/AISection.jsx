'use client'

export default function AISection({ site }) {
  const { theme, sections, brandName } = site
  const ai = sections.aiSection
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  if (!ai) return null

  const highlights = ai.highlights || []

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 border-y border-white/5"
        style={{ background: `linear-gradient(to bottom right, ${primary}08 0%, transparent 50%, ${accent}05 100%)` }} />
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
          {/* Left: Highlights grid */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map((h, i) => (
              <div key={i}
                className="rounded-2xl border border-white/10 p-5 group hover:border-white/20 transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-4"
                  style={{ background: `${primary}18` }}>
                  {['🤖', '⚡', '🔍', '📊', '🌐', '🛡️', '📡', '🧠'][i % 8]}
                </div>
                <p className="text-sm font-semibold text-white leading-snug">{h}</p>
              </div>
            ))}
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-6 uppercase tracking-wider"
              style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}>
              🤖 AI-Powered
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
              {ai.title || 'AI-Powered Intelligence'}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">{ai.subtitle}</p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {highlights.slice(0, 4).map((h, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: `${primary}20`, color: primary }}>✓</span>
                  {h}
                </li>
              ))}
            </ul>

            <a href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110 hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, boxShadow: `0 8px 24px ${primary}35` }}>
              Learn More About EGG OS →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

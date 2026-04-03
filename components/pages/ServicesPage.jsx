'use client'

const ICON_MAP = {
  cpu: '⚙️', brain: '🧠', smartphone: '📱', wifi: '☁️',
  'file-check': '✅', zap: '⚡', flask: '🧪', factory: '🏭',
  ship: '🚢', wheat: '🌾', 'bar-chart': '📊', globe: '🌍',
  anchor: '⚓', truck: '🚛', leaf: '🌿', gem: '💎',
  beaker: '⚗️', settings: '🔧', users: '👥', shield: '🛡️',
  hammer: '🔨', chart: '📈', monitor: '🖥️', database: '🗄️',
}

function getIcon(iconName) {
  return ICON_MAP[iconName] || '●'
}

export default function ServicesPage({ site }) {
  const { theme, sections, brandName } = site
  const primary = theme.primaryColor
  const features = sections.features

  if (!features?.items?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Services information coming soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 border"
          style={{ borderColor: `${primary}44`, color: primary, background: `${primary}11` }}
        >
          {brandName}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          {features.title || 'Our Services'}
        </h1>
        {features.subtitle && (
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{features.subtitle}</p>
        )}
      </div>

      {/* Services grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 p-6 group transition-all hover:border-white/20 hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-5"
              style={{ background: `${primary}15` }}
            >
              {getIcon(item.icon)}
            </div>
            <h3 className="text-lg font-bold mb-3">{item.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

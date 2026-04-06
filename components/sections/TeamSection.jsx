'use client'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_MEMBERS = [
  {
    name: 'Ahmed El-Sayed',
    title: 'Chief Executive Officer',
    bio: 'Over 20 years leading Egyptian export operations across Europe, Asia, and the Gulf. Former advisor to GOEIC.',
    initials: 'AE',
  },
  {
    name: 'Sara Hassan',
    title: 'Head of International Trade',
    bio: 'Specialized in EU compliance and phytosanitary standards. Manages key accounts across 30+ markets.',
    initials: 'SH',
  },
  {
    name: 'Mahmoud Khalil',
    title: 'Director of Operations',
    bio: 'Oversees logistics, warehousing, and quality control across all product categories. ISO 9001 lead auditor.',
    initials: 'MK',
  },
  {
    name: 'Nadia Yousef',
    title: 'Chief Financial Officer',
    bio: 'Manages multi-currency treasury, trade finance, and banking relationships for international transactions.',
    initials: 'NY',
  },
]

function MemberCard({ member, primary, accent, index }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl border border-white/8 p-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.025)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ${index * 0.1}s, transform 0.6s ${index * 0.1}s, border-color 0.2s`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 36px ${primary}14` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg mb-5 transition-transform duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${primary}30, ${accent || primary}20)`,
          border: `1px solid ${primary}30`,
          color: primary,
        }}
      >
        {member.initials}
      </div>

      <h3 className="font-bold text-white text-base mb-1">{member.name}</h3>
      <p className="text-xs font-semibold mb-3" style={{ color: primary }}>{member.title}</p>
      <p className="text-sm text-gray-400 leading-relaxed">{member.bio}</p>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded"
        style={{ background: `linear-gradient(to right, ${primary}, ${accent || primary})` }}
      />
    </div>
  )
}

export default function TeamSection({ site }) {
  const { theme, sections } = site
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary

  const rawMembers = sections.team?.members
  const members = rawMembers?.length > 0 ? rawMembers : DEFAULT_MEMBERS

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden border-t border-white/5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 uppercase tracking-wider"
            style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}
          >
            {sections.team?.badge || 'Leadership Team'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            {sections.team?.title || 'The People Behind the Brand'}
          </h2>
          {sections.team?.subtitle && (
            <p className="text-gray-400 text-lg">{sections.team.subtitle}</p>
          )}
          <div className="flex justify-center mt-6">
            <div
              className="h-1 w-16 rounded-full"
              style={{ background: `linear-gradient(to right, ${primary}, ${accent})` }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {members.map((member, i) => (
            <MemberCard key={i} member={member} primary={primary} accent={accent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

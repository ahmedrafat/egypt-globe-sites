'use client'

/**
 * MarkdownTabs — Drop 133.
 *
 * Drops the long-scroll RichPageBody on non-SKU editorial pages. Takes a
 * markdown body and auto-splits it on `## H2` boundaries into tabs. Each
 * H2 becomes a tab label, the section content is its body. Pre-H2 content
 * (intro paragraph) becomes the "Overview" tab.
 *
 * Sticky-top tab bar matches the ProductTabs pattern from Drop 132 so the
 * UX is consistent across the whole site. All tab panels render in DOM
 * with display:none on inactive ones — SEO-safe.
 *
 * If the body has < 2 H2 sections (or no H2), falls back to rendering
 * the full markdown without tabs (no point in a single-tab layout).
 */
import { useState, useEffect, useMemo } from 'react'
import RichPageBody from '../RichPageBody'

// Best-guess emoji per common section title — purely decorative
const TITLE_ICONS = [
  { re: /overview|about|introduction/i,                         icon: '📖' },
  { re: /spec|standard|quality|certif|grade/i,                  icon: '🧪' },
  { re: /pack|packaging|format|bag/i,                           icon: '📦' },
  { re: /load|port|ship|transit|logistics|incoterm/i,           icon: '🚢' },
  { re: /document|paperwork|l\/c|letter of credit|customs/i,    icon: '📋' },
  { re: /quote|order|rfq|enquiry|contact/i,                     icon: '📨' },
  { re: /tariff|duty|tax|customs framework/i,                   icon: '💰' },
  { re: /port routing|gateway/i,                                icon: '⚓' },
  { re: /commod|product/i,                                       icon: '🏗' },
  { re: /lead time|delivery/i,                                  icon: '⏱' },
  { re: /preferential|free.trade|comesa|pafta|ecowas/i,         icon: '🤝' },
  { re: /application|industry|use/i,                            icon: '🏭' },
  { re: /history|timeline|founded/i,                            icon: '📅' },
  { re: /location|office|footprint|map/i,                       icon: '📍' },
  { re: /career|join|team|hire/i,                               icon: '👥' },
  { re: /sustain|esg|environ|impact/i,                          icon: '🌱' },
  { re: /faq|question|answer/i,                                 icon: '❓' },
]
function pickIcon(title) {
  const t = title || ''
  for (const r of TITLE_ICONS) if (r.re.test(t)) return r.icon
  return '•'
}

function splitMarkdown(md) {
  if (!md) return { intro: '', sections: [] }
  const lines = md.split('\n')
  const sections = []
  let intro = []
  let current = null
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/)
    if (m) {
      if (current) sections.push(current)
      current = { title: m[1].trim(), lines: [] }
    } else if (current) {
      current.lines.push(line)
    } else {
      intro.push(line)
    }
  }
  if (current) sections.push(current)
  return {
    intro: intro.join('\n').trim(),
    sections: sections.map(s => ({
      title: s.title,
      content: s.lines.join('\n').trim(),
      icon: pickIcon(s.title),
    })),
  }
}

function slugify(title) {
  return (title || 'tab').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'tab'
}

export default function MarkdownTabs({ body, title, leadingWidget = null }) {
  const { intro, sections } = useMemo(() => splitMarkdown(body), [body])

  // Build the final tab list — Overview first (intro), then one per H2.
  const tabs = useMemo(() => {
    const out = []
    if (intro) out.push({ id: 'overview', label: 'Overview', icon: '📖', content: intro })
    for (const s of sections) {
      out.push({ id: slugify(s.title), label: s.title, icon: s.icon, content: s.content })
    }
    return out
  }, [intro, sections])

  const [active, setActive] = useState(tabs[0]?.id || 'overview')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const h = window.location.hash.replace('#', '')
    if (h && tabs.find(t => t.id === h)) setActive(h)
    function onHash() {
      const h = window.location.hash.replace('#', '')
      if (h && tabs.find(t => t.id === h)) setActive(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [tabs])

  function go(id) {
    setActive(id)
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${id}`)
      const el = document.getElementById('mdtabs')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // No useful structure — render full markdown without tabs
  if (tabs.length < 2) {
    return (
      <div className="space-y-6">
        {leadingWidget}
        {body && <RichPageBody content={body} />}
      </div>
    )
  }

  return (
    <section id="mdtabs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Optional category widget above tabs */}
      {leadingWidget && <div className="mb-8">{leadingWidget}</div>}

      {/* Sticky tab bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap max-w-[260px] ${
                  active === t.id
                    ? 'border-[#1d5fa1] text-[#1d5fa1]'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
                title={t.label}
              >
                <span aria-hidden="true">{t.icon}</span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panels — render all so SEO crawlers see everything (display:none on inactive) */}
      <div className="pt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="min-w-0 max-w-3xl">
          {tabs.map(t => (
            <div key={t.id} className={active === t.id ? 'animate-fade-in-up' : 'hidden'}>
              <RichPageBody content={t.content} />
            </div>
          ))}
        </div>

        {/* Mini section-list on the right (acts as TOC) */}
        <aside className="lg:sticky lg:top-24 self-start hidden lg:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
              On this page
            </div>
            <ul className="space-y-1">
              {tabs.map(t => (
                <li key={t.id}>
                  <button
                    onClick={() => go(t.id)}
                    className={`w-full text-left text-xs px-2 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                      active === t.id
                        ? 'bg-blue-50 text-[#1d5fa1] font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span aria-hidden="true">{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <a href="/rfq"
                className="block w-full text-center bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold text-xs py-2.5 rounded-lg transition-all">
                📋 Quote in 24 hours
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

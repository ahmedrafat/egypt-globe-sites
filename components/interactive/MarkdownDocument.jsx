'use client'

/**
 * MarkdownDocument — editorial body layout (supersedes the Drop 133 tabs).
 *
 * Splits body_markdown on `## H2` boundaries, same as before, but renders
 * the result as ONE continuous document with a sticky contents rail
 * instead of a tab strip.
 *
 * Why the change: auto-tabbing produced up to eleven tabs on reference
 * pages (/standards/en-16811-1) and ten on market guides, and every
 * inactive panel was display:none — measured live, roughly two thirds of
 * each page's text was hidden behind clicks. Buyers of bulk commodities
 * scan and print these pages; a standards or port page is a document, not
 * an app. Stacked sections also give every heading a real #anchor to
 * deep-link and quote.
 *
 * Sections carry ids + scroll-mt so the sticky header never covers a
 * heading landed on from the rail.
 */
import { useMemo } from 'react'
import RichPageBody from '../RichPageBody'
import SectionIndex, { SECTION_ANCHOR } from '../ui/SectionIndex'
import Icon from '../ui/Icon'

// Best-guess emoji per common section title — purely decorative
const TITLE_ICONS = [
  { re: /overview|about|introduction/i,                         icon: 'book' },
  { re: /spec|standard|quality|certif|grade/i,                  icon: 'beaker' },
  { re: /pack|packaging|format|bag/i,                           icon: 'box' },
  { re: /load|port|ship|transit|logistics|incoterm/i,           icon: 'ship' },
  { re: /document|paperwork|l\/c|letter of credit|customs/i,    icon: 'doc' },
  { re: /quote|order|rfq|enquiry|contact/i,                     icon: 'mail' },
  { re: /tariff|duty|tax|customs framework/i,                   icon: 'coins' },
  { re: /port routing|gateway/i,                                icon: 'anchor' },
  { re: /commod|product/i,                                       icon: 'building' },
  { re: /lead time|delivery/i,                                  icon: '⏱' },
  { re: /preferential|free.trade|comesa|pafta|ecowas/i,         icon: 'handshake' },
  { re: /application|industry|use/i,                            icon: 'factory' },
  { re: /history|timeline|founded/i,                            icon: 'calendar' },
  { re: /location|office|footprint|map/i,                       icon: 'pin' },
  { re: /career|join|team|hire/i,                               icon: 'users' },
  { re: /sustain|esg|environ|impact/i,                          icon: 'leaf' },
  { re: /faq|question|answer/i,                                 icon: 'question' },
]
function pickIcon(title) {
  const t = title || ''
  for (const r of TITLE_ICONS) if (r.re.test(t)) return r.icon
  return 'dot'
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

export default function MarkdownDocument({ body, title, leadingWidget = null }) {
  const { intro, sections } = useMemo(() => splitMarkdown(body), [body])

  const parts = useMemo(() => {
    const out = []
    if (intro) out.push({ id: 'overview', label: 'Overview', icon: 'book', content: intro })
    for (const s of sections) {
      out.push({ id: slugify(s.title), label: s.title, icon: s.icon, content: s.content })
    }
    return out
  }, [intro, sections])

  // Nothing to structure — render the body plainly.
  if (parts.length < 2) {
    return (
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {leadingWidget && <div className="mb-8">{leadingWidget}</div>}
        {body && <div className="max-w-3xl"><RichPageBody content={body} /></div>}
      </section>
    )
  }

  return (
    <section id="document" className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
      {leadingWidget && <div className="mb-10">{leadingWidget}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] lg:gap-12">
        <div className="min-w-0 max-w-3xl order-2 lg:order-1">
          {parts.map((p, i) => (
            <article
              key={p.id}
              id={p.id}
              className={`${SECTION_ANCHOR} ${i > 0 ? 'mt-12 pt-10 border-t border-[#14161a]/10' : ''}`}
            >
              {/* The intro keeps the page h1 as its heading — no duplicate label. */}
              {p.id !== 'overview' && (
                <header className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#f6f7f9] ring-1 ring-[#14161a]/10">
                      <Icon name={p.icon} className="w-3.5 h-3.5 text-[#5b6472]" />
                    </span>
                    <span className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-[#9aa2ae]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="egg-display text-2xl sm:text-3xl leading-tight text-[#14161a]">
                    {p.label}
                  </h2>
                </header>
              )}
              <RichPageBody content={p.content} />
            </article>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <SectionIndex sections={parts} />
        </div>
      </div>
    </section>
  )
}

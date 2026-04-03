'use client'
import { useState } from 'react'

export default function ContactPage({ site }) {
  const { theme, sections, brandName } = site
  const primary = theme.primaryColor
  const contact = sections.contact || {}
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 border"
          style={{ borderColor: `${primary}44`, color: primary, background: `${primary}11` }}
        >
          Get in touch
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contact {brandName}</h1>
        <p className="text-lg text-gray-400">Reach out for quotes, partnerships, or any enquiry.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Info panel */}
        <div className="space-y-8">
          {[
            { label: 'Email', value: contact.email, href: `mailto:${contact.email}`, icon: '✉️' },
            { label: 'Phone', value: contact.phone, href: `tel:${contact.phone?.replace(/\s/g, '')}`, icon: '📞' },
            { label: 'Address', value: contact.address, icon: '📍' },
            { label: 'Office Hours', value: contact.hours, icon: '🕐' },
          ]
            .filter((x) => x.value)
            .map((item) => (
              <div key={item.label} className="flex gap-4 items-start">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ background: `${primary}15` }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-white font-medium hover:opacity-80 transition-opacity"
                      style={{ color: primary }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

          {/* Social links */}
          {site.social && Object.values(site.social).some(Boolean) && (
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Follow us</p>
              <div className="flex gap-3">
                {site.social.linkedin && (
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all"
                  >
                    LinkedIn ↗
                  </a>
                )}
                {site.social.twitter && (
                  <a
                    href={site.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all"
                  >
                    Twitter ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact form */}
        <div
          className="rounded-xl border border-white/10 p-8"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Message sent!</h3>
              <p className="text-gray-400 text-sm">We'll get back to you within 1 business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Your name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Ahmed Mohamed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Company</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  placeholder="Describe your inquiry, required volume, delivery timeline…"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: primary, boxShadow: `0 4px 24px ${primary}44` }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

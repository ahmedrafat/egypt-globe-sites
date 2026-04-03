'use client'
import { useState } from 'react'

export default function ContactPage({ site }) {
  const { theme, sections, brandName, brandLogo } = site
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  const contact = sections.contact || {}
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  const infoItems = [
    { icon: '✉️', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: '📞', label: 'Phone', value: contact.phone, href: `tel:${contact.phone?.replace(/\s/g, '')}` },
    { icon: '📍', label: 'Address', value: contact.address },
    { icon: '🕐', label: 'Office Hours', value: contact.hours },
  ].filter(x => x.value)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-5 uppercase tracking-wider"
          style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}>
          {brandLogo} Contact Us
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Get in Touch</h1>
        <p className="text-gray-400 text-lg">We typically respond within 1 business day.</p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">
        {/* Left: Info */}
        <div className="space-y-4">
          {infoItems.map((item) => (
            <div key={item.label}
              className="flex gap-4 items-start p-5 rounded-2xl border border-white/8 group hover:border-white/15 transition-all"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${primary}15` }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{item.label}</div>
                {item.href ? (
                  <a href={item.href} className="text-sm font-semibold break-all transition-colors hover:opacity-80"
                    style={{ color: primary }}>{item.value}</a>
                ) : (
                  <p className="text-sm text-white font-medium leading-snug">{item.value}</p>
                )}
              </div>
            </div>
          ))}

          {/* Social links */}
          {site.social && Object.values(site.social).some(Boolean) && (
            <div className="p-5 rounded-2xl border border-white/8" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Follow Us</div>
              <div className="flex flex-wrap gap-2">
                {site.social.linkedin && (
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    LinkedIn ↗
                  </a>
                )}
                {site.social.twitter && (
                  <a href={site.social.twitter} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    Twitter ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div className="rounded-3xl border border-white/10 p-8 sm:p-10"
          style={{ background: 'rgba(255,255,255,0.025)' }}>
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5"
                style={{ background: '#22c55e18' }}>✅</div>
              <h3 className="text-2xl font-black mb-2">Message Sent!</h3>
              <p className="text-gray-400 max-w-sm">We'll get back to you within 1 business day. Thank you for reaching out.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { name: 'name', label: 'Full Name', placeholder: 'Ahmed Mohamed', type: 'text', required: true },
                  { name: 'email', label: 'Email Address', placeholder: 'you@company.com', type: 'email', required: true },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 bg-white/5 focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 bg-white/5 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your requirement, volume, timeline..."
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 border border-white/10 bg-white/5 focus:outline-none focus:border-white/25 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, boxShadow: `0 8px 24px ${primary}35` }}>
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

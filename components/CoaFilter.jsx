'use client'
/**
 * CoaFilter — search + division chips for the CoA wall.
 *
 * The server renders every certificate card (so they stay crawlable); this
 * only toggles `hidden` on cards that carry data-coa-card, data-division and
 * data-text. With JS off the page is the plain list.
 */
import { useEffect, useState } from 'react'
import Icon from './ui/Icon'

export default function CoaFilter({ divisions, total }) {
  const [q, setQ] = useState('')
  const [div, setDiv] = useState('all')
  const [shown, setShown] = useState(total)

  useEffect(() => {
    const needle = q.trim().toLowerCase()
    let n = 0
    document.querySelectorAll('[data-coa-card]').forEach(el => {
      const ok = (div === 'all' || el.dataset.division === div) && (!needle || (el.dataset.text || '').includes(needle))
      el.hidden = !ok
      if (ok) n++
    })
    document.querySelectorAll('[data-coa-section]').forEach(sec => {
      sec.hidden = !sec.querySelector('[data-coa-card]:not([hidden])')
    })
    setShown(n)
  }, [q, div])

  const chip = (id, label, count) => (
    <button key={id} type="button" aria-pressed={div === id} onClick={() => setDiv(id)}
      className={`egg-chip text-xs whitespace-nowrap transition-all ${div === id ? 'text-[#14161a] shadow-[inset_0_0_0_1.5px_rgba(20,22,26,.55)]' : 'hover:text-[#14161a]'}`}>
      {label}<span className="ml-1 text-[11px] font-bold tabular-nums text-[#67707f]">{count}</span>
    </button>
  )

  return (
    <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
      <label className="relative lg:w-80 shrink-0">
        <span className="sr-only">Search certificates</span>
        <Icon name="search" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#67707f] pointer-events-none" />
        <input type="search" value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search by product or reference…"
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-sm text-[#14161a] placeholder-[#67707f] ring-1 ring-[#14161a]/15 focus:outline-none focus:ring-2 focus:ring-[#ff6321]" />
      </label>
      <div className="flex gap-2 overflow-x-auto min-w-0 pb-0.5" role="group" aria-label="Filter by division">
        {chip('all', 'All', total)}
        {divisions.map(d => chip(d.id, d.label, d.count))}
      </div>
      <p className="text-xs text-[#5b6577] tabular-nums lg:ml-auto shrink-0" aria-live="polite">
        {shown === total ? `${total} certificates` : `${shown} of ${total} shown`}
      </p>
    </div>
  )
}

'use client'

/**
 * TransitTimeCalculator — Drop 132 interactive widget.
 *
 * Buyer picks loading port + destination region → gets indicative transit
 * days + Suez vs Gibraltar routing hint + sample destination ports for
 * the chosen region. Replaces the static "How we ship" markdown paragraph
 * with something the buyer actively interacts with — and the result
 * pre-fills the inline RFQ form below.
 *
 * Numbers come from the per-port pages we shipped in Drop 124c — same
 * source of truth.
 *
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import { useState, useMemo, useEffect } from 'react'

// Loading-port routing matrix. Each entry is the indicative transit-day
// range from POL → destination region cluster. "Suez" / "Gibraltar"
// indicates the typical canal routing.
const PORTS = [
  { id: 'damietta',     label: 'Damietta',      icon: '⚓', source: 'mediterranean' },
  { id: 'alexandria',   label: 'Alexandria',    icon: '⚓', source: 'mediterranean' },
  { id: 'el-dekheila',  label: 'El Dekheila',   icon: '⚓', source: 'mediterranean' },
  { id: 'port-said',    label: 'Port Said',     icon: '⚓', source: 'mediterranean' },
  { id: 'ain-sokhna',   label: 'Ain Sokhna',    icon: '⚓', source: 'red-sea' },
  { id: 'adabiya',      label: 'Adabiya',       icon: '⚓', source: 'red-sea' },
  { id: 'al-arish',     label: 'Al-Arish',      icon: '⚓', source: 'mediterranean' },
]

const REGIONS = [
  {
    id: 'gcc', label: 'GCC (Saudi / UAE / Kuwait / Qatar / Bahrain / Oman)',
    sample: ['Jeddah', 'Dammam', 'Jebel Ali', 'Sohar'],
    fromMed: { days: '7-10', via: 'Suez', toll: 'YES' },
    fromRed: { days: '2-7',  via: 'Direct', toll: 'NO' },
  },
  {
    id: 'east-africa', label: 'East Africa (Kenya / Tanzania / Mozambique)',
    sample: ['Mombasa', 'Dar es Salaam', 'Beira'],
    fromMed: { days: '18-22', via: 'Suez', toll: 'YES' },
    fromRed: { days: '10-14', via: 'Direct', toll: 'NO' },
  },
  {
    id: 'south-asia', label: 'South Asia (India / Pakistan / Sri Lanka)',
    sample: ['Mundra', 'JNPT', 'Karachi', 'Colombo'],
    fromMed: { days: '14-17', via: 'Suez', toll: 'YES' },
    fromRed: { days: '9-12',  via: 'Direct', toll: 'NO' },
  },
  {
    id: 'far-east', label: 'Far East (China / Vietnam / Singapore)',
    sample: ['Shanghai', 'Hong Kong', 'Singapore'],
    fromMed: { days: '22-26', via: 'Suez', toll: 'YES' },
    fromRed: { days: '15-18', via: 'Direct', toll: 'NO' },
  },
  {
    id: 'north-europe', label: 'North Europe (NL / DE / UK / BE / IE)',
    sample: ['Rotterdam', 'Hamburg', 'Felixstowe'],
    fromMed: { days: '7-10',  via: 'Gibraltar', toll: 'NO' },
    fromRed: { days: '12-15', via: 'Suez+Gib',  toll: 'YES' },
  },
  {
    id: 'mediterranean', label: 'Mediterranean (IT / ES / FR / GR / TR)',
    sample: ['Genoa', 'Marseille', 'Algeciras', 'Piraeus', 'Mersin'],
    fromMed: { days: '3-5',   via: 'Direct', toll: 'NO' },
    fromRed: { days: '7-10',  via: 'Suez',   toll: 'YES' },
  },
  {
    id: 'west-africa', label: 'West Africa (Nigeria / Ghana / Senegal)',
    sample: ['Lagos / Apapa', 'Tema', 'Dakar'],
    fromMed: { days: '14-17', via: 'Gibraltar', toll: 'NO' },
    fromRed: { days: '20-24', via: 'Cape',      toll: 'NO' },
  },
  {
    id: 'americas', label: 'Americas (US East / Caribbean / Brazil)',
    sample: ['NY / NJ', 'Houston', 'Santos'],
    fromMed: { days: '12-16', via: 'Atlantic',  toll: 'NO' },
    fromRed: { days: '20-25', via: 'Cape/Suez', toll: '~' },
  },
]

export default function TransitTimeCalculator({ defaultPorts = [], onSelect }) {
  const portsAvailable = defaultPorts.length > 0
    ? PORTS.filter(p => defaultPorts.some(dp => dp.toLowerCase().includes(p.label.toLowerCase().split(' ')[0])))
    : PORTS
  const [pol, setPol] = useState(portsAvailable[0]?.id || 'damietta')
  const [region, setRegion] = useState('gcc')

  const portObj = useMemo(() => PORTS.find(p => p.id === pol), [pol])
  const regionObj = useMemo(() => REGIONS.find(r => r.id === region), [region])

  const lane = portObj?.source === 'red-sea' ? regionObj?.fromRed : regionObj?.fromMed
  const totalLeadMin = 21 + Number((lane?.days || '0').split('-')[0] || 0)
  const totalLeadMax = 28 + Number((lane?.days || '0').split('-')[1] || lane?.days || 0)

  useEffect(() => {
    onSelect?.({ pol: portObj?.label, region: regionObj?.label, transit: lane?.days })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pol, region])

  return (
    <div className="rounded-3xl ring-1 ring-[#14161a]/10 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white ring-1 ring-[#14161a]/10 text-xl">⏱</span>
          <h3 className="egg-display text-2xl text-[#14161a]">Transit time calculator</h3>
        </div>
        <p className="text-xs text-[#7a8290] mt-1">Pick loading port + destination region — get indicative transit, routing, and total order-to-arrival lead time.</p>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Loading port picker */}
        <div>
          <label className="egg-eyebrow mb-2 block">Loading port (POL)</label>
          <div className="space-y-1.5">
            {portsAvailable.map(p => (
              <button
                key={p.id}
                onClick={() => setPol(p.id)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-semibold transition-all flex items-center gap-2 ${
                  pol === p.id
                    ? 'bg-[#14161a] border-[#14161a] text-white shadow-sm'
                    : 'bg-white border-[#14161a]/12 text-[#3f4650] hover:border-[#0fb5a5]'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
                <span className={`ml-auto text-[10px] font-mono uppercase tracking-[0.12em] ${pol === p.id ? 'text-white/70' : 'text-[#7a8290]'}`}>
                  {p.source === 'red-sea' ? 'Red Sea' : 'Med'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Destination region picker */}
        <div>
          <label className="egg-eyebrow mb-2 block">Destination region</label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="w-full text-sm font-semibold border border-[#14161a]/15 bg-white text-[#14161a] rounded-lg px-3 py-2.5 focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none"
          >
            {REGIONS.map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          {regionObj && (
            <div className="mt-3">
              <div className="egg-eyebrow mb-1.5">Sample destination ports</div>
              <div className="flex flex-wrap gap-1.5">
                {regionObj.sample.map(s => (
                  <span key={s} className="egg-chip text-[11px] font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result panel */}
      {lane && (
        <div className="relative overflow-hidden p-6 border-t border-[#14161a]/10" style={{ background: 'linear-gradient(160deg, #e6fbf8 0%, #eef6fd 100%)' }}>
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-50 pointer-events-none" />
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-5">
            <ResultStat label="Vessel transit" value={`${lane.days} days`} sub={lane.via} />
            <ResultStat label="Order to sail" value="3-4 wk" sub="ex-warehouse" />
            <ResultStat label="Total order→arrival" value={`${Math.floor(totalLeadMin/7)}–${Math.ceil(totalLeadMax/7)} wk`} sub="confirmed at quote" />
            <ResultStat label="Suez canal toll" value={lane.toll} sub={lane.toll === 'YES' ? '+ ~$200-400k bulker' : 'avoided'} />
          </div>
          <div className="relative mt-5 text-xs text-[#3f4650] leading-relaxed">
            <strong className="text-[#14161a]">{portObj?.label}</strong> → <strong className="text-[#14161a]">{regionObj?.label.split(' (')[0]}</strong> via <strong className="text-[#14161a]">{lane.via}</strong> routing.
            {portObj?.source === 'red-sea' && lane.toll === 'NO' &&
              ' Sokhna / Adabiya are typically 1-2 days faster than Mediterranean POLs for any destination east of Suez, and avoid the canal toll.'}
            {portObj?.source === 'mediterranean' && lane.via === 'Gibraltar' &&
              ' Mediterranean POLs (Damietta / Alexandria / Dekheila) are typically 3-5 days faster for Northern Europe and West Africa than Red Sea POLs.'}
          </div>
        </div>
      )}
    </div>
  )
}

function ResultStat({ label, value, sub }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#0b8f84] mb-1">{label}</div>
      <div className="egg-display text-2xl sm:text-3xl text-[#14161a] leading-tight">{value}</div>
      {sub && <div className="text-[10px] text-[#7a8290] mt-0.5">{sub}</div>}
    </div>
  )
}

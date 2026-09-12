/**
 * Spec key/value presentation — shared so the visible spec sheet, the
 * Product JSON-LD and any future surface read the same.
 *
 * The JSON-LD was emitting raw column names and enum values to Google
 * ("Nacl Min" / "So4 Max" / "Grain Label": "extra_coarse") while the visible
 * tables showed "NaCl min" and "Extra coarse".
 */
export const SPEC_LABELS = {
  nacl_min: 'NaCl min', moisture_max: 'Moisture max', moisture: 'Moisture',
  ca_max: 'Ca max', mg_max: 'Mg max', so4_max: 'SO₄ max', sio2: 'SiO₂', sio2_max: 'SiO₂ max',
  al2o3: 'Al₂O₃', fe2o3: 'Fe₂O₃', fe2o3_max: 'Fe₂O₃ max', fe3o4: 'Fe₃O₄', cao: 'CaO', mgo: 'MgO',
  mgo_max: 'MgO max', so3_max: 'SO₃ max', k2o_min: 'K₂O min', p2o5: 'P₂O₅', loi: 'LOI', loi_max: 'LOI max',
  c3a_max: 'C₃A max', cl_max: 'Cl max', chloride_max: 'Chloride max', ph: 'pH', ph_solution: 'pH (solution)',
  insolubles_max: 'Water insolubles max', insoluble_residue: 'Insoluble residue',
  grain_label: 'Grain class', particle_size: 'Particle size', bulk_density: 'Bulk density',
  source_type: 'Source', origin: 'Origin', hs_code: 'HS code', product_code: 'Product code',
  min_order: 'Minimum order', max_order: 'Maximum order', min_order_container: 'Minimum order (container)',
  min_order_vessel: 'Minimum order (vessel)', max_order_vessel: 'Maximum order (vessel)',
  shelf_life_months: 'Shelf life (months)', storage_conditions: 'Storage', cert_required: 'Certificates',
  compressive_28d: '28-day compressive', compressive_2d: '2-day compressive',
  blaine_fineness: 'Blaine fineness', un_code: 'UN code', un_number: 'UN number',
  arsenic_max: 'Arsenic max', ash_max: 'Ash max', sulphur_min: 'Sulphur min', nitrogen_min: 'Nitrogen min',
  biuret_max: 'Biuret max', broken_max: 'Broken max', water_absorption: 'Water absorption',
  commodity_code: 'Commodity code', processing: 'Processing', appearance: 'Appearance', colour: 'Colour',
}

/** Column name → human label. */
export function prettySpecKey(k) {
  return SPEC_LABELS[k] || String(k).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/** Value → human text: arrays joined, snake_case enums sentence-cased. */
export function fmtSpecValue(v) {
  if (v === null || v === undefined) return ''
  if (Array.isArray(v)) return v.join(' · ')
  if (typeof v === 'object') return Object.entries(v).map(([a, b]) => `${a}: ${b}`).join(' · ')
  const s = String(v)
  if (/^[a-z]+(_[a-z0-9]+)+$/.test(s)) return s.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())
  return s
}

/**
 * What makes one SKU different from its siblings: the short spec line used
 * on related-product cards, where every description in a grade opens with
 * the same boilerplate sentence and a 2-line clamp showed only that.
 */
export function skuDifferentiator(page) {
  const s = page?.specs || {}
  const bits = []
  if (s.nacl_min) bits.push(`NaCl ${fmtSpecValue(s.nacl_min)}`)
  if (s.grain_label) bits.push(`${fmtSpecValue(s.grain_label).toLowerCase()} grain`)
  else if (s.particle_size) bits.push(fmtSpecValue(s.particle_size))
  if (s.moisture_max) bits.push(`moisture ${fmtSpecValue(s.moisture_max)}`)
  if (!bits.length && s.grade) bits.push(fmtSpecValue(s.grade))
  if (!bits.length && s.origin) bits.push(fmtSpecValue(s.origin))
  return bits.slice(0, 3).join(' · ')
}

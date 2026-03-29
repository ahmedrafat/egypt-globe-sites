import { websiteConfigs } from '../data/websiteConfigs.js'

// The source data uses '/v/slug' format; we normalize to plain slugs
function normalizeSlug(raw) {
  if (!raw) return ''
  return raw.replace(/^\/v\//, '')
}

export function getSiteBySlug(slug) {
  return websiteConfigs.find((s) => normalizeSlug(s.slug) === slug) || null
}

export function getSiteByDomain(domain) {
  return websiteConfigs.find((s) => s.domain === domain) || null
}

export function getAllSlugs() {
  return websiteConfigs.map((s) => normalizeSlug(s.slug))
}

export function getAllSites() {
  return websiteConfigs.map((s) => ({
    ...s,
    slug: normalizeSlug(s.slug),
  }))
}

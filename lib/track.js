/**
 * trackEvent — first-party funnel events (rfq_start, rfq_submit, …).
 *
 * Batch 2 (audit UX4): the site had no way to see how many buyers start
 * the RFQ form and stop. Events go to the same `web-vitals-ingest`
 * function the vitals beacon uses, as metric `EVENT` with the event name
 * in `page_path`-style field `event`. The function accepts them only
 * once its allow-list is extended (egypt-globe-os, separate deploy), so
 * the client stays silent until NEXT_PUBLIC_EGG_EVENTS=1 is set — no
 * failed beacons in the meantime.
 *
 * Never carries PII: event name, path, session id, timestamp only.
 */
const ENABLED = process.env.NEXT_PUBLIC_EGG_EVENTS === '1'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

function sessionId() {
  try {
    let id = sessionStorage.getItem('egg_sid')
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('egg_sid', id) }
    return id
  } catch { return null }
}

export function trackEvent(name) {
  if (!ENABLED || typeof window === 'undefined' || !SUPABASE_URL) return
  if (/bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent) || navigator.webdriver) return
  const body = JSON.stringify({
    metric: 'EVENT',
    event: String(name).slice(0, 40),
    value: 1,
    page_path: window.location.pathname,
    session_id: sessionId(),
  })
  const url = `${SUPABASE_URL}/functions/v1/web-vitals-ingest`
  try {
    if (navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }))
    else fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
  } catch { /* telemetry must never break the form */ }
}

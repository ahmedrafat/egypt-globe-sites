'use client'

/**
 * WebVitalsReporter — Drop 130 telemetry beacon.
 *
 * Subscribes to next/web-vitals' onCLS / onINP / onLCP / onFCP / onTTFB
 * hooks. Each metric, when finalised by the browser, is POSTed to the
 * `web-vitals-ingest` Edge Function via `navigator.sendBeacon` (which
 * survives page-navigation unloads — critical for LCP / CLS that fire late).
 *
 * Per-tab session_id is generated once + persisted in sessionStorage so
 * we can group multiple metrics from the same visit. No PII, no cookies,
 * no localStorage.
 *
 * Mounted once in app/layout.js; safe to render on every page.
 */
import { useEffect } from 'react'
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

const ENDPOINT = 'https://ohobjnbsybdxntaewqdi.supabase.co/functions/v1/web-vitals-ingest'

function getSessionId() {
  if (typeof window === 'undefined') return null
  try {
    let id = window.sessionStorage.getItem('eggWv:sid')
    if (!id) {
      id = (crypto?.randomUUID?.() || (Date.now() + '-' + Math.random().toString(36).slice(2)))
      window.sessionStorage.setItem('eggWv:sid', id)
    }
    return id
  } catch { return null }
}

function detectDevice() {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent || ''
  if (/iPad|Tablet/i.test(ua)) return 'tablet'
  if (/Mobi|Android/i.test(ua)) return 'mobile'
  return 'desktop'
}

export default function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Dev sessions must never pollute field data: page_path stores only the
    // pathname, so a localhost load of /products/salt is indistinguishable
    // from a production one — and local dev TTFB (2-8 s against the remote
    // DB) skewed the Aug-24 field analysis badly enough to invert it.
    if (/^(localhost|127\.|0\.0\.0\.0|.*\.local)$/.test(window.location.hostname)) return

    // Crawlers must not beacon either. Googlebot renders the page, so it
    // fired the beacon too — and because sendBeacon is a POST that the
    // renderer records as a page resource, Search Console reported it under
    // "page resources couldn't be loaded" (1 of 21). Nothing was broken for
    // users, but it is noise that would mask a real resource failure later,
    // and a crawler render is not a user session worth measuring. Skipping
    // it at the source is better than rejecting it server-side: the request
    // is never made at all.
    const ua = navigator.userAgent || ''
    if (navigator.webdriver ||
        /bot|crawl|spider|slurp|bingpreview|lighthouse|headless|chrome-lighthouse|google-inspectiontool/i.test(ua)) return

    const session_id = getSessionId()
    const device = detectDevice()
    const rfq_visitor = window.location.pathname.startsWith('/rfq')

    function send(metric) {
      const payload = {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        page_path: window.location.pathname,
        navigation_type: metric.navigationType,
        device,
        session_id,
        rfq_visitor,
      }
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
        // sendBeacon is best-effort + survives unload events
        if (navigator.sendBeacon) {
          navigator.sendBeacon(ENDPOINT, blob)
        } else {
          fetch(ENDPOINT, {
            method: 'POST',
            body: blob,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
          }).catch(() => {})
        }
      } catch { /* swallow — beacons must never throw */ }
    }

    onCLS(send)
    onINP(send)
    onLCP(send)
    onFCP(send)
    onTTFB(send)
  }, [])

  return null
}

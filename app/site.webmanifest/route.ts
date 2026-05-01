/**
 * /site.webmanifest — PWA manifest (Drop 125).
 *
 * Required for browsers (especially mobile) to treat the site as a properly
 * installable web app. Used by Add-to-Home-Screen, browser theming, splash
 * screens, etc. Lightweight — no service worker required.
 */
export async function GET() {
  const manifest = {
    name: 'Egypt Globe Group',
    short_name: 'EGG',
    description:
      'Egyptian B2B export trading conglomerate — salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals, metals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1f3a',
    theme_color: '#1d5fa1',
    icons: [
      { src: '/og-image.png',  sizes: '1200x630', type: 'image/png' },
    ],
    categories: ['business', 'shopping', 'finance', 'productivity'],
  }
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}

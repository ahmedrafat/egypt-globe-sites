import { NextResponse } from 'next/server'

// Map domains → brand slugs
const DOMAIN_MAP = {
  'egsalt.com': 'eg-salt',
  'www.egsalt.com': 'eg-salt',
  'ipelot.com': 'ipelot',
  'www.ipelot.com': 'ipelot',
  'egyptbulkers.com': 'egypt-bulkers',
  'www.egyptbulkers.com': 'egypt-bulkers',
  'globefreight.eg': 'globe-freight',
  'www.globefreight.eg': 'globe-freight',
  'nileminerals.com': 'nile-minerals',
  'www.nileminerals.com': 'nile-minerals',
  'deltaagri.eg': 'delta-agri',
  'www.deltaagri.eg': 'delta-agri',
  'redsealogistics.com': 'redsea-logistics',
  'www.redsealogistics.com': 'redsea-logistics',
  'cairotechhub.com': 'cairo-tech-hub',
  'www.cairotechhub.com': 'cairo-tech-hub',
  'globestevedore.eg': 'globe-stevedore',
  'www.globestevedore.eg': 'globe-stevedore',
  'sinaistone.com': 'sinai-stone',
  'www.sinaistone.com': 'sinai-stone',
  'egchemicals.com': 'eg-chemicals',
  'www.egchemicals.com': 'eg-chemicals',
  'alexandriatraders.com': 'alexandria-traders',
  'www.alexandriatraders.com': 'alexandria-traders',
  'egyptglobegroup.com': 'egypt-globe-group',
  'www.egyptglobegroup.com': 'egypt-globe-group',
}

export function proxy(request) {
  const hostname = request.headers.get('host') || ''
  const slug = DOMAIN_MAP[hostname]

  // If known domain, rewrite to /site/[slug]
  if (slug && !request.nextUrl.pathname.startsWith('/site/')) {
    const url = request.nextUrl.clone()
    url.pathname = `/site/${slug}${request.nextUrl.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

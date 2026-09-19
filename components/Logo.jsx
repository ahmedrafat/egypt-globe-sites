/**
 * Egypt Globe Group logo.
 *
 * If `imageUrl` is provided (from site_settings.logo_url), renders the
 * uploaded raster file. Otherwise falls back to an inline SVG
 * recreation of the corporate "EGYPT / GLOBE / GROUP" wordmark + globe
 * icon. Solid blue (#1d5fa1) so it sits well on a white background.
 */
import Image from 'next/image'

/* The uploaded logo (site_settings.logo_url) is a 400×204 PNG on Supabase
   storage served with `cache-control: no-cache` — 52 KB re-fetched from a
   third-party origin on every page and preloaded ahead of the hero banner.
   Routing it through next/image serves a ~70 px AVIF/WebP from our own
   origin with a 1-year cache; the header instance loads eagerly (it is above the fold on every page)
   without a <link preload>, so the hero banner keeps fetch priority. */
const LOGO_W = 400
const LOGO_H = 204

export default function Logo({
  className = 'h-9',
  imageUrl = null,
  monochrome = false,
  ariaLabel = 'Egypt Globe Group',
  priority = false,
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={ariaLabel}
        width={LOGO_W}
        height={LOGO_H}
        sizes="140px"
        loading={priority ? 'eager' : 'lazy'}
        className={className + ' w-auto'}
      />
    )
  }
  const blue = monochrome ? 'currentColor' : '#1d5fa1'
  return (
    <svg
      viewBox="0 0 600 240"
      role="img"
      aria-label={ariaLabel}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={blue}>
        <text x="0" y="100"
          fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Inter, Arial"
          fontWeight="800" fontSize="100" letterSpacing="-2">EGYPT</text>
        <text x="0" y="200"
          fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Inter, Arial"
          fontWeight="800" fontSize="100" letterSpacing="-2">GLOBE</text>
        <text x="290" y="232"
          fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Inter, Arial"
          fontWeight="500" fontSize="32" letterSpacing="6">GROUP</text>
      </g>
      <g transform="translate(440, 30)">
        <circle cx="80" cy="80" r="80" fill={blue} />
        <g fill="none" stroke="white" strokeWidth="3" opacity="0.5">
          <ellipse cx="80" cy="80" rx="80" ry="30" />
          <ellipse cx="80" cy="80" rx="32" ry="80" />
          <line x1="0" y1="80" x2="160" y2="80" />
          <line x1="80" y1="0" x2="80" y2="160" />
        </g>
        <g fill="white">
          <polygon points="42,128 72,86 102,128" />
          <polygon points="84,128 114,98 144,128" />
          <rect x="20" y="125" width="120" height="6" rx="1" />
        </g>
      </g>
    </svg>
  )
}

/**
 * HeroBackdrop — the photo layer behind a dark hero band.
 *
 * Two kinds of art reach a hero, and they need opposite treatment:
 *
 *  - Section banners at /banners/*.jpg (Sep 2026) were commissioned for this
 *    band: navy-graded, one orange accent, and the left 45% of the frame kept
 *    empty for type. They show at 90% under a scrim that follows that layout —
 *    heavy where the headline sits, light over the subject.
 *
 *  - Everything else (the generated /heroes/*.png backgrounds and older
 *    photos) is bright, saturated and composed edge to edge, so it stays a
 *    quiet texture: 38% under an even navy scrim. Unchanged from b54f716.
 *
 * Banners live outside /heroes/ on purpose: scripts/generate-page-heroes.mjs
 * regenerates any page whose hero_photo_url starts with /heroes/ and would
 * overwrite them. Any other URL it treats as a real photograph and skips.
 */
import Image from 'next/image'

export const isBanner = src => typeof src === 'string' && src.startsWith('/banners/')

// Tracks the banners' empty left 45%, but held dense to ~60%: the hero lede
// runs to ~62% of the width at lg, and the first version (.86 at 48% -> .46
// at 72%) measured 3.4-4.0:1 behind its last words on three pages. These stops
// were re-measured pixel-by-pixel against the live art -- keep it >= 4.5:1.
// Sep 27 2026: the art was reading darker than commissioned because the scrim
// still sat at .42 over the subject and .14 at the edge, over a 90% image. The
// left stops are unchanged (the lede ends by ~62%); from there it now clears to
// nothing by 82%, and the image shows at full opacity.
export const BANNER_SCRIM_LG =
  'linear-gradient(90deg, rgba(3,24,45,.94) 0%, rgba(3,24,45,.90) 48%, rgba(3,24,45,.80) 62%, rgba(3,24,45,.28) 70%, rgba(3,24,45,.06) 80%, rgba(3,24,45,0) 88%)'

export default function HeroBackdrop({ src }) {
  if (!src) return null

  if (isBanner(src)) {
    return (
      <div data-hero-bg className="absolute inset-0" aria-hidden="true">
        <Image src={src} alt="" fill priority sizes="100vw"
          className="object-cover object-[72%_50%]" />
        {/* phones and tablets: the headline spans the full width */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-[#03182d]/84 via-[#03182d]/68 to-[#03182d]/90" />
        <div className="absolute inset-0 hidden lg:block" style={{ background: BANNER_SCRIM_LG }} />
      </div>
    )
  }

  return (
    <div data-hero-bg className="absolute inset-0" aria-hidden="true">
      {/* 1200×675 art in a band taller than 16:9 on mobile — object-top keeps
         the top of the frame, where the subject usually sits */}
      <Image src={src} alt="" fill priority sizes="100vw"
        className="object-cover object-top opacity-[0.38]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#03182d]/70 via-[#03182d]/60 to-[#03182d]/85" />
    </div>
  )
}

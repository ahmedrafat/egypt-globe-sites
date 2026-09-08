import Image from 'next/image'

/**
 * CardImage — thumbnail for catalogue / listing cards.
 *
 * Batch 1 (Sep 2026): every card used a bare `<img>` pointing at the
 * 1200×675 hero PNG, so the salt hub shipped 98 full-size files (8 MB) to
 * a phone with no lazy loading. Routing the same source through
 * `next/image` resizes to the rendered width, converts to AVIF/WebP and
 * defers offscreen cards — roughly 80 KB → 10 KB per card.
 *
 * `alt` defaults to "" because every card already carries its title as
 * link text; repeating it in the image doubles the screen-reader
 * announcement. Pass `alt` explicitly where the image is the only content.
 */
export default function CardImage({
  src,
  alt = '',
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  priority = false,
}) {
  if (!src) return null
  return (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={360}
      sizes={sizes}
      priority={priority}
      className={`w-full h-full object-cover object-top ${className}`}
    />
  )
}

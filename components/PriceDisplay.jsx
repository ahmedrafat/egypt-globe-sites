/**
 * PriceDisplay — single source of truth for price visibility.
 *
 * Renders the price string when the buyer is approved AND show_prices=true;
 * otherwise renders a "Sign in to see price" placeholder linking to /login.
 */
import Link from 'next/link'
import Icon from './ui/Icon'

export default function PriceDisplay({ price, visibility, size = 'md', placeholder = null }) {
  if (!price) return null
  if (visibility?.showPrices) {
    const cls = size === 'lg'
      ? 'text-base font-bold text-[#FF6321]'
      : 'text-xs font-semibold text-[#FF6321]'
    return <span className={cls}>{price}</span>
  }

  // Hidden — show a tasteful CTA that swaps in for the price line
  const placeholderText = placeholder || 'Sign in to see price'
  const cls = size === 'lg'
    ? 'inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#1d5fa1] transition-colors'
    : 'inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-[#1d5fa1] transition-colors'
  return (
    <Link href="/login" className={cls}>
      <Icon name="lock" className="w-3.5 h-3.5" /> {placeholderText}
    </Link>
  )
}

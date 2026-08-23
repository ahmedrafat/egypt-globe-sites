import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-white text-[#14161a] flex items-center justify-center px-4 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(255,99,33,.14), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(15,181,165,.14), transparent 60%)' }} />
      <div className="relative text-center">
        <div className="text-7xl mb-6">🌍</div>
        <h1 className="egg-display text-7xl mb-4 text-[#FF6321]">404</h1>
        <h2 className="egg-display text-3xl mb-4 text-[#14161a]">Brand Not Found</h2>
        <p className="text-[#3f4650] mb-8 max-w-md mx-auto">
          The site you&apos;re looking for doesn&apos;t exist in the Egypt Globe Group portfolio.
        </p>
        <Link
          href="/"
          className="egg-btn-primary"
        >
          View All Brands
        </Link>
      </div>
    </div>
  )
}

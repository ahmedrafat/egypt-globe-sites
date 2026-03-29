import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-6">🌍</div>
        <h1 className="text-6xl font-extrabold mb-4 text-[#FF6321]">404</h1>
        <h2 className="text-2xl font-bold mb-4">Brand Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The site you&apos;re looking for doesn&apos;t exist in the Egypt Globe Group portfolio.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#FF6321] text-white font-semibold hover:opacity-90 transition-opacity"
        >
          View All Brands
        </Link>
      </div>
    </div>
  )
}

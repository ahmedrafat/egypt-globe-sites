/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — the corporate-photos bucket holds hero + gallery URLs
      { protocol: 'https', hostname: 'ohobjnbsybdxntaewqdi.supabase.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
export default nextConfig

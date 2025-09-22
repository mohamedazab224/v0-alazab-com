/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  eslint: {
    // يمنع توقف الـ build بسبب مشاكل ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // يمنع توقف الـ build بسبب مشاكل TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    unoptimized: true, // مهم مع Vercel لو مش عايز Image Optimization
  },
};

export default nextConfig;

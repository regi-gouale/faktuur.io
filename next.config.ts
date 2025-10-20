import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output optimized for Docker
  output: 'standalone',

  // Performance optimizations
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['www.geoguessr.com', '37assets.37signals.com'],
  },
  reactStrictMode: false,
};

export default nextConfig;

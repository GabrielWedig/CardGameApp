import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'www.geoguessr.com'],
  },
  reactStrictMode: false,
};

export default nextConfig;

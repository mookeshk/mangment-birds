import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://mangment-birds-api.onrender.com/:path*',
      },
    ];
  },
};

export default nextConfig;

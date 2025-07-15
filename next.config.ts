import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xsgames.co',
        port: '',
        pathname: '/randomusers/**',
      },
      {
        protocol: 'https',
        hostname: 'masswgndvgtpdabpknsx.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/**',
      },
      // Add any other image domains you might be using
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

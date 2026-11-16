import type { NextConfig } from 'next';

const apiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/u, '') || '';
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION?.replace(/^\/+|\/+$/gu, '') || 'api/v1';
const apiBasePath = `/${apiVersion}`;

const apiHost = apiOrigin.split('//')[1]?.replaceAll(`/${apiVersion}`, '') || '';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    if (!apiOrigin) return [];

    return [
      {
        source: `${apiBasePath}/:path*`,
        destination: `${apiOrigin}${apiBasePath}/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: apiHost
      ? [
          {
            protocol: 'https',
            hostname: apiHost,
          },
          {
            protocol: 'http',
            hostname: apiHost,
          },
        ]
      : [],
  },
};

export default nextConfig;

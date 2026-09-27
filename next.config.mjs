/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simona-bt.ru',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'simona-bt.ru',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/optovyj_otdel',
        destination: '/opt',
        permanent: true,
      },
      {
        source: '/optovyj_otdel/',
        destination: '/opt',
        permanent: true,
      },
      {
        source: '/optovyj-otdel',
        destination: '/opt',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

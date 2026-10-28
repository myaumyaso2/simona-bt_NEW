/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  generateBuildId: async () => 'simona-build',
  skipTrailingSlashRedirect: true,
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
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
};

export default nextConfig;

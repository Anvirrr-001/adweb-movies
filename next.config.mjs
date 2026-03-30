/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/@swc/core-linux-x64-gnu/**/*']
    }
  }
};

export default nextConfig;

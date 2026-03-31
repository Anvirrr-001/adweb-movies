/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to allow Server Actions and dynamic dashboard
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js that the main source directory is 'src'
  distDir: '.next',
  experimental: {
    serverActions: true, // Ensure Server Actions are enabled
    // You might need other experimental flags based on features used
  },
};

export default nextConfig;
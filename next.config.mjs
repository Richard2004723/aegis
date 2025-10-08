// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // We keep distDir explicit for Vercel/src folder compatibility
  distDir: '.next', 
  // No need for 'experimental' if only using stable features
};

export default nextConfig;
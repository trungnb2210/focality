/** @type {import('next').NextConfig} */

import withPWA from 'next-pwa';

const nextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
};

const pwaConfig = {
  dest: "public",
  register: true,
  skipWaiting: true,
};

export default withPWA(pwaConfig)(nextConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    turbo: {
      resolveAlias: {
        html2canvas: "html2canvas-pro",
      },
    },
  },
};

module.exports = nextConfig;

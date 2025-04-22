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
  generateBuildId() {
    return process.env.BUILD_ID ?? "local";
  },
};

module.exports = nextConfig;

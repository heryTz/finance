const path = require("path");

// html2canvas does not support "oklch" color
// https://github.com/niklasvh/html2canvas/issues/2700#issuecomment-2799012449

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: path.resolve(__dirname, "node_modules/html2canvas-pro"),
    };
    return config;
  },
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

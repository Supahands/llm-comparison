const path = require("path"); // Using CommonJS syntax

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "api.microlink.io", // Microlink Image Preview
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.resolve.alias["@"] = path.join(__dirname, "app");
    config.resolve.alias["@/components"] = path.join(
      __dirname,
      "app/components"
    );
    return config;
  },
};

module.exports = nextConfig;

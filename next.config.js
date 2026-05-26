const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;

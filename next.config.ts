import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  webpack: (config, { dev }) => {
    config.resolve.alias.canvas = false;
    // Avoid stale CSS chunk hashes when .next is partially cleared or multiple dev servers run.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;

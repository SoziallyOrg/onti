import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standalone output makes Docker images much smaller in production
  output: "standalone",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;

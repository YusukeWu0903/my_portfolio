import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/eris-demo", destination: "/eris-demo/index.html" },
      { source: "/eris-demo/", destination: "/eris-demo/index.html" },
    ];
  },
};

export default nextConfig;

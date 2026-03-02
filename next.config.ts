import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/proxy/geo/data",
        destination: "https://api.travel-tube.com/web/geo/data",
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        // Static page in public/moving/ (gitignored, copied to the build host)
        source: "/moving",
        destination: "/moving/index.html",
      },
      {
        source: "/api/proxy/geo/data",
        destination: "https://api.travel-tube.com/web/geo/data",
      },
    ];
  },
};

export default nextConfig;

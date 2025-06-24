import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ltq6uf91az.ufs.sh",
      },
    ],
  },
};

export default nextConfig;

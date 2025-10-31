import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/varahanarasimha-portfolio',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
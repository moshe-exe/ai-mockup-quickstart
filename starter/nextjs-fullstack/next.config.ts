import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // Required for the Docker image / Container Apps deploy
};

export default nextConfig;

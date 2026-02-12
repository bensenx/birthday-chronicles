import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages deploys to /birthday-chronicles/ subpath
  basePath: isGitHubPages ? '/birthday-chronicles' : '',
  assetPrefix: isGitHubPages ? '/birthday-chronicles/' : '',
  // Optional: Disable image optimization if we use next/image in the future and want purely static
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for clean URLs in some static hosts
  trailingSlash: true,
  // Allow mobile devices on local network to access dev server
  allowedDevOrigins: [
    'http://192.168.4.59:3000',
    'http://192.168.*.*:3000',
  ],
};

export default nextConfig;

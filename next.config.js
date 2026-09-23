/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 48, 96, 144],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: { minChunks: 1 },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
            priority: 20,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three|three-stdlib)[\\/]/,
            name: "three",
            chunks: "all",
            priority: 30,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;

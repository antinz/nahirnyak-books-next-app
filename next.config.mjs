import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],

    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  allowedDevOrigins: ["10.63.200.250"],
};

export default bundleAnalyzer(nextConfig);

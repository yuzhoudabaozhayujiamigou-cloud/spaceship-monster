import type { NextConfig } from "next";

const yuepaoOrigin = "https://yuepao2288.vercel.app";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/yuepao/", destination: `${yuepaoOrigin}/` },
        {
          source: "/yuepao/:path*",
          destination: `${yuepaoOrigin}/:path*`,
        },
        { source: "/admin", destination: `${yuepaoOrigin}/admin` },
        {
          source: "/admin/:path*",
          destination: `${yuepaoOrigin}/admin/:path*`,
        },
        { source: "/api/content", destination: `${yuepaoOrigin}/api/content` },
        {
          source: "/api/facebook-capi",
          destination: `${yuepaoOrigin}/api/facebook-capi`,
        },
        {
          source: "/api/admin/:path*",
          destination: `${yuepaoOrigin}/api/admin/:path*`,
        },
        {
          source: "/videos/:path*",
          destination: `${yuepaoOrigin}/videos/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

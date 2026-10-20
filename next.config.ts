import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // 수강생 앱 (PRD 3-14) — /app 은 묶어 둔 앱의 첫 화면으로
  async rewrites() {
    return [{ source: "/app", destination: "/app/index.html" }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

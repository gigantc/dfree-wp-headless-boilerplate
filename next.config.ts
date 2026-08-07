import type { NextConfig } from "next";
import path from "node:path";

const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const wpHost = (() => {
  try {
    return new URL(wpUrl).hostname;
  } catch {
    return "";
  }
})();

const config: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: wpHost
      ? [{ protocol: "https", hostname: wpHost }]
      : [],
  },
  sassOptions: {
    loadPaths: [path.join(__dirname, "styles"), __dirname],
    includePaths: [path.join(__dirname, "styles"), __dirname],
  },
};

export default config;

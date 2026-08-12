import type { NextConfig } from "next";
import path from "node:path";

const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "";
const wpParsed = (() => {
  try {
    const u = new URL(wpUrl);
    return {
      hostname: u.hostname,
      protocol: u.protocol.replace(":", "") as "http" | "https",
    };
  } catch {
    return null;
  }
})();

const config: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: wpParsed
      ? [{ protocol: wpParsed.protocol, hostname: wpParsed.hostname }]
      : [],
  },
  sassOptions: {
    loadPaths: [path.join(__dirname, "styles"), __dirname],
    includePaths: [path.join(__dirname, "styles"), __dirname],
  },
};

export default config;

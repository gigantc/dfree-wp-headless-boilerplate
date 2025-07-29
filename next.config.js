const { withFaust } = require("@faustwp/core");

//need to grab the wordpress admin url from .env.local
const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};


/**
 * @type {import('next').NextConfig}
 **/
module.exports = withFaust({
  images: {
    domains: [
      getDomain(wordpressUrl),
      "rrpartners.com"
    ],
  },
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    });
    return config;
  },
});

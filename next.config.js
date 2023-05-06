/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => ({
    ...config,
    module: {
      ...config.module,
      rules: config.module.rules.concat([
        {
          test: /\.md/,
          type: "asset/source",
        },
      ]),
    },
  }),
  headers: () => [
    {
      source: "/submissions",
      headers: [{ key: "Cache-Control", value: "no-store" }],
    },
  ],
};

module.exports = nextConfig;

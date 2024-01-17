/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config) => ({
    ...config,
    module: {
      ...config.module,
      rules: config.module.rules.concat([
        {
          test: /\.md/,
          type: 'asset/source',
        },
      ]),
    },
  }),
};

module.exports = nextConfig;

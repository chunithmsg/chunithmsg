const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // webpack: (config) => ({
  //   ...config,
  //   module: {
  //     ...config.module,
  //     rules: config.module.rules.concat([
  //       {
  //         test: /\.md/,
  //         type: 'asset/source',
  //       },
  //     ]),
  //   },
  // }),
};

module.exports = withMDX(nextConfig);

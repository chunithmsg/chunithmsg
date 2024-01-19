const withMDX = require('@next/mdx')();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withMDX(nextConfig);

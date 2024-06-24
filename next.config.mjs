import withBundleAnalyzer from '@next/bundle-analyzer';
import remarkGFM from 'remark-gfm';
import remarkUnwrapImage from 'remark-unwrap-images';
import createMDX from '@next/mdx';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true' || false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
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

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGFM, remarkUnwrapImage],
    rehypePlugins: [],
  },
});

export default bundleAnalyzer(withMDX(nextConfig));

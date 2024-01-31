import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter as FontSans } from 'next/font/google';

import { cn } from '@/libs';

export const metadata: Metadata = {
  title: 'Chunithm Singapore Official Site',
  description: 'Official site for Chunithm Singapore',
  twitter: {
    title: 'Chunithm Singapore Official Site',
    description: 'Official site for Chunithm Singapore',
    card: 'summary_large_image',
    site: '@chunithm_sg',
    creator: '@chunithm_sg',
  },
  openGraph: {
    type: 'website',
    title: 'Chunithm Singapore Official Site',
    siteName: 'Chunithm Singapore Official Site',
    description: 'Official site for Chunithm Singapore',
    url: 'https://chunithm.sg',
  },
  applicationName: 'Chunithm Singapore Official Site',
  metadataBase: new URL('https://chunithm.sg'),
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head />
    <body
      className={cn(
        'min-h-svh bg-background font-sans antialiased',
        fontSans.variable,
      )}
    >
      {children}
    </body>
    <Script id="contribution" strategy="lazyOnload">
      {`console.info("Found a bug? Want to contribute? Visit https://github.com/xantho09/chunithmsg!")`}
    </Script>
  </html>
);

export default RootLayout;

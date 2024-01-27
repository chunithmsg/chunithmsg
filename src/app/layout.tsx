import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter as FontSans } from 'next/font/google';

import NavBar from '@/components/NavBar';
import { creatorGitHubUrls, cn } from '@/libs';

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

export const fontSans = FontSans({
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
      <div className="relative flex min-h-svh flex-col bg-background">
        <NavBar />
        <main className="flex-1 container py-6 lg:py-8 max-w-6xl mx-auto">
          {children}
        </main>
        <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <span className="text-balance text-center text-sm leading-loose text-muted-foreground">
              Built by{' '}
              {Object.entries(creatorGitHubUrls).map(([name, url]) => (
                <>
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {name}
                  </a>
                  &nbsp;
                </>
              ))}
            </span>
          </div>
        </footer>
      </div>
    </body>
    <Script id="contribution" strategy="lazyOnload">
      {`console.info("Found a bug? Want to contribute? Visit https://github.com/xantho09/chunithmsg!")`}
    </Script>
  </html>
);

export default RootLayout;

import Link from 'next/link';

import NavBar from '@/components/NavBar';
import { creatorGitHubUrls } from '@/libs';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
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
              <Link
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {name}
              </Link>
              &nbsp;
            </>
          ))}
        </span>
      </div>
    </footer>
  </div>
);

export default MainLayout;

import Link from 'next/link';

import NavBar from '@/components/NavBar';
import { creatorGitHubUrls } from '@/libs';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col bg-background">
      <NavBar />
      <main className="flex-1 container py-6 lg:py-8 max-w-6xl mx-auto">
        {children}
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:h-24 text-center text-sm leading-loose text-muted-foreground underline">
          {Object.entries(creatorGitHubUrls).map(([name, url]) => (
            <div key={name}>
              <Link
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                legacyBehavior
              >
                {name}
              </Link>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;

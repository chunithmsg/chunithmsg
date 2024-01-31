import AdminNavBar from '@/components/AdminNavBar';

const NoLoginAdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex min-h-svh flex-col bg-background">
    <AdminNavBar />
    <main className="flex-1 container py-6 lg:py-8 max-w-6xl mx-auto">
      {children}
    </main>
  </div>
);

export default NoLoginAdminLayout;

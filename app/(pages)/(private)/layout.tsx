import { cookies } from 'next/headers';

import { ThemeSwitcher } from '@/app/components/common/ThemeSwitcher';
import { AppSidebar } from '@/app/components/layout/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/app/components/ui/sidebar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div className="relative flex flex-1 border">
        <div className="top-4 left-4 absolute flex items-center">
          <SidebarTrigger />
        </div>
        <div className="top-4 right-4 absolute flex items-center">
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col w-full">
          <main className="flex flex-col flex-1 items-center px-6 py-6 w-full">
            <div className="md:ml-80 max-w-2xl">{children}</div>
          </main>
          <footer className="flex md:ml-80 px-6 py-10 border-border border-t min-h-20">
            Footer
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

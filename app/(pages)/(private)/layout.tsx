import { cookies } from 'next/headers';

import { AppHeader } from '@/app/components/layout/AppHeader';
import { AppSidebar } from '@/app/components/layout/AppSidebar';

import { AppFooter } from '@/app/components/layout/AppFooter';
import { SidebarInset, SidebarProvider } from '@/app/components/ui/sidebar';

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <SidebarInset>
          <AppHeader variant="private" />
          <main className="p-6 w-full h-full">
            <div className="flex justify-center h-full">{children}</div>
          </main>
        </SidebarInset>
        <AppFooter />
      </div>
    </SidebarProvider>
  );
}

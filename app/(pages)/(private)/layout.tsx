import { cookies } from 'next/headers';

import { ThemeSwitcher } from '@/app/components/common/ThemeSwitcher';
import { AppSidebar } from '@/app/components/layout/AppSidebar';
import { Separator } from '@/app/components/ui/separator';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';

import { signOutUser } from '@/app/actions/session.actions';
import { Button } from '@/app/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/app/components/ui/sidebar';
import { LogOut } from 'lucide-react';

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
      <div className="flex flex-col w-full">
        <SidebarInset>
          <header className="top-0 sticky flex justify-between items-center gap-2 bg-background p-4 border-b shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 cursor-pointer" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Foo</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Bar</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Button
                size="sm"
                variant="outline"
                onClick={signOutUser}
                className="text-muted-foreground cursor-pointer"
              >
                <LogOut />
              </Button>
            </div>
          </header>
        </SidebarInset>
        <main className="p-6 w-full h-full">
          <div className="flex justify-center">{children}</div>
        </main>
        <footer className="flex justify-between p-6 text-muted-foreground text-xs">
          <p>@ 2025 Thiago Cruz</p>
          <p>Sobre o sistema</p>
        </footer>
      </div>
    </SidebarProvider>
  );
}

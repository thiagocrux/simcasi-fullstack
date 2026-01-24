import { AppHeader } from '@/app/components/layout/AppHeader';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader variant="public" />
      <main className="flex flex-col flex-1 items-center px-2 sm:px-6 py-2 sm:py-16 w-full">
        {children}
      </main>
    </>
  );
}

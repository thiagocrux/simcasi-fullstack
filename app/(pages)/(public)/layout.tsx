import { ThemeSwitcher } from '@/app/components/common/ThemeSwitcher';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="top-4 right-4 absolute flex items-center gap-x-2">
        <ThemeSwitcher />
      </div>
      <main className="flex flex-col flex-1 items-center px-2 sm:px-6 py-2 sm:py-16 w-full">
        {children}
      </main>
    </>
  );
}

import { ThemeSwitcher } from '@/app/components/common/ThemeSwitcher';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 border">
      <>
        <ThemeSwitcher showLabel />
      </>
      <div className="flex flex-col w-full">
        <nav className="md:hidden xl:top-4 xl:right-4 xl:absolute flex xl:flex justify-between items-center gap-x-4 xl:p-0 px-6 py-4 w-full xl:w-auto">
          LOGO
        </nav>
        <main className="flex flex-col flex-1 items-center px-6 py-6 w-full">
          <div className="md:ml-80 max-w-2xl">{children}</div>
        </main>
        <footer className="flex md:ml-80 px-6 py-10 border-border border-t min-h-20">
          Footer
        </footer>
      </div>
    </div>
  );
}

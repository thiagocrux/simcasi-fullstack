import ThemeSwitcher from '@/app/components/common/ThemeSwitcher';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="top-4 right-4 absolute">
        <ThemeSwitcher />
      </div>
      {children}
    </>
  );
}

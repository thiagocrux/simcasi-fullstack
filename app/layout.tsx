import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import './globals.css';
import { Providers } from './providers';

const font = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font',
});

export const metadata: Metadata = {
  title: 'SIMCASI',
  description:
    'Sistema de gerenciamento de casos de sífilis, permitindo gerenciamente de usuários, pacientes, exames, notificações, observações e tratamentos.',
};

import { cookies } from 'next/headers';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getThemeCookie = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('theme')?.value;
  };

  const themeCookie = await getThemeCookie();

  const initialThemeClass =
    themeCookie === 'light' || themeCookie === 'dark' ? themeCookie : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Run before React hydration to prevent mismatch when theme is `system` or unset */}
        {!initialThemeClass ? (
          <Script src="/scripts/theme-init.js" strategy="beforeInteractive" />
        ) : null}
      </head>

      <body
        className={`${font.variable} antialiased flex flex-col min-h-dvh min-w-full`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

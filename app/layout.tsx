import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SIMCASI',
  description:
    'Sistema de gerenciamento de casos de sífilis, permitindo gerenciamente de usuários, pacientes, exames, notificações, observações e tratamentos.',
};

import { cookies } from 'next/headers';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme cookie on the server; if it's `light` or `dark` we can
  // set the class synchronously to avoid hydration mismatch. Use optional
  // chaining because in some runtimes `cookies().get` may not be a function.
  const themeCookie = cookies().get?.('theme')?.value;
  const initialThemeClass =
    themeCookie === 'light' || themeCookie === 'dark' ? themeCookie : undefined;

  const initThemeScript = `(() => {
    try {
      // Prefer cookie, then localStorage, then system preference
      const cookieMatch = document.cookie.match(/(^|;)\s*theme=\s*([^;]+)/);
      const cookieTheme = cookieMatch ? cookieMatch.pop() : null;
      const lsTheme = localStorage.getItem('theme');
      const pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = cookieTheme || lsTheme || 'system';
      const applied = theme === 'system' ? pref : theme;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(applied);
      document.documentElement.style.colorScheme = applied;
    } catch (e) {
      // ignore
    }
  })();`;

  return (
    <html
      lang="en"
      {...(initialThemeClass
        ? {
            className: initialThemeClass,
            style: { colorScheme: initialThemeClass },
          }
        : {})}
    >
      {/* Run before React hydration to prevent mismatch when theme is `system` or unset */}
      {!initialThemeClass ? (
        <Script id="theme-init" strategy="beforeInteractive">
          {initThemeScript}
        </Script>
      ) : null}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

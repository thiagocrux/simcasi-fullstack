'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

function ToasterWithTheme() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-center"
      theme={theme as 'light' | 'dark' | 'system'}
      richColors
    />
  );
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ToasterWithTheme />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

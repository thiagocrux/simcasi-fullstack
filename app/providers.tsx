'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';

import StoreProvider from '@/stores/store.provider';

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

/**
 * Global providers for the application.
 */
export function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient();

  return (
    <StoreProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <ToasterWithTheme />
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

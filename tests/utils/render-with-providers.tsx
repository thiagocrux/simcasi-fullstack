import { makeStore } from '@/stores';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';

/**
 * Helper function to render components with Redux Provider, QueryClientProvider and other required providers.
 * @param component The React component to render
 * @param options Optional render options
 * @returns The render result
 */
export function renderWithProviders(
  component: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const store = makeStore();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return render(component, { wrapper: Wrapper, ...options });
}

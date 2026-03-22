// ============================================================================
// Global Setup & Polyfills
// ============================================================================

// Required for DOM matchers like toBeInTheDocument().
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder for Node.js test environment.
// Next.js cache utilities depend on these globals.
if (typeof global !== 'undefined' && !global.TextEncoder) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Import testing library matchers for DOM-based tests only.
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@testing-library/jest-dom');
} catch (_e) {
  // Silently continue if not supported in this test environment.
}

// ============================================================================
// Next.js Server Functions
// ============================================================================

// Mock next/cache to prevent import errors in test environment.
// These server functions should not be executed during tests.
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn(),
}));

// ============================================================================
// Authentication & Token Handling
// ============================================================================

// Mock jose at the earliest point to prevent ESM parsing errors in Node.js.
// The jose library uses ESM syntax which conflicts with CommonJS test environments.
jest.mock(
  'jose',
  () => ({
    SignJWT: class {
      setProtectedHeader() {
        return this;
      }
      addAudience() {
        return this;
      }
      addSubject() {
        return this;
      }
      addClaim() {
        return this;
      }
      setIssuedAt() {
        return this;
      }
      setExpirationTime() {
        return this;
      }
      sign() {
        return Promise.resolve('mock-token');
      }
    },
    jwtVerify: jest.fn().mockResolvedValue({
      payload: { userId: '550e8400-e29b-41d4-a716-446655440000' },
    }),
    errors: {},
  }),
  { virtual: true }
);

// Mock the security provider to avoid loading real jose in tests.
jest.mock(
  '@/core/infrastructure/providers/token.jose.provider',
  () => ({
    JoseTokenProvider: class {
      async sign() {
        return 'mock-token';
      }
      async verify() {
        return { userId: '550e8400-e29b-41d4-a716-446655440000' };
      }
      getAccessExpirationInSeconds() {
        return 3600;
      }
      getRefreshExpirationInSeconds() {
        return 604800;
      }
    },
  }),
  { virtual: true }
);

// ============================================================================
// Common Hooks & Client Providers
// ============================================================================

// Mock Next.js navigation hook.
// Provides default implementations for useRouter, usePathname, useSearchParams.
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock usePermission hook.
// Default: grants all permissions (returns true for any action).
// Override in individual tests via jest.mocked() as needed.
jest.mock('@/hooks/usePermission', () => ({
  usePermission: jest.fn(() => jest.fn(() => true)),
}));

// Mock useRole hook.
// Default: returns 'user' role.
jest.mock('@/hooks/useRole', () => ({
  useRole: jest.fn(() => 'user'),
}));

// Mock useUser hook.
// Default: returns mock user with standard properties.
jest.mock('@/hooks/useUser', () => ({
  useUser: jest.fn(() => ({
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'John Doe',
    email: 'john@example.com',
  })),
}));

// Mock useTheme from next-themes.
// Default: light theme with mock setTheme function.
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
    systemTheme: 'light',
    themes: ['light', 'dark', 'system'],
  })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock useMobile hook for responsive UI tests.
// Default: returns false (desktop viewport).
jest.mock('@/hooks/useMobile', () => ({
  useIsMobile: jest.fn(() => false),
}));

// ============================================================================
// Browser APIs & Global Mocks
// ============================================================================

// Mock navigator.clipboard for copy-to-clipboard functionality tests.
if (typeof navigator !== 'undefined') {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(() => Promise.resolve()),
    },
  });
}

// Mock localStorage and sessionStorage for storage-dependent tests.
const storageMock = (): Storage => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: storageMock(),
    writable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: storageMock(),
    writable: true,
  });

  // Mock window.matchMedia for theme and responsive media queries.
  // Default: dark mode is NOT preferred (prefers-color-scheme: light).
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock ResizeObserver for floating-ui and radix-ui popover components.
// ResizeObserver is required by Combobox, Datepicker, and similar components.
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// ============================================================================
// Test Lifecycle Hooks
// ============================================================================

// Clear mocks and reset storage between tests.
beforeEach(() => {
  jest.clearAllMocks();

  // Reset storage mocks to avoid test pollution.
  if (typeof window !== 'undefined') {
    (window.localStorage.getItem as jest.Mock).mockClear();
    (window.localStorage.setItem as jest.Mock).mockClear();
    (window.localStorage.removeItem as jest.Mock).mockClear();
    (window.sessionStorage.getItem as jest.Mock).mockClear();
    (window.sessionStorage.setItem as jest.Mock).mockClear();
    (window.sessionStorage.removeItem as jest.Mock).mockClear();
  }
});

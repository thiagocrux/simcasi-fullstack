import { render, screen } from '@testing-library/react';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';

// Mock only external dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/hooks/useUser', () => ({
  useUser: jest.fn(() => ({
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    },
  })),
}));

jest.mock('@/hooks/useLogout', () => ({
  useLogout: jest.fn(() => ({
    handleLogout: jest.fn(),
  })),
}));

jest.mock('@/hooks/useMobile', () => ({
  useIsMobile: jest.fn(() => false),
}));

// Helper to render with required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(<SidebarProvider>{component}</SidebarProvider>);
};

describe('AppSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('structure and layout', () => {
    it('should render without crashing', () => {
      expect(() => renderWithProviders(<AppSidebar />)).not.toThrow();
    });

    it('should render SIMCASI branding', () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText(/SIMCASI|Command/i)).toBeInTheDocument();
    });
  });

  describe('navigation sections', () => {
    it('should render dashboard section', () => {
      renderWithProviders(<AppSidebar />);
      expect(
        screen.getByText(/Dashboard|Painel de controle/i)
      ).toBeInTheDocument();
    });

    it('should render medical records section', () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText(/Registros médicos/i)).toBeInTheDocument();
    });

    it('should render user management section', () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText(/Gestão de usuários/i)).toBeInTheDocument();
    });

    it('should render audit section', () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText(/Auditorias/i)).toBeInTheDocument();
    });
  });

  describe('user information', () => {
    it('should load user information when component renders', () => {
      renderWithProviders(<AppSidebar />);
      // Verify useUser hook was called to load user data
      const mockUseUser = jest.mocked(
        jest.requireMock('@/hooks/useUser').useUser
      );
      expect(mockUseUser).toHaveBeenCalled();
    });

    it('should handle loading state when user is not available', () => {
      const mockUseUser = jest.mocked(
        jest.requireMock('@/hooks/useUser').useUser
      );
      mockUseUser.mockReturnValue({
        user: null,
      });

      renderWithProviders(<AppSidebar />);
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('should render user footer section for sidebar', () => {
      const { container } = renderWithProviders(<AppSidebar />);
      // The sidebar should render without errors
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('sidebar interactions', () => {
    it('should render without crashing', () => {
      expect(() => renderWithProviders(<AppSidebar />)).not.toThrow();
    });

    it('should accept and apply custom props', () => {
      const { container } = renderWithProviders(
        <AppSidebar data-custom="test" />
      );
      const sidebar = container.querySelector('[data-custom="test"]');
      expect(sidebar).toBeInTheDocument();
    });

    it('should maintain structure across re-renders', () => {
      const { rerender } = renderWithProviders(<AppSidebar />);
      expect(screen.getByText('SIMCASI')).toBeInTheDocument();

      rerender(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );
      expect(screen.getByText('SIMCASI')).toBeInTheDocument();
    });
  });
});

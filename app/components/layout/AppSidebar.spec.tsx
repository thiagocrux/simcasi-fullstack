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
    isUserAdmin: true,
    isHydrated: true,
  })),
}));

jest.mock('@/hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({
    can: jest.fn(() => true),
  })),
}));

jest.mock('@/hooks/useLogout', () => ({
  useLogout: jest.fn(() => ({
    handleLogout: jest.fn(),
  })),
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

    it('should render sidebar element', () => {
      const { container } = renderWithProviders(<AppSidebar />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('navigation sections', () => {
    it('should render dashboard section', () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    it('should render medical records items', () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getByText(/Pacientes/i)).toBeInTheDocument();
      expect(screen.getByText(/Exames/i)).toBeInTheDocument();
    });

    it('should render user management section', () => {
      renderWithProviders(<AppSidebar />);
      expect(screen.getAllByText(/Usuários/i).length).toBeGreaterThan(0);
    });

    it('should render audit section', () => {
      renderWithProviders(<AppSidebar />);
      const auditElements = screen.getAllByText(
        /Registros de auditoria|Logs de auditoria|Auditoria/i
      );
      expect(auditElements.length).toBeGreaterThan(0);
    });

    it('should not render audit section when user is not admin', () => {
      const mockUseUser = jest.mocked(
        jest.requireMock('@/hooks/useUser').useUser
      );
      mockUseUser.mockReturnValue({
        user: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
        isUserAdmin: false,
        isHydrated: true,
      });

      renderWithProviders(<AppSidebar />);
      expect(
        screen.queryByText(/Registros de auditoria/i)
      ).not.toBeInTheDocument();
    });

    it('should not render "Criar novo usuário" when user lacks create:user permission', () => {
      const mockUsePermission = jest.mocked(
        jest.requireMock('@/hooks/usePermission').usePermission
      );
      mockUsePermission.mockReturnValue({
        can: jest.fn(() => false),
      });

      renderWithProviders(<AppSidebar />);
      expect(screen.queryByText(/Criar novo usuário/i)).not.toBeInTheDocument();
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
  });

  describe('sidebar interactions', () => {
    it('should accept custom props', () => {
      const { container } = renderWithProviders(
        <AppSidebar data-testid="custom-sidebar" />
      );
      const sidebar = container.querySelector('[data-testid="custom-sidebar"]');
      expect(sidebar).toBeInTheDocument();
    });

    it('should maintain structure across re-renders', () => {
      const { rerender } = renderWithProviders(<AppSidebar />);
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

      rerender(
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      );
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });
});

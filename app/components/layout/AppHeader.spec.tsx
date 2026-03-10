import { fireEvent, render, screen } from '@testing-library/react';
import { SidebarProvider } from '../ui/sidebar';
import { AppHeader } from './AppHeader';

// Mock only external dependencies and browser APIs
jest.mock('@/hooks/useLogout', () => ({
  useLogout: jest.fn(() => ({
    handleLogout: jest.fn(),
  })),
}));

jest.mock('@/hooks/useMobile', () => ({
  useIsMobile: jest.fn(() => false),
}));

jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  })),
}));

jest.mock('../common/ThemeSwitcher', () => ({
  ThemeSwitcher: () => <div data-testid="theme-switcher">Theme Switcher</div>,
}));

// Helper to render component with required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(<SidebarProvider>{component}</SidebarProvider>);
};

describe('AppHeader', () => {
  let mockHandleLogout: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleLogout = jest.fn();
    const mockUseLogout = jest.mocked(
      jest.requireMock('@/hooks/useLogout').useLogout
    );
    mockUseLogout.mockReturnValue({
      handleLogout: mockHandleLogout,
    });
  });

  describe('private variant (default)', () => {
    it('should render fixed header with banner role', () => {
      renderWithProviders(<AppHeader />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('fixed', 'top-0', 'right-0', 'z-40');
    });

    it('should render header with dynamic position based on sidebar state', () => {
      renderWithProviders(<AppHeader />);
      const header = screen.getByRole('banner');
      // Default SidebarProvider has open=true, so should have left-64
      expect(header).toHaveClass('left-64');
    });

    it('should render theme switcher component', () => {
      renderWithProviders(<AppHeader />);
      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    });

    it('should render logout button with correct title', () => {
      renderWithProviders(<AppHeader />);
      const logoutButton = screen.getByTitle('Sair do sistema');
      expect(logoutButton).toBeInTheDocument();
    });

    it('should call handleLogout when logout button is clicked', () => {
      renderWithProviders(<AppHeader />);
      const logoutButton = screen.getByTitle('Sair do sistema');
      fireEvent.click(logoutButton);
      expect(mockHandleLogout).toHaveBeenCalled();
    });

    it('should render sidebar trigger for mobile menu', () => {
      renderWithProviders(<AppHeader />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1);
    });

    it('should have correct styling classes', () => {
      renderWithProviders(<AppHeader />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('flex', 'justify-between', 'items-center');
    });
  });

  describe('public variant', () => {
    it('should not render banner element in public variant', () => {
      render(<AppHeader variant="public" />);
      const publicHeader = screen.queryByRole('banner');
      expect(publicHeader).not.toBeInTheDocument();
    });

    it('should render only theme switcher in public variant', () => {
      render(<AppHeader variant="public" />);
      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    });

    it('should not render logout button in public variant', () => {
      render(<AppHeader variant="public" />);
      const logoutButton = screen.queryByTitle('Sair do sistema');
      expect(logoutButton).not.toBeInTheDocument();
    });

    it('should have absolute positioning in public variant', () => {
      const { container } = render(<AppHeader variant="public" />);
      const div = container.firstChild as HTMLElement;
      expect(div).toHaveClass('absolute', 'top-4', 'right-4', 'z-50');
    });
  });

  describe('variant switching', () => {
    it('should switch between private and public variants', () => {
      const { rerender } = renderWithProviders(<AppHeader variant="private" />);
      expect(screen.getByRole('banner')).toBeInTheDocument();

      rerender(<AppHeader variant="public" />);
      expect(screen.queryByRole('banner')).not.toBeInTheDocument();
      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    });

    it('should maintain theme switcher visibility across variants', () => {
      const { rerender } = renderWithProviders(<AppHeader variant="private" />);
      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();

      rerender(<AppHeader variant="public" />);
      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should handle logout action gracefully', () => {
      renderWithProviders(<AppHeader />);
      const logoutButton = screen.getByTitle('Sair do sistema');
      expect(() => fireEvent.click(logoutButton)).not.toThrow();
    });

    it('should render without errors when component mounts', () => {
      expect(() => renderWithProviders(<AppHeader />)).not.toThrow();
    });
  });
});

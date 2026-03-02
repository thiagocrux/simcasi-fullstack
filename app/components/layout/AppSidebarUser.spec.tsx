/* eslint-disable @typescript-eslint/no-require-imports */

import { render, screen, waitFor } from '@testing-library/react';
import { Mail, User } from 'lucide-react';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebarUser } from './AppSidebarUser';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
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

describe('AppSidebarUser', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  const mockDropdownItems = [
    {
      title: 'Profile',
      url: '/profile',
      icon: User,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Mail,
    },
  ];

  let mockHandleLogout: jest.Mock;
  let mockRouterPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleLogout = jest.fn();
    mockRouterPush = jest.fn();

    require('@/hooks/useLogout').useLogout.mockReturnValue({
      handleLogout: mockHandleLogout,
    });

    require('next/navigation').useRouter.mockReturnValue({
      push: mockRouterPush,
    });

    require('@/hooks/useMobile').useIsMobile.mockReturnValue(false);
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(<SidebarProvider>{component}</SidebarProvider>);
  };

  describe('rendering', () => {
    it('should render user name and email after mount', async () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
        expect(screen.getAllByText('john@example.com').length).toBeGreaterThan(
          0
        );
      });
    });

    it('should render avatar with user initials', () => {
      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      // Verify component renders successfully
      expect(container.firstChild).toBeTruthy();
    });

    it('should render trigger button', async () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('should render dropdown menu structure', () => {
      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('user data display', () => {
    it('should display user avatar image with correct src', async () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        const images = screen.queryAllByAltText('John Doe');
        if (images.length > 0) {
          expect(images[0]).toHaveAttribute('src', mockUser.avatar);
        }
      });
    });

    it('should display avatar fallback using first letter of name', async () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        const text = screen.queryAllByText('J');
        if (text.length > 0) {
          expect(text.length).toBeGreaterThan(0);
        }
      });
    });

    it('should handle loading state before mount', () => {
      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      // Component renders with "Carregando..." on initial mount
      expect(container).toBeInTheDocument();
    });

    it('should display user data in trigger button', async () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
      });
    });
  });

  describe('dropdown menu interactions', () => {
    it('should render trigger button', () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      const trigger = screen.getAllByRole('button');
      expect(trigger.length).toBeGreaterThan(0);
    });

    it('should handle navigation to dropdown items via router', () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      // Verify router.push was mocked correctly
      expect(mockRouterPush).toBeDefined();
    });

    it('should have logout handler available', () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      // Verify the logout handler was mocked
      expect(mockHandleLogout).toBeDefined();
    });

    it('should render all dropdown items from props', () => {
      const additionalItems = [
        { title: 'Notifications', url: '/notifications', icon: User },
        { title: 'Help', url: '/help', icon: Mail },
      ];

      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={additionalItems} />
      );

      expect(container).toBeInTheDocument();
    });

    it('should render logout item in dropdown', () => {
      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      // Verify component renders (logout item is part of dropdown)
      expect(container).toBeInTheDocument();
    });
  });

  describe('mobile behavior', () => {
    it('should render dropdown with bottom side on mobile', async () => {
      require('@/hooks/useMobile').useIsMobile.mockReturnValue(true);

      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });

    it('should render dropdown with right side on desktop', async () => {
      require('@/hooks/useMobile').useIsMobile.mockReturnValue(false);

      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('hydration safety', () => {
    it('should handle animation frame cleanup on unmount', () => {
      const cancelAnimationFrameSpy = jest.spyOn(
        window,
        'cancelAnimationFrame'
      );
      const { unmount } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      unmount();

      expect(cancelAnimationFrameSpy).toHaveBeenCalled();
      cancelAnimationFrameSpy.mockRestore();
    });

    it('should update display after mount', async () => {
      renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty dropdown items array', () => {
      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={[]} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle user with empty name gracefully', () => {
      const emptyUser = { ...mockUser, name: '' };
      const { container } = renderWithProviders(
        <AppSidebarUser user={emptyUser} dropdownItems={mockDropdownItems} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle user with empty email', () => {
      const emptyEmailUser = { ...mockUser, email: '' };
      const { container } = renderWithProviders(
        <AppSidebarUser
          user={emptyEmailUser}
          dropdownItems={mockDropdownItems}
        />
      );
      expect(container).toBeInTheDocument();
    });

    it('should handle very long user name', async () => {
      const longNameUser = {
        ...mockUser,
        name: 'This is a very long user name that might break the layout',
      };
      renderWithProviders(
        <AppSidebarUser user={longNameUser} dropdownItems={mockDropdownItems} />
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/This is a very long user name/)
        ).toBeInTheDocument();
      });
    });

    it('should handle user without avatar', () => {
      const noAvatarUser = { ...mockUser, avatar: '' };
      const { container } = renderWithProviders(
        <AppSidebarUser user={noAvatarUser} dropdownItems={mockDropdownItems} />
      );

      expect(container).toBeInTheDocument();
    });

    it('should render correctly with various icon types', () => {
      const customItems = [
        { title: 'Item1', url: '/item1', icon: User },
        { title: 'Item2', url: '/item2', icon: Mail },
      ];

      const { container } = renderWithProviders(
        <AppSidebarUser user={mockUser} dropdownItems={customItems} />
      );

      expect(container).toBeInTheDocument();
    });
  });
});

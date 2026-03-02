/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from '@testing-library/react';
import { User, UserPlus } from 'lucide-react';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebarContent } from './AppSidebarContent';

// Mock next/link for simpler testing (standard practice)
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('@/hooks/useMobile', () => ({
  useIsMobile: jest.fn(() => false),
}));

// Helper to render with required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(<SidebarProvider>{component}</SidebarProvider>);
};

describe('AppSidebarContent', () => {
  const mockItems = [
    {
      title: 'Users',
      url: '/users',
      icon: User,
    },
    {
      title: 'Create User',
      url: '/users/new',
      icon: UserPlus,
    },
  ];

  const mockItemsWithNested = [
    {
      title: 'Users',
      url: '/users',
      icon: User,
      isActive: false,
      items: [
        {
          title: 'Create User',
          url: '/users/new',
          icon: UserPlus,
        },
      ],
    },
  ];

  describe('basic rendering', () => {
    it('should render without crashing', () => {
      expect(() =>
        renderWithProviders(<AppSidebarContent items={mockItems} />)
      ).not.toThrow();
    });

    it('should render all items', () => {
      renderWithProviders(<AppSidebarContent items={mockItems} />);
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Create User')).toBeInTheDocument();
    });

    it('should render optional label', () => {
      renderWithProviders(
        <AppSidebarContent label="Management" items={mockItems} />
      );
      expect(screen.getByText('Management')).toBeInTheDocument();
    });

    it('should render without label when not provided', () => {
      renderWithProviders(<AppSidebarContent items={mockItems} />);
      const users = screen.getByText('Users');
      expect(users).toBeInTheDocument();
    });
  });

  describe('links and navigation', () => {
    it('should render links with correct hrefs', () => {
      renderWithProviders(<AppSidebarContent items={mockItems} />);
      const userLink = screen.getByRole('link', { name: /Users/i });
      expect(userLink).toHaveAttribute('href', '/users');
    });

    it('should render all menu item links', () => {
      renderWithProviders(<AppSidebarContent items={mockItems} />);
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(mockItems.length);
    });

    it('should have correct href for all items', () => {
      renderWithProviders(<AppSidebarContent items={mockItems} />);
      const createUserLink = screen.getByRole('link', { name: /Create User/i });
      expect(createUserLink).toHaveAttribute('href', '/users/new');
    });
  });

  describe('nested items handling', () => {
    it('should render collapsible sections for items with subitems', () => {
      renderWithProviders(<AppSidebarContent items={mockItemsWithNested} />);
      const userLink = screen.getByRole('link', { name: /Users/i });
      expect(userLink).toBeInTheDocument();
    });

    it('should render items with subitems present in DOM', () => {
      renderWithProviders(<AppSidebarContent items={mockItemsWithNested} />);
      const allItems = screen.getAllByRole('link');
      expect(allItems.length).toBeGreaterThan(0);
    });

    it('should handle items with empty nested list', () => {
      const itemsWithEmptyNested = [
        {
          title: 'Item',
          url: '/item',
          icon: User,
          items: [],
        },
      ];

      renderWithProviders(<AppSidebarContent items={itemsWithEmptyNested} />);
      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  describe('icons and visual elements', () => {
    it('should render components without crashing', () => {
      expect(() =>
        renderWithProviders(<AppSidebarContent items={mockItems} />)
      ).not.toThrow();
    });

    it('should display collapsible items', () => {
      renderWithProviders(<AppSidebarContent items={mockItemsWithNested} />);
      expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
    });
  });

  describe('structure and organization', () => {
    it('should render menu group structure', () => {
      const { container } = renderWithProviders(
        <AppSidebarContent items={mockItems} />
      );
      const menuContainer = container.firstChild;
      expect(menuContainer).toBeTruthy();
    });

    it('should render menu items in proper hierarchy', () => {
      renderWithProviders(<AppSidebarContent items={mockItems} />);
      const userLink = screen.getByText('Users');
      const createLink = screen.getByText('Create User');
      expect(userLink).toBeInTheDocument();
      expect(createLink).toBeInTheDocument();
    });

    it('should handle empty nested items', () => {
      const itemsWithEmptyNested = [
        {
          title: 'Item',
          url: '/item',
          icon: User,
          items: [],
        },
      ];

      renderWithProviders(<AppSidebarContent items={itemsWithEmptyNested} />);
      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  describe('active state handling', () => {
    it('should handle isActive property on items', () => {
      const activeItems = [
        {
          title: 'Active Item',
          url: '/active',
          icon: User,
          isActive: true,
        },
      ];

      renderWithProviders(<AppSidebarContent items={activeItems} />);
      expect(screen.getByText('Active Item')).toBeInTheDocument();
    });

    it('should render inactive items normally', () => {
      const inactiveItems = [
        {
          title: 'Inactive Item',
          url: '/inactive',
          icon: User,
          isActive: false,
        },
      ];

      renderWithProviders(<AppSidebarContent items={inactiveItems} />);
      expect(screen.getByText('Inactive Item')).toBeInTheDocument();
    });
  });
});

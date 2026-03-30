import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { SettingsDetails } from './SettingsDetails';

describe('SettingsDetails', () => {
  let mockPush: jest.Mock;
  let mockUseUser: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    const mockRouter = useRouter as jest.Mock;
    mockRouter.mockReturnValue({ push: mockPush });

    mockUseUser = useUser as jest.Mock;
    mockUseUser.mockReturnValue({
      user: { id: 'user-123', name: 'John Doe', email: 'john@example.com' },
    });
  });

  it('should render card container', () => {
    const { container } = renderWithProviders(<SettingsDetails />);
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
  });

  it('should render "Conta" title', () => {
    renderWithProviders(<SettingsDetails />);
    expect(screen.getByText('Conta')).toBeInTheDocument();
  });

  it('should render separator line', () => {
    const { container } = renderWithProviders(<SettingsDetails />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeInTheDocument();
  });

  it('should render "Alterar senha" button', () => {
    renderWithProviders(<SettingsDetails />);
    const button = screen.getByText('Alterar senha');
    expect(button).toBeInTheDocument();
  });

  it('should render button with outline variant', () => {
    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', { name: /alterar senha/i });
    expect(button).toHaveAttribute('data-variant', 'outline');
  });

  it('should have cursor-pointer class', () => {
    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', { name: /alterar senha/i });
    expect(button).toHaveClass('cursor-pointer');
  });

  it('should navigate to change password page when clicked', () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user-456', name: 'Jane Doe', email: 'jane@example.com' },
    });

    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', { name: /alterar senha/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/users/user-456/change-password');
  });

  it('should use correct user ID in navigation route', () => {
    const userId = 'test-user-id-789';
    mockUseUser.mockReturnValue({
      user: { id: userId, name: 'Test User', email: 'test@example.com' },
    });

    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', { name: /alterar senha/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith(`/users/${userId}/change-password`);
  });

  it('should render with consistent layout', () => {
    const { container } = renderWithProviders(<SettingsDetails />);
    const card = container.querySelector('[class*="gap-8"]');
    expect(card).toBeInTheDocument();
  });

  it('should have proper text styling for title', () => {
    renderWithProviders(<SettingsDetails />);
    const title = screen.getByText('Conta');
    expect(title).toHaveClass('font-bold', 'text-xl');
  });

  it('should render single section', () => {
    const { container } = renderWithProviders(<SettingsDetails />);
    const sections = container.querySelectorAll(
      '[class*="flex"][class*="flex-col"]'
    );
    expect(sections.length).toBeGreaterThan(0);
  });

  it('should render button with full width on mobile', () => {
    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', { name: /alterar senha/i });
    expect(button).toHaveClass('w-full');
  });

  it('should render button with auto width on desktop', () => {
    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', { name: /alterar senha/i });
    expect(button).toHaveClass('sm:w-auto');
  });

  it('should handle different user IDs correctly', () => {
    mockUseUser.mockReturnValue({
      user: { id: 'special-unique-id', name: 'Special User' },
    });

    renderWithProviders(<SettingsDetails />);
    fireEvent.click(screen.getByRole('button', { name: /alterar senha/i }));

    expect(mockPush).toHaveBeenCalledWith(
      '/users/special-unique-id/change-password'
    );
  });

  it('should render with card styling', () => {
    const { container } = renderWithProviders(<SettingsDetails />);
    expect(container.querySelector('[data-slot="card"]')).toHaveClass(
      'rounded-xl',
      'border'
    );
  });

  it('should render "Sessões" section title', () => {
    renderWithProviders(<SettingsDetails />);
    expect(screen.getByText('Sessões')).toBeInTheDocument();
  });

  it('should render "Encerrar sessões" button', () => {
    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', {
      name: /encerrar sessões/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('should render revoke sessions button with destructive variant', () => {
    renderWithProviders(<SettingsDetails />);
    const button = screen.getByRole('button', {
      name: /encerrar sessões/i,
    });
    expect(button).toHaveAttribute('data-variant', 'destructive');
  });
});

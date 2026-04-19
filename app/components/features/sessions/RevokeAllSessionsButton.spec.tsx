import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { screen } from '@testing-library/react';
import { RevokeAllSessionsButton } from './RevokeAllSessionsButton';

jest.mock('@/hooks/useUser');

const TARGET_USER_ID = 'target-user-id';
const LOGGED_USER_ID = 'logged-user-id';

describe('RevokeAllSessionsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({
      user: { id: LOGGED_USER_ID },
      isUserAdmin: true,
      isHealthProfessional: false,
    });
  });

  it('should render component when user is admin.', () => {
    const { container } = renderWithProviders(
      <RevokeAllSessionsButton
        targetUserId={TARGET_USER_ID}
        action={jest.fn()}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should not render when user is a viewer and targetUserId is not own account.', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: LOGGED_USER_ID },
      isUserAdmin: false,
      isHealthProfessional: false,
    });

    const { container } = renderWithProviders(
      <RevokeAllSessionsButton
        targetUserId={TARGET_USER_ID}
        action={jest.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render button with "Revogar todas as sessões" text.', () => {
    renderWithProviders(
      <RevokeAllSessionsButton
        targetUserId={TARGET_USER_ID}
        action={jest.fn()}
      />
    );
    expect(screen.getByText('Revogar todas as sessões')).toBeInTheDocument();
  });

  it('should render when viewer is revoking their own sessions.', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: LOGGED_USER_ID },
      isUserAdmin: false,
      isHealthProfessional: false,
    });

    const { container } = renderWithProviders(
      <RevokeAllSessionsButton
        targetUserId={LOGGED_USER_ID}
        action={jest.fn()}
      />
    );

    expect(container.firstChild).not.toBeNull();
  });

  it('should render button with destructive text color.', () => {
    renderWithProviders(
      <RevokeAllSessionsButton
        targetUserId={TARGET_USER_ID}
        action={jest.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-destructive');
  });
});

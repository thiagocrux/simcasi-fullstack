import { userMock } from '@/tests/mocks/repositories/user.mock';
import { renderWithProviders } from '@/tests/utils';
import { screen } from '@testing-library/react';
import { SessionUserPreview } from './SessionUserPreview';

jest.mock('@/app/components/features/users/UserPreviewDialog', () => ({
  UserPreviewDialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="user-preview-dialog">{children}</div>
  ),
}));

describe('SessionUserPreview', () => {
  it('should render nothing when user is null.', () => {
    const { container } = renderWithProviders(
      <SessionUserPreview user={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render button with provided label.', () => {
    renderWithProviders(
      <SessionUserPreview user={userMock} label="Informações do usuário" />
    );
    expect(screen.getByText('Informações do usuário')).toBeInTheDocument();
  });

  it('should render button with user.name when no label provided.', () => {
    renderWithProviders(<SessionUserPreview user={userMock} />);
    expect(screen.getByText(userMock.name)).toBeInTheDocument();
  });

  it('should render component when user is provided.', () => {
    const { container } = renderWithProviders(
      <SessionUserPreview user={userMock} label="Ver usuário" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render inside UserPreviewDialog.', () => {
    renderWithProviders(
      <SessionUserPreview user={userMock} label="Ver usuário" />
    );
    expect(screen.getByTestId('user-preview-dialog')).toBeInTheDocument();
  });
});

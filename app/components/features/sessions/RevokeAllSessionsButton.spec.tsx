import { usePermission } from '@/hooks/usePermission';
import { renderWithProviders } from '@/tests/utils';
import { screen } from '@testing-library/react';
import { RevokeAllSessionsButton } from './RevokeAllSessionsButton';

jest.mock('@/hooks/usePermission');

describe('RevokeAllSessionsButton', () => {
  let mockCan: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCan = jest.fn(() => true);
    (usePermission as jest.Mock).mockReturnValue({ can: mockCan });
  });

  it('should render component when user has delete:session permission.', () => {
    const { container } = renderWithProviders(
      <RevokeAllSessionsButton action={jest.fn()} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should not render when user lacks delete:session permission.', () => {
    mockCan.mockReturnValue(false);

    const { container } = renderWithProviders(
      <RevokeAllSessionsButton action={jest.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render button with "Revogar todas as sessões" text.', () => {
    renderWithProviders(<RevokeAllSessionsButton action={jest.fn()} />);
    expect(screen.getByText('Revogar todas as sessões')).toBeInTheDocument();
  });

  it('should check delete:session permission.', () => {
    renderWithProviders(<RevokeAllSessionsButton action={jest.fn()} />);
    expect(mockCan).toHaveBeenCalledWith('delete:session');
  });

  it('should render button with destructive text color.', () => {
    renderWithProviders(<RevokeAllSessionsButton action={jest.fn()} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-destructive');
  });
});

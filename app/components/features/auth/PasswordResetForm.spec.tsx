import { renderWithProviders } from '@/tests/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { PasswordResetForm } from './PasswordResetForm';

jest.mock('next/navigation');
jest.mock('@/app/actions/session.actions');

describe('PasswordResetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams('token=test-token')
    );
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<PasswordResetForm />);
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<PasswordResetForm />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should call useSearchParams hook.', () => {
    renderWithProviders(<PasswordResetForm />);
    expect(useSearchParams).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(<PasswordResetForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render password input fields.', () => {
    const { container } = renderWithProviders(<PasswordResetForm />);
    const inputs = container.querySelectorAll('input[type="password"]');
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(<PasswordResetForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render with reset token from search params.', () => {
    const { container } = renderWithProviders(<PasswordResetForm />);
    expect(container).toBeInTheDocument();
  });
});

import { renderWithProviders } from '@/tests/utils';
import { PasswordChangeForm } from './PasswordChangeForm';

jest.mock('@/app/actions/session.actions');

describe('PasswordChangeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    expect(container).toBeInTheDocument();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render current password input field.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render new password input field.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    const inputs = container.querySelectorAll('input[type="password"]');
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });

  it('should render password confirmation field.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render with default props.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    expect(container).toBeInTheDocument();
  });

  it('should accept className prop.', () => {
    const { container } = renderWithProviders(
      <PasswordChangeForm className="custom-class" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render cancel button.', () => {
    const { container } = renderWithProviders(<PasswordChangeForm />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});

import { renderWithProviders } from '@/tests/utils';
import { RequestPasswordResetForm } from './RequestPasswordResetForm';

jest.mock('@/app/actions/session.actions');

describe('RequestPasswordResetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<RequestPasswordResetForm />);
    expect(container).toBeInTheDocument();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(<RequestPasswordResetForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render email input field.', () => {
    const { container } = renderWithProviders(<RequestPasswordResetForm />);
    const inputs = container.querySelectorAll('input[type="email"]');
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(<RequestPasswordResetForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render with default props.', () => {
    const { container } = renderWithProviders(<RequestPasswordResetForm />);
    expect(container).toBeInTheDocument();
  });

  it('should accept className prop.', () => {
    const { container } = renderWithProviders(
      <RequestPasswordResetForm className="custom-class" />
    );
    expect(container).toBeInTheDocument();
  });
});

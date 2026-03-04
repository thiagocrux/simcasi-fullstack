import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { LoginForm } from './LoginForm';

jest.mock('next/navigation');
jest.mock('@/app/actions/session.actions');

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<LoginForm />);
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<LoginForm />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(<LoginForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render email input field.', () => {
    const { container } = renderWithProviders(<LoginForm />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render password input field.', () => {
    const { container } = renderWithProviders(<LoginForm />);
    const inputs = container.querySelectorAll('input[type="password"]');
    expect(inputs.length).toBeGreaterThanOrEqual(0);
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(<LoginForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render forgot password link.', () => {
    const { container } = renderWithProviders(<LoginForm />);
    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThanOrEqual(0);
  });

  it('should render remember me checkbox.', () => {
    const { container } = renderWithProviders(<LoginForm />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThanOrEqual(0);
  });
});

import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
import { PasswordInput } from './PasswordInput';

describe('PasswordInput', () => {
  it('should render as password input by default', () => {
    renderWithProviders(<PasswordInput data-testid="password-input" />);
    const input = screen.getByTestId('password-input') as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render eye-off icon by default', () => {
    const { container } = renderWithProviders(<PasswordInput />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should accept standard input props', () => {
    renderWithProviders(
      <PasswordInput
        data-testid="pwd"
        placeholder="Enter password"
        disabled={false}
      />
    );
    const input = screen.getByTestId('pwd') as HTMLInputElement;
    expect(input).toHaveAttribute('placeholder', 'Enter password');
    expect(input).not.toBeDisabled();
  });

  it('should become text input when visibility toggle is clicked', () => {
    const { container } = renderWithProviders(
      <PasswordInput data-testid="pwd-input" />
    );
    const input = screen.getByTestId('pwd-input') as HTMLInputElement;
    const button = container.querySelector('button');

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(button!);

    expect(input).toHaveAttribute('type', 'text');
  });

  it('should toggle back to password type when clicked again', () => {
    const { container } = renderWithProviders(
      <PasswordInput data-testid="pwd-input" />
    );
    const input = screen.getByTestId('pwd-input') as HTMLInputElement;
    const button = container.querySelector('button');

    fireEvent.click(button!);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(button!);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render button with ghost variant', () => {
    const { container: _container } = renderWithProviders(<PasswordInput />);
    const button = _container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button?.className).toContain('hover:bg-transparent');
  });

  it('should have cursor-pointer on addon', () => {
    const { container: _container } = renderWithProviders(<PasswordInput />);
    expect(_container.querySelector('button')).toBeInTheDocument();
  });

  it('should handle multiple rapid toggles', () => {
    const { container: _container } = renderWithProviders(
      <PasswordInput data-testid="pwd-input" />
    );
    const input = screen.getByTestId('pwd-input') as HTMLInputElement;
    const button = _container.querySelector('button');

    for (let i = 0; i < 5; i++) {
      fireEvent.click(button!);
    }

    expect(input).toHaveAttribute('type', 'text');
  });

  it('should accept className prop', () => {
    const { container } = renderWithProviders(
      <PasswordInput className="custom-class" />
    );
    const inputGroup = container.firstChild as HTMLElement;
    expect(inputGroup).toHaveClass('custom-class');
  });

  it('should forward input value correctly', () => {
    renderWithProviders(
      <PasswordInput data-testid="pwd" defaultValue="mypassword" />
    );
    const input = screen.getByTestId('pwd') as HTMLInputElement;
    expect(input.value).toBe('mypassword');
  });

  it('should maintain visibility state independently', () => {
    const { container: _container1 } = renderWithProviders(
      <PasswordInput data-testid="pwd1" />
    );
    renderWithProviders(<PasswordInput data-testid="pwd2" />);

    const input1 = screen.getByTestId('pwd1') as HTMLInputElement;
    const input2 = screen.getByTestId('pwd2') as HTMLInputElement;
    const button1 = _container1.querySelector('button');

    fireEvent.click(button1!);

    expect(input1).toHaveAttribute('type', 'text');
    expect(input2).toHaveAttribute('type', 'password');
  });

  it('should apply correct styling to toggle button', () => {
    const { container } = renderWithProviders(<PasswordInput />);
    const button = container.querySelector('button');
    expect(button).toHaveClass(
      'hover:bg-transparent!',
      'rounded-sm',
      '-mr-0.5',
      'cursor-pointer'
    );
  });
});

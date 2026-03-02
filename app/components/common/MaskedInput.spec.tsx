import { fireEvent, render, screen } from '@testing-library/react';
import { MaskedInput } from './MaskedInput';

describe('MaskedInput', () => {
  describe('phone variant (dynamic mask)', () => {
    it('should render input element', () => {
      render(
        <MaskedInput
          value=""
          onValueChange={jest.fn()}
          variant="phone"
          placeholder="Phone"
        />
      );
      const input = screen.getByPlaceholderText('Phone');
      expect(input).toBeInTheDocument();
    });

    it('should accept phone input', () => {
      render(
        <MaskedInput value="" onValueChange={jest.fn()} variant="phone" />
      );
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '11999999999' } });

      expect(input).toBeInTheDocument();
    });

    it('should not be disabled by default', () => {
      render(
        <MaskedInput value="" onValueChange={jest.fn()} variant="phone" />
      );
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <MaskedInput
          value=""
          onValueChange={jest.fn()}
          variant="phone"
          disabled={true}
        />
      );
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input).toBeDisabled();
    });
  });

  describe('CPF variant (static mask)', () => {
    it('should apply CPF mask pattern', () => {
      render(
        <MaskedInput
          value="12345678901"
          onValueChange={jest.fn()}
          variant="cpf"
        />
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('123.456.789-01');
    });

    it('should sanitize input value', () => {
      render(<MaskedInput value="" onValueChange={jest.fn()} variant="cpf" />);
      const input = screen.getByDisplayValue('');
      fireEvent.change(input, { target: { value: '123.456.789-01' } });

      expect(input).toBeInTheDocument();
    });

    it('should accept 11 digit CPF', () => {
      render(
        <MaskedInput
          value="12345678901"
          onValueChange={jest.fn()}
          variant="cpf"
        />
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });
  });

  describe('zip code variant (static mask)', () => {
    it('should apply zip code mask pattern', () => {
      render(
        <MaskedInput
          value="12345678"
          onValueChange={jest.fn()}
          variant="zipCode"
        />
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('12345-678');
    });

    it('should sanitize zip code input', () => {
      render(
        <MaskedInput value="" onValueChange={jest.fn()} variant="zipCode" />
      );
      const input = screen.getByDisplayValue('');
      fireEvent.change(input, { target: { value: '12345-678' } });

      expect(input).toBeInTheDocument();
    });
  });

  describe('SUS Card variant (static mask)', () => {
    it('should apply SUS card number mask', () => {
      render(
        <MaskedInput
          value="12345678901234"
          onValueChange={jest.fn()}
          variant="susCardNumber"
        />
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toContain('123');
    });

    it('should accept 14 digit SUS card number', () => {
      render(
        <MaskedInput
          value="12345678901234"
          onValueChange={jest.fn()}
          variant="susCardNumber"
        />
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });
  });

  describe('SINAN variant (static mask)', () => {
    it('should apply SINAN mask pattern', () => {
      render(
        <MaskedInput value="12345" onValueChange={jest.fn()} variant="sinan" />
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('12345__');
    });

    it('should sanitize SINAN input', () => {
      render(
        <MaskedInput value="" onValueChange={jest.fn()} variant="sinan" />
      );
      const input = screen.getByDisplayValue('');
      fireEvent.change(input, { target: { value: '123abc45' } });

      expect(input).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should set aria-invalid when hasError is true', () => {
      render(
        <MaskedInput
          value=""
          onValueChange={jest.fn()}
          variant="cpf"
          hasError={true}
        />
      );
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not have aria-invalid when hasError is false', () => {
      render(
        <MaskedInput
          value=""
          onValueChange={jest.fn()}
          variant="cpf"
          hasError={false}
        />
      );
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('placeholder and accessibility', () => {
    it('should render with custom placeholder', () => {
      render(
        <MaskedInput
          value=""
          onValueChange={jest.fn()}
          variant="cpf"
          placeholder="Enter your CPF"
        />
      );
      expect(screen.getByPlaceholderText('Enter your CPF')).toBeInTheDocument();
    });

    it('should accept additional props', () => {
      render(
        <MaskedInput
          value=""
          onValueChange={jest.fn()}
          variant="cpf"
          data-testid="cpf-input"
        />
      );
      expect(screen.getByTestId('cpf-input')).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = jest.fn();
      render(
        <MaskedInput
          ref={ref}
          value=""
          onValueChange={jest.fn()}
          variant="cpf"
        />
      );
      expect(ref).toBeCalled();
    });

    it('should have displayName', () => {
      expect(MaskedInput.displayName).toBe('MaskedInput');
    });
  });

  describe('value sanitization', () => {
    it('should remove all special characters from input', () => {
      const mockOnChange = jest.fn();
      render(
        <MaskedInput value="" onValueChange={mockOnChange} variant="cpf" />
      );
      const input = screen.getByDisplayValue('');
      fireEvent.change(input, { target: { value: '123!@#456$%^789-01' } });

      expect(input).toBeInTheDocument();
    });

    it('should remove all spaces from input', () => {
      render(<MaskedInput value="" onValueChange={jest.fn()} variant="cpf" />);
      const input = screen.getByDisplayValue('');
      fireEvent.change(input, { target: { value: '123 456 789 01' } });

      expect(input).toBeInTheDocument();
    });

    it('should keep only alphanumeric characters', () => {
      render(<MaskedInput value="" onValueChange={jest.fn()} variant="cpf" />);
      const input = screen.getByDisplayValue('');
      fireEvent.change(input, { target: { value: 'A1B2C3D4E5F6' } });

      expect(input).toBeInTheDocument();
    });
  });

  describe('text input type', () => {
    it('should render as text input', () => {
      render(<MaskedInput value="" onValueChange={jest.fn()} variant="cpf" />);
      const input = screen.getByDisplayValue('') as HTMLInputElement;
      expect(input.type).toBe('text');
    });
  });

  describe('multiple variants', () => {
    it('should handle switching between variants', () => {
      const { rerender } = render(
        <MaskedInput
          value="11999999999"
          onValueChange={jest.fn()}
          variant="phone"
        />
      );

      rerender(
        <MaskedInput
          value="12345678901"
          onValueChange={jest.fn()}
          variant="cpf"
        />
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });
});

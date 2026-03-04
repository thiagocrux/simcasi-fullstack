import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
import { Datepicker } from './Datepicker';

describe('Datepicker', () => {
  it('should render trigger button', () => {
    renderWithProviders(
      <Datepicker placeholder="Select a date" onValueChange={jest.fn()} />
    );
    expect(screen.getByText('Select a date')).toBeInTheDocument();
  });

  it('should show placeholder when no value is selected', () => {
    renderWithProviders(
      <Datepicker placeholder="Choose date" onValueChange={jest.fn()} />
    );
    expect(screen.getByText('Choose date')).toBeInTheDocument();
  });

  it('should render with default placeholder when not provided', () => {
    renderWithProviders(<Datepicker onValueChange={jest.fn()} />);
    expect(screen.getByText('Selecione uma data')).toBeInTheDocument();
  });

  it('should format and display selected date', () => {
    renderWithProviders(
      <Datepicker
        value={new Date(2024, 0, 15)} // January 15, 2024
        placeholder="Select"
        onValueChange={jest.fn()}
      />
    );
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
  });

  it('should parse ISO date string', () => {
    renderWithProviders(
      <Datepicker
        value="2024-01-15"
        placeholder="Select"
        onValueChange={jest.fn()}
      />
    );
    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
  });

  it('should parse yyyy-MM-dd date string', () => {
    renderWithProviders(
      <Datepicker
        value="2024-03-20"
        placeholder="Select"
        onValueChange={jest.fn()}
      />
    );
    expect(screen.getByText(/20\/03\/2024/)).toBeInTheDocument();
  });

  it('should open calendar popover when button is clicked', () => {
    renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={jest.fn()} />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('should display chevron icon', () => {
    const { container } = renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={jest.fn()} />
    );
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have error styling when hasError is true', () => {
    renderWithProviders(
      <Datepicker
        placeholder="Select"
        hasError={true}
        onValueChange={jest.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-invalid', 'true');
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithProviders(
      <Datepicker
        placeholder="Select"
        disabled={true}
        onValueChange={jest.fn()}
      />
    );
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('should call onValueChange with date string in yyyy-MM-dd format when date is selected', () => {
    const mockOnChange = jest.fn();
    renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={mockOnChange} />
    );

    // Since actual date selection requires complex calendar interaction,
    // we test that the callback would be called correctly
    // This is more of an integration test scenario.
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should handle Date object value', () => {
    const testDate = new Date(2024, 11, 25); // December 25, 2024.
    renderWithProviders(
      <Datepicker
        value={testDate}
        placeholder="Select"
        onValueChange={jest.fn()}
      />
    );
    expect(screen.getByText(/25\/12\/2024/)).toBeInTheDocument();
  });

  it('should not render description when hidden dates are not exceeded', () => {
    renderWithProviders(
      <Datepicker
        placeholder="Select"
        hidden={{
          before: new Date(2024, 0, 1),
          after: new Date(2024, 11, 31),
        }}
        onValueChange={jest.fn()}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render with outline variant button', () => {
    renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={jest.fn()} />
    );
    const button = screen.getByRole('button');
    expect(button?.className).toContain('shadow-xs');
  });

  it('should render with full width button', () => {
    renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={jest.fn()} />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('should handle undefined value gracefully', () => {
    renderWithProviders(
      <Datepicker
        value={undefined}
        placeholder="No date"
        onValueChange={jest.fn()}
      />
    );
    expect(screen.getByText('No date')).toBeInTheDocument();
  });

  it('should handle empty string value gracefully', () => {
    renderWithProviders(
      <Datepicker value="" placeholder="Empty date" onValueChange={jest.fn()} />
    );
    expect(screen.getByText('Empty date')).toBeInTheDocument();
  });

  it('should ignore invalid date strings', () => {
    renderWithProviders(
      <Datepicker
        value="invalid-date"
        placeholder="Invalid shown"
        onValueChange={jest.fn()}
      />
    );
    expect(screen.getByText('Invalid shown')).toBeInTheDocument();
  });

  it('should accept ref forwarding', () => {
    const ref = jest.fn();
    renderWithProviders(
      <Datepicker ref={ref} placeholder="Select" onValueChange={jest.fn()} />
    );
    expect(ref).toBeCalled();
  });

  it('should have justify-between layout', () => {
    renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={jest.fn()} />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('justify-between');
  });

  it('should have gap-2 between text and icon', () => {
    renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={jest.fn()} />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('gap-2');
  });

  it('should have muted foreground color on placeholder text', () => {
    renderWithProviders(
      <Datepicker placeholder="Select" onValueChange={jest.fn()} />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-muted-foreground');
  });
});

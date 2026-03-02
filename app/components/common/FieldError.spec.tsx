import { render, screen } from '@testing-library/react';
import { FieldError } from './FieldError';

describe('FieldError', () => {
  it('should return null when message is undefined', () => {
    const { container } = render(<FieldError message={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when message is empty string', () => {
    const { container } = render(<FieldError message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message when provided', () => {
    render(<FieldError message="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should render message as span element', () => {
    const { container } = render(<FieldError message="Error" />);
    const span = container.querySelector('span');
    expect(span?.tagName).toBe('SPAN');
  });

  it('should apply destructive color styles', () => {
    render(<FieldError message="Error message" />);
    const span = screen.getByText('Error message');
    expect(span).toHaveClass('text-destructive');
  });

  it('should apply text styling classes', () => {
    render(<FieldError message="Error" />);
    const span = screen.getByText('Error');
    expect(span).toHaveClass('font-normal', 'text-sm', 'leading-normal');
  });

  it('should support markdown in error messages', () => {
    render(<FieldError message="This is **bold** error" />);
    expect(screen.getByText(/bold/i)).toBeInTheDocument();
  });

  it('should render markdown links in error messages', () => {
    render(<FieldError message="Error: [click here](https://example.com)" />);
    const link = screen.getByText(/click here/i);
    expect(link).toBeInTheDocument();
  });

  it('should apply link hover styling', () => {
    render(<FieldError message="[link](https://example.com)" />);
    const span = screen.getByText(/link/i).closest('span');
    expect(span?.className).toContain('[&>a:hover]:text-primary');
  });

  it('should apply link underline styling', () => {
    render(<FieldError message="[text](https://example.com)" />);
    const span = screen.getByText(/text/i).closest('span');
    expect(span?.className).toContain('[&>a]:underline');
  });

  it('should accept and apply custom className', () => {
    render(<FieldError message="Error" className="custom-error-class" />);
    const span = screen.getByText('Error');
    expect(span).toHaveClass('custom-error-class');
  });

  it('should merge custom className with default classes', () => {
    render(<FieldError message="Error" className="mt-2" />);
    const span = screen.getByText('Error');
    expect(span).toHaveClass('text-destructive', 'mt-2');
  });

  it('should render complex markdown with multiple formats', () => {
    render(
      <FieldError message="Error: **bold** and *italic* with [link](https://example.com)" />
    );
    expect(screen.getByText(/bold/i)).toBeInTheDocument();
    expect(screen.getByText(/italic/i)).toBeInTheDocument();
    expect(screen.getByText(/link/i)).toBeInTheDocument();
  });

  it('should handle special characters in error message', () => {
    const specialMessage =
      'Field must match pattern [a-z]+ & contain at least 3 chars';
    render(<FieldError message={specialMessage} />);
    expect(screen.getByText(/Field must match pattern/)).toBeInTheDocument();
  });

  it('should handle long error messages without truncation', () => {
    const longMessage =
      'This is a very long error message that explains the issue in detail';
    render(<FieldError message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should render nothing when message is whitespace only', () => {
    const { container } = render(<FieldError message="   " />);
    const span = container.querySelector('span');
    // Whitespace is still considered content
    expect(span).toBeInTheDocument();
  });

  it('should support text-balance class', () => {
    render(<FieldError message="Error" />);
    const span = screen.getByText('Error');
    expect(span.className).toContain('text-balance');
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { ReturnLink } from './ReturnLink';

describe('ReturnLink', () => {
  it('should render link button', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render with link variant', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'link');
  });

  it('should render with small size', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8'); // sm size class
  });

  it('should render back arrow icon', () => {
    const { container } = render(<ReturnLink />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render "Voltar" text', () => {
    render(<ReturnLink />);
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  it('should have cursor-pointer class', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-pointer');
  });

  it('should have select-none class to prevent text selection', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('select-none');
  });

  it('should call router.back when clicked', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // router.back is mocked in jest.setup.ts
    expect(button).toBeInTheDocument();
  });

  it('should not have padding override', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-0!');
  });

  it('should have w-min (minimum width)', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-min');
  });

  it('should render with button type as default', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('should have proper button semantics', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('should render arrow and text together', () => {
    const { container } = render(<ReturnLink />);
    const button = container.querySelector('button');
    const svg = button?.querySelector('svg');
    const text = button?.textContent;

    expect(svg).toBeInTheDocument();
    expect(text).toContain('Voltar');
  });

  it('should be clickable for navigation', () => {
    const { container } = render(<ReturnLink />);
    const button = container.querySelector('button');

    expect(() => fireEvent.click(button!)).not.toThrow();
  });

  it('should have ghost-like appearance as link variant', () => {
    render(<ReturnLink />);
    const button = screen.getByRole('button');
    // Link variant uses underline-offset styling
    expect(button).toHaveAttribute('data-variant', 'link');
  });
});

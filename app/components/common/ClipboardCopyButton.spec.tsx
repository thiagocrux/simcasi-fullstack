import { fireEvent, render, screen } from '@testing-library/react';
import { ClipboardCopyButton } from './ClipboardCopyButton';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ClipboardCopyButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (navigator.clipboard.writeText as jest.Mock).mockClear();
  });

  describe('icon variant (default)', () => {
    it('should render button with ghost variant', () => {
      render(<ClipboardCopyButton text="Copy me" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });

    it('should render copy icon', () => {
      const { container } = render(<ClipboardCopyButton text="Copy me" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should not render text label in icon variant', () => {
      render(<ClipboardCopyButton text="Copy me" variant="icon" />);
      const span = screen.queryByText('Copy me');
      expect(span).not.toBeInTheDocument();
    });

    it('should copy text to clipboard when clicked', () => {
      render(<ClipboardCopyButton text="Hello World" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World');
    });

    it('should show toast notification on copy', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { toast } = require('sonner');
      render(<ClipboardCopyButton text="Text" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(toast.success).toHaveBeenCalledWith(
        'Copiado para a área de transferência.'
      );
    });
  });

  describe('label variant', () => {
    it('should render text label', () => {
      render(<ClipboardCopyButton text="My Label" variant="label" />);
      expect(screen.getByText('My Label')).toBeInTheDocument();
    });

    it('should render label with truncation classes', () => {
      const { container } = render(
        <ClipboardCopyButton text="My Label" variant="label" />
      );
      const span = container.querySelector('[class*="truncate"]');
      expect(span).toBeInTheDocument();
    });

    it('should have title attribute for full text on hover', () => {
      const { container } = render(
        <ClipboardCopyButton text="Long text here" variant="label" />
      );
      const span = container.querySelector('span');
      expect(span).toHaveAttribute('title', 'Long text here');
    });

    it('should render copy icon next to label', () => {
      const { container } = render(
        <ClipboardCopyButton text="Label" variant="label" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should copy text when label variant is clicked', () => {
      render(<ClipboardCopyButton text="Label text" variant="label" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Label text');
    });

    it('should truncate long text in label variant', () => {
      const longText = 'This is a very long text that should be truncated';
      const { container } = render(
        <ClipboardCopyButton text={longText} variant="label" />
      );
      const span = container.querySelector('.truncate');
      expect(span).toHaveClass('max-w-40');
    });
  });

  describe('custom className', () => {
    it('should accept and apply custom className', () => {
      const { container } = render(
        <ClipboardCopyButton text="Text" className="custom-class" />
      );
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <ClipboardCopyButton text="Text" className="mx-2" />
      );
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
      expect(button).toHaveClass('mx-2');
    });
  });

  describe('icon styling', () => {
    it('should render icon with muted foreground color', () => {
      const { container } = render(<ClipboardCopyButton text="Text" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-muted-foreground');
    });

    it('should render icon with shrink-0 to prevent squishing', () => {
      const { container } = render(<ClipboardCopyButton text="Text" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('shrink-0');
    });
  });

  describe('multiple clicks', () => {
    it('should copy on each click', () => {
      render(<ClipboardCopyButton text="Copy" />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3);
    });

    it('should show toast for each copy', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { toast } = require('sonner');
      render(<ClipboardCopyButton text="Text" />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);

      expect(toast.success).toHaveBeenCalledTimes(2);
    });
  });

  describe('special characters and formatting', () => {
    it('should copy text with special characters', () => {
      const specialText = 'Email: user@example.com & phone: (123) 456-7890';
      render(<ClipboardCopyButton text={specialText} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(specialText);
    });

    it('should copy text with newlines', () => {
      const textWithNewlines = 'Line 1\nLine 2\nLine 3';
      render(<ClipboardCopyButton text={textWithNewlines} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        textWithNewlines
      );
    });

    it('should copy empty string', () => {
      render(<ClipboardCopyButton text="" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });
  });

  describe('button size and styling', () => {
    it('should render with sm size', () => {
      render(<ClipboardCopyButton text="Text" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-6');
    });

    it('should have cursor-pointer', () => {
      render(<ClipboardCopyButton text="Text" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-pointer');
    });
  });
});

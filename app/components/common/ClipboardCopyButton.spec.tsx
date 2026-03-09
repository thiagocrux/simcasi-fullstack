import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
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

  describe('button variant (default)', () => {
    it('should render button with outline variant by default', () => {
      renderWithProviders(<ClipboardCopyButton value="Copy me" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
    });

    it('should render with copy icon and label', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Copy me" label="Copiar dados" />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(screen.getByText('Copiar dados')).toBeInTheDocument();
    });

    it('should copy text to clipboard when clicked', () => {
      renderWithProviders(<ClipboardCopyButton value="Hello World" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World');
    });

    it('should show toast notification on copy', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { toast } = require('sonner');
      renderWithProviders(<ClipboardCopyButton value="Text" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(toast.success).toHaveBeenCalledWith(
        'Copiado para a área de transferência.'
      );
    });
  });

  describe('icon variant', () => {
    it('should render button with ghost variant', () => {
      renderWithProviders(
        <ClipboardCopyButton value="Copy me" variant="icon" />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });

    it('should render only copy icon', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Copy me" variant="icon" />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(screen.queryByText('Copy me')).not.toBeInTheDocument();
    });

    it('should copy text to clipboard when clicked', () => {
      renderWithProviders(
        <ClipboardCopyButton value="Hello World" variant="icon" />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World');
    });

    it('should show toast notification on copy', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { toast } = require('sonner');
      renderWithProviders(<ClipboardCopyButton value="Text" variant="icon" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(toast.success).toHaveBeenCalledWith(
        'Copiado para a área de transferência.'
      );
    });
  });

  describe('label variant', () => {
    it('should render value as label text', () => {
      renderWithProviders(
        <ClipboardCopyButton value="My Label" variant="label" />
      );
      expect(screen.getByText('My Label')).toBeInTheDocument();
    });

    it('should render label with truncation classes', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="My Label" variant="label" />
      );
      const span = container.querySelector('.truncate');
      expect(span).toBeInTheDocument();
    });

    it('should have title attribute for full text on hover', () => {
      renderWithProviders(
        <ClipboardCopyButton value="Long text here" variant="label" />
      );
      const span = screen.getByText('Long text here');
      expect(span).toHaveAttribute('title', 'Long text here');
    });

    it('should render copy icon next to label', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Label" variant="label" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should copy text when label variant is clicked', () => {
      renderWithProviders(
        <ClipboardCopyButton value="Label text" variant="label" />
      );
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Label text');
    });

    it('should truncate long text in label variant', () => {
      const longText = 'This is a very long text that should be truncated';
      const { container } = renderWithProviders(
        <ClipboardCopyButton value={longText} variant="label" />
      );
      const span = container.querySelector('.truncate');
      expect(span).toHaveClass('max-w-40');
    });

    it('should render label with ghost variant button', () => {
      renderWithProviders(
        <ClipboardCopyButton value="Label" variant="label" />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });
  });

  describe('custom className', () => {
    it('should accept and apply custom className', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton
          value="Text"
          variant="icon"
          className="custom-class"
        />
      );
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should merge custom className with default button classes', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Text" variant="label" className="mx-2" />
      );
      const button = container.querySelector('button');
      expect(button).toHaveClass('mx-2');
      expect(button).toHaveAttribute('data-variant', 'ghost');
    });

    it('should apply custom className to icon variant', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton
          value="Text"
          variant="icon"
          className="custom-icon"
        />
      );
      const button = container.querySelector('button');
      expect(button).toHaveClass('custom-icon');
    });
  });

  describe('icon styling', () => {
    it('should render icon with muted foreground color', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Text" variant="icon" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-muted-foreground');
    });

    it('should render icon with shrink-0 to prevent squishing', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Text" variant="label" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('shrink-0');
    });

    it('should render icon with correct size', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Text" variant="icon" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('size-3.5');
    });
  });

  describe('multiple clicks', () => {
    it('should copy on each click', () => {
      renderWithProviders(<ClipboardCopyButton value="Copy" />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3);
    });

    it('should show toast for each copy', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { toast } = require('sonner');
      renderWithProviders(<ClipboardCopyButton value="Text" />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);

      expect(toast.success).toHaveBeenCalledTimes(2);
    });
  });

  describe('special characters and formatting', () => {
    it('should copy text with special characters', () => {
      const specialText = 'Email: user@example.com & phone: (123) 456-7890';
      renderWithProviders(<ClipboardCopyButton value={specialText} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(specialText);
    });

    it('should copy text with newlines', () => {
      const textWithNewlines = 'Line 1\nLine 2\nLine 3';
      renderWithProviders(<ClipboardCopyButton value={textWithNewlines} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        textWithNewlines
      );
    });

    it('should copy empty string', () => {
      renderWithProviders(<ClipboardCopyButton value="" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });
  });

  describe('button size and styling', () => {
    it('should render with sm size', () => {
      renderWithProviders(<ClipboardCopyButton value="Text" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
    });

    it('should have cursor-pointer', () => {
      renderWithProviders(<ClipboardCopyButton value="Text" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-pointer');
    });

    it('should have select-none to prevent text selection', () => {
      renderWithProviders(<ClipboardCopyButton value="Text" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('select-none');
    });
  });

  describe('variant prop', () => {
    it('should render nothing when unsupported variant is passed', () => {
      const { container } = renderWithProviders(
        <ClipboardCopyButton value="Text" variant="icon" />
      );
      expect(container.querySelector('button')).toBeInTheDocument();
    });

    it('should default to button variant when variant is not specified', () => {
      renderWithProviders(<ClipboardCopyButton value="Text" />);
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });
});

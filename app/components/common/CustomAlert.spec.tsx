import { renderWithProviders } from '@/tests/utils';
import { screen } from '@testing-library/react';
import { CustomAlert } from './CustomAlert';

describe('CustomAlert', () => {
  describe('default variant', () => {
    it('should render alert container', () => {
      const { container } = renderWithProviders(<CustomAlert title="Test" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it('should render with info icon by default', () => {
      const { container } = renderWithProviders(<CustomAlert />);
      // The info icon should be rendered (lucide-react InfoIcon)
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      renderWithProviders(<CustomAlert title="Important Notice" />);
      expect(screen.getByText('Important Notice')).toBeInTheDocument();
    });

    it('should render title with font-semibold class', () => {
      renderWithProviders(<CustomAlert title="Notice" />);
      const title = screen.getByText('Notice');
      expect(title).toHaveClass('font-semibold');
    });

    it('should not render title when not provided', () => {
      const { container } = renderWithProviders(<CustomAlert />);
      const alertTitle = container.querySelector('[role="heading"]');
      expect(alertTitle).not.toBeInTheDocument();
    });
  });

  describe('info variant', () => {
    it('should render with info styling classes', () => {
      const { container } = renderWithProviders(<CustomAlert variant="info" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-sky-100', 'text-sky-600');
    });

    it('should render info icon for info variant', () => {
      const { container } = renderWithProviders(<CustomAlert variant="info" />);
      // Info variant uses InfoIcon - check for svg element directly
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render description with markdown support', () => {
      renderWithProviders(
        <CustomAlert
          variant="info"
          title="Info"
          description="This is **bold** text"
        />
      );
      expect(screen.getByText(/bold/i)).toBeInTheDocument();
    });
  });

  describe('success variant', () => {
    it('should render with success styling classes', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="success" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-green-200', 'text-green-600');
    });

    it('should render with CircleCheck icon', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="success" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('warning variant', () => {
    it('should render with warning styling classes', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="warning" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-amber-100', 'text-amber-600');
    });

    it('should render with AlertTriangle icon', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="warning" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('danger variant', () => {
    it('should render with danger styling classes', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="danger" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-red-200', 'text-red-600');
    });

    it('should render with CircleX icon', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="danger" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render danger description', () => {
      renderWithProviders(
        <CustomAlert
          variant="danger"
          title="Error"
          description="An error occurred"
        />
      );
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });

  describe('description with markdown', () => {
    it('should render markdown links in description', () => {
      renderWithProviders(
        <CustomAlert
          title="Alert"
          description="Click [here](https://example.com)"
        />
      );
      expect(screen.getByText(/here/i)).toBeInTheDocument();
    });

    it('should render markdown bold text', () => {
      renderWithProviders(
        <CustomAlert title="Alert" description="This is **important**" />
      );
      expect(screen.getByText(/important/i)).toBeInTheDocument();
    });

    it('should render markdown italic text', () => {
      renderWithProviders(
        <CustomAlert title="Alert" description="This is *italic*" />
      );
      expect(screen.getByText(/italic/i)).toBeInTheDocument();
    });

    it('should not render description if empty', () => {
      const { container } = renderWithProviders(
        <CustomAlert title="Alert" description="" />
      );

      expect(
        container.querySelectorAll('[data-slot="alert-title"]')
      ).toHaveLength(1);
    });
  });

  describe('children and className', () => {
    it('should render children content', () => {
      renderWithProviders(
        <CustomAlert>
          <p>Custom content</p>
        </CustomAlert>
      );
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('should accept and apply custom className', () => {
      const { container } = renderWithProviders(
        <CustomAlert className="custom-alert-class" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('custom-alert-class');
    });

    it('should merge custom className with variant classes', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="success" className="my-custom-class" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('bg-green-200', 'my-custom-class');
    });
  });

  describe('all properties together', () => {
    it('should render complete alert with all properties', () => {
      renderWithProviders(
        <CustomAlert
          title="Success"
          description="Operation completed **successfully**"
          variant="success"
          className="mt-4"
        >
          <button>Confirm</button>
        </CustomAlert>
      );
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText(/successfully/i)).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });
  });

  describe('dark mode support', () => {
    it('should include dark mode classes for info variant', () => {
      const { container } = renderWithProviders(<CustomAlert variant="info" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('dark:bg-sky-800', 'dark:text-sky-400');
    });

    it('should include dark mode classes for success variant', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="success" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('dark:bg-teal-600', 'dark:text-green-200');
    });

    it('should include dark mode classes for danger variant', () => {
      const { container } = renderWithProviders(
        <CustomAlert variant="danger" />
      );
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toHaveClass('dark:bg-red-800', 'dark:text-red-300');
    });
  });
});

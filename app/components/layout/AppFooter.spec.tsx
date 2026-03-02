/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen, waitFor } from '@testing-library/react';
import { AppFooter } from './AppFooter';

// Mock only external dependencies (system constants)
jest.mock('@/core/domain/constants/system.constants', () => ({
  SYSTEM_CONSTANTS: {
    VERSION: '1.0.0',
    COPYRIGHT: '© 2024 SIMCASI. All rights reserved.',
    DESCRIPTION: 'Sistema de Monitoramento de Casos de Sífilis',
  },
}));

// Mock next/link for simpler testing (standard practice)
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('AppFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('layout and structure', () => {
    it('should render footer element', () => {
      render(<AppFooter />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should have flex layout classes', () => {
      render(<AppFooter />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('flex', 'items-center', 'gap-2', 'p-6');
    });

    it('should have muted foreground text color', () => {
      render(<AppFooter />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('text-muted-foreground');
    });
  });

  describe('hydration handling', () => {
    it('should render dialog after hydration', async () => {
      render(<AppFooter />);

      await waitFor(() => {
        const aboutButton = screen.getByRole('button', {
          name: /Sobre o sistema/i,
        });
        expect(aboutButton).toBeInTheDocument();
      });
    });

    it('should handle animation frame cleanup on unmount', () => {
      const cancelAnimationFrameSpy = jest.spyOn(
        window,
        'cancelAnimationFrame'
      );
      const { unmount } = render(<AppFooter />);

      unmount();

      expect(cancelAnimationFrameSpy).toHaveBeenCalled();
      cancelAnimationFrameSpy.mockRestore();
    });
  });

  describe('dialog and about section', () => {
    it('should render about dialog button', async () => {
      render(<AppFooter />);

      await waitFor(() => {
        const aboutButton = screen.getByRole('button', {
          name: /Sobre o sistema/i,
        });
        expect(aboutButton).toBeInTheDocument();
      });
    });
  });
});

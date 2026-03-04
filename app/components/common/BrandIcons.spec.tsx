import { renderWithProviders } from '@/tests/utils';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';

describe('BrandIcons', () => {
  describe('GitHubIcon', () => {
    it('should render GitHub icon SVG element', () => {
      const { container } = renderWithProviders(<GitHubIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should render with default size of 24', () => {
      const { container } = renderWithProviders(<GitHubIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should render with custom size', () => {
      const { container } = renderWithProviders(<GitHubIcon size={32} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('should render with string size', () => {
      const { container } = renderWithProviders(<GitHubIcon size="2em" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '2em');
      expect(svg).toHaveAttribute('height', '2em');
    });

    it('should use currentColor fill', () => {
      const { container } = renderWithProviders(<GitHubIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('should render path element', () => {
      const { container } = renderWithProviders(<GitHubIcon />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });

    it('should accept additional SVG props', () => {
      const { container } = renderWithProviders(
        <GitHubIcon data-testid="github-icon" className="custom-class" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('data-testid', 'github-icon');
      expect(svg).toHaveClass('custom-class');
    });
  });

  describe('LinkedInIcon', () => {
    it('should render LinkedIn icon SVG element', () => {
      const { container } = renderWithProviders(<LinkedInIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should render with default size of 24', () => {
      const { container } = renderWithProviders(<LinkedInIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('should render with custom size', () => {
      const { container } = renderWithProviders(<LinkedInIcon size={40} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '40');
      expect(svg).toHaveAttribute('height', '40');
    });

    it('should use currentColor fill', () => {
      const { container } = renderWithProviders(<LinkedInIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('should render path element', () => {
      const { container } = renderWithProviders(<LinkedInIcon />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });

    it('should accept additional SVG props', () => {
      const { container } = renderWithProviders(
        <LinkedInIcon data-testid="linkedin-icon" className="icon-lg" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('data-testid', 'linkedin-icon');
      expect(svg).toHaveClass('icon-lg');
    });
  });

  describe('icon comparison', () => {
    it('should render different SVG paths for each icon', () => {
      const { container: githubContainer } = renderWithProviders(
        <GitHubIcon />
      );
      const { container: linkedinContainer } = renderWithProviders(
        <LinkedInIcon />
      );

      const githubPath = githubContainer
        .querySelector('path')
        ?.getAttribute('d');
      const linkedinPath = linkedinContainer
        .querySelector('path')
        ?.getAttribute('d');

      expect(githubPath).not.toEqual(linkedinPath);
    });
  });
});

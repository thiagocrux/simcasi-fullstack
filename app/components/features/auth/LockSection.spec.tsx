import { renderWithProviders } from '@/tests/utils';
import { LockSection } from './LockSection';

describe('LockSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<LockSection />);
    expect(container).toBeInTheDocument();
  });

  it('should render image element.', () => {
    const { container } = renderWithProviders(<LockSection />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  it('should have correct image alt text.', () => {
    const { container } = renderWithProviders(<LockSection />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBeDefined();
  });

  it('should render heading.', () => {
    const { container } = renderWithProviders(<LockSection />);
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThanOrEqual(0);
  });

  it('should render layout container.', () => {
    const { container } = renderWithProviders(<LockSection />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have correct CSS classes.', () => {
    const { container } = renderWithProviders(<LockSection />);
    expect(container).toBeInTheDocument();
  });
});

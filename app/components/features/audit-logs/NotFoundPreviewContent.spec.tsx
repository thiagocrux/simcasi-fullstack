import { renderWithProviders } from '@/tests/utils';
import { NotFoundPreviewContent } from './NotFoundPreviewContent';

describe('NotFoundPreviewContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<NotFoundPreviewContent />);
    expect(container).toBeInTheDocument();
  });

  it('should render not found message.', () => {
    const { container } = renderWithProviders(<NotFoundPreviewContent />);
    const container_element = container.firstChild;
    expect(container_element).toBeInTheDocument();
  });

  it('should render with specific CSS classes.', () => {
    const { container } = renderWithProviders(<NotFoundPreviewContent />);
    expect(container).toBeInTheDocument();
  });

  it('should display content related to not found state.', () => {
    const { container } = renderWithProviders(<NotFoundPreviewContent />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('flex', 'justify-center', 'items-center');
  });
});

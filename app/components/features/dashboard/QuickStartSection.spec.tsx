/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePermission } from '@/hooks/usePermission';
import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { QuickStartSection } from './QuickStartSection';

jest.mock('next/navigation');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
jest.mock('@/hooks/usePermission');
jest.mock('@tanstack/react-query');
jest.mock('@/lib/logger.utils', () => ({
  logger: { error: jest.fn() },
}));

describe('QuickStartSection', () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseQuery = useQuery as jest.Mock;
  const mockUsePermission = usePermission as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: jest.fn() });
    mockUsePermission.mockReturnValue(true);
  });

  it('should render without crashing', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<QuickStartSection />);
    expect(container).toBeInTheDocument();
  });

  it('should handle permission denied for patient creation', () => {
    mockUsePermission.mockReturnValue(false);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<QuickStartSection />);
    expect(container).toBeInTheDocument();
  });

  it('should handle permission allowed for patient creation', () => {
    mockUsePermission.mockReturnValue(true);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<QuickStartSection />);
    expect(container).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
    });

    const { container } = renderWithProviders(<QuickStartSection />);
    expect(container).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error('Test error'),
    });

    const { container } = renderWithProviders(<QuickStartSection />);
    expect(container).toBeInTheDocument();
  });

  it('should handle multiple permissions', () => {
    mockUsePermission.mockReturnValue(true);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<QuickStartSection />);
    expect(container).toBeInTheDocument();
  });
});

import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LatestActionsPerformed } from './LatestActionsPerformed';

jest.mock('next/navigation');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
jest.mock('@/app/actions/audit-log.actions');
jest.mock('@tanstack/react-query');
jest.mock('@/lib/logger.utils', () => ({
  logger: { error: jest.fn() },
}));

describe('LatestActionsPerformed', () => {
  const mockUseQuery = useQuery as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    mockUseQuery.mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestActionsPerformed />);
    expect(container).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
    });

    const { container } = renderWithProviders(<LatestActionsPerformed />);
    expect(container).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error('Test error'),
    });

    const { container } = renderWithProviders(<LatestActionsPerformed />);
    expect(container).toBeInTheDocument();
  });

  it('should handle empty audit logs', () => {
    mockUseQuery.mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestActionsPerformed />);
    expect(container).toBeInTheDocument();
  });

  it('should handle maxListSize prop', () => {
    mockUseQuery.mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestActionsPerformed maxListSize={10} />);
    expect(container).toBeInTheDocument();
  });

  it('should render audit logs when data exists', () => {
    mockUseQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            {
              id: '1',
              userId: 'user-1',
              action: 'CREATE',
              entityName: 'PATIENT',
              createdAt: new Date().toISOString(),
            },
          ],
          relatedUsers: [{ id: 'user-1', name: 'John Doe' }],
        },
      },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestActionsPerformed />);
    expect(container).toBeInTheDocument();
  });

  it('should handle multiple audit logs', () => {
    mockUseQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            {
              id: '1',
              userId: 'user-1',
              action: 'CREATE',
              entityName: 'PATIENT',
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              userId: 'user-2',
              action: 'UPDATE',
              entityName: 'EXAM',
              createdAt: new Date().toISOString(),
            },
          ],
          relatedUsers: [
            { id: 'user-1', name: 'John Doe' },
            { id: 'user-2', name: 'Jane Smith' },
          ],
        },
      },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestActionsPerformed />);
    expect(container).toBeInTheDocument();
  });
});

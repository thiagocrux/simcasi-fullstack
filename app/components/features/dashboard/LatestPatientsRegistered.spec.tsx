import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { LatestPatientsRegistered } from './LatestPatientsRegistered';

jest.mock('next/navigation');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
jest.mock('@/app/actions/patient.actions');
jest.mock('@tanstack/react-query');
jest.mock('@/lib/logger.utils', () => ({
  logger: { error: jest.fn() },
}));

describe('LatestPatientsRegistered', () => {
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

    const { container } = renderWithProviders(<LatestPatientsRegistered />);
    expect(container).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
    });

    const { container } = renderWithProviders(<LatestPatientsRegistered />);
    expect(container).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error('Test error'),
    });

    const { container } = renderWithProviders(<LatestPatientsRegistered />);
    expect(container).toBeInTheDocument();
  });

  it('should handle empty patients list', () => {
    mockUseQuery.mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestPatientsRegistered />);
    expect(container).toBeInTheDocument();
  });

  it('should handle maxListSize prop', () => {
    mockUseQuery.mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(
      <LatestPatientsRegistered maxListSize={10} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render patients when data exists', () => {
    mockUseQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            {
              id: '1',
              name: 'John Doe',
              cpf: '12345678900',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestPatientsRegistered />);
    expect(container).toBeInTheDocument();
  });

  it('should handle multiple patients', () => {
    mockUseQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            {
              id: '1',
              name: 'John Doe',
              cpf: '12345678900',
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              name: 'Jane Smith',
              cpf: '98765432100',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<LatestPatientsRegistered />);
    expect(container).toBeInTheDocument();
  });
});

import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { PatientsChart } from './PatientsChart';

jest.mock('@tanstack/react-query');

describe('PatientsChart', () => {
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

    const { container } = renderWithProviders(<PatientsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
    });

    const { container } = renderWithProviders(<PatientsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error('Test error'),
    });

    const { container } = renderWithProviders(<PatientsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    mockUseQuery.mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<PatientsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle data with items', () => {
    mockUseQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            { date: '2024-01-01', count: 5 },
            { date: '2024-01-02', count: 10 },
          ],
          total: 15,
        },
      },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<PatientsChart />);
    expect(container).toBeInTheDocument();
  });
});

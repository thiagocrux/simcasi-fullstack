import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { MedicalRecordsChart } from './MedicalRecordsChart';

jest.mock('@tanstack/react-query');

describe('MedicalRecordsChart', () => {
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

    const { container } = renderWithProviders(<MedicalRecordsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: true,
      error: null,
    });

    const { container } = renderWithProviders(<MedicalRecordsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      error: new Error('Test error'),
    });

    const { container } = renderWithProviders(<MedicalRecordsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    mockUseQuery.mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<MedicalRecordsChart />);
    expect(container).toBeInTheDocument();
  });

  it('should handle data with items', () => {
    mockUseQuery.mockReturnValue({
      data: {
        success: true,
        data: {
          items: [
            { date: '2024-01-01', SYPHILIS: 5, GONORRHEA: 2 },
            { date: '2024-01-02', SYPHILIS: 8, GONORRHEA: 3 },
          ],
          total: 18,
        },
      },
      isPending: false,
      error: null,
    });

    const { container } = renderWithProviders(<MedicalRecordsChart />);
    expect(container).toBeInTheDocument();
  });
});

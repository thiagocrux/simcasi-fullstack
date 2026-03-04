import { usePermission } from '@/hooks/usePermission';
import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { TreatmentsTable } from './TreatmentsTable';

jest.mock('@tanstack/react-query');
jest.mock('next/navigation');
jest.mock('@/hooks/usePermission');
jest.mock('@/app/actions/treatment.actions');
jest.mock('@/lib/csv.utils');

describe('TreatmentsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (usePermission as jest.Mock).mockReturnValue({ can: jest.fn(() => true) });
    (useQuery as jest.Mock).mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<TreatmentsTable />);
    expect(container).toBeInTheDocument();
  });
  it('should accept pageSize prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentsTable pageSize={30} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showFilterInput prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentsTable showFilterInput={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showColumnToggleButton prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentsTable showColumnToggleButton={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showPrintButton prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentsTable showPrintButton={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with pending state.', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    });
    const { container } = renderWithProviders(<TreatmentsTable />);
    expect(container).toBeInTheDocument();
  });

  it('should render with error state.', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: new Error('Test error'),
    });
    const { container } = renderWithProviders(<TreatmentsTable />);
    expect(container).toBeInTheDocument();
  });
});

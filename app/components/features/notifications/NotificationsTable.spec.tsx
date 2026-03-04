import { usePermission } from '@/hooks/usePermission';
import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { NotificationsTable } from './NotificationsTable';

jest.mock('@tanstack/react-query');
jest.mock('next/navigation');
jest.mock('@/hooks/usePermission');
jest.mock('@/app/actions/notification.actions');
jest.mock('@/lib/csv.utils');

describe('NotificationsTable', () => {
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
    const { container } = renderWithProviders(<NotificationsTable />);
    expect(container).toBeInTheDocument();
  });
  it('should accept pageSize prop.', () => {
    const { container } = renderWithProviders(
      <NotificationsTable pageSize={15} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showFilterInput prop.', () => {
    const { container } = renderWithProviders(
      <NotificationsTable showFilterInput={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showColumnToggleButton prop.', () => {
    const { container } = renderWithProviders(
      <NotificationsTable showColumnToggleButton={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showPrintButton prop.', () => {
    const { container } = renderWithProviders(
      <NotificationsTable showPrintButton={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with pending state.', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    });
    const { container } = renderWithProviders(<NotificationsTable />);
    expect(container).toBeInTheDocument();
  });

  it('should render with error state.', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: new Error('Test error'),
    });
    const { container } = renderWithProviders(<NotificationsTable />);
    expect(container).toBeInTheDocument();
  });
});

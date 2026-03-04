import { usePermission } from '@/hooks/usePermission';
import { useRole } from '@/hooks/useRole';
import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { UsersTable } from './UsersTable';

jest.mock('@tanstack/react-query');
jest.mock('next/navigation');
jest.mock('@/hooks/usePermission');
jest.mock('@/hooks/useRole');
jest.mock('@/hooks/useUser');
jest.mock('@/app/actions/user.actions');
jest.mock('@/lib/csv.utils');

describe('UsersTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (usePermission as jest.Mock).mockReturnValue({ can: jest.fn(() => true) });
    (useRole as jest.Mock).mockReturnValue({ roles: [] });
    (useUser as jest.Mock).mockReturnValue({ user: { id: 'user-1' } });
    (useQuery as jest.Mock).mockReturnValue({
      data: { success: true, data: { items: [], total: 0 } },
      isPending: false,
      error: null,
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<UsersTable />);
    expect(container).toBeInTheDocument();
  });
  it('should accept pageSize prop.', () => {
    const { container } = renderWithProviders(<UsersTable pageSize={20} />);
    expect(container).toBeInTheDocument();
  });

  it('should accept showFilterInput prop.', () => {
    const { container } = renderWithProviders(
      <UsersTable showFilterInput={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showColumnToggleButton prop.', () => {
    const { container } = renderWithProviders(
      <UsersTable showColumnToggleButton={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showPrintButton prop.', () => {
    const { container } = renderWithProviders(
      <UsersTable showPrintButton={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept showIdColumn prop.', () => {
    const { container } = renderWithProviders(
      <UsersTable showIdColumn={false} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with pending state.', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    });
    const { container } = renderWithProviders(<UsersTable />);
    expect(container).toBeInTheDocument();
  });
});

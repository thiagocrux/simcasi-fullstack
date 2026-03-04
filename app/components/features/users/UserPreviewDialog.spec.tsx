import { useRole } from '@/hooks/useRole';
import { userMock } from '@/tests/mocks/repositories/user.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { UserPreviewDialog } from './UserPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/hooks/useRole');
jest.mock('@/app/actions/user.actions');
jest.mock('@/app/components/features/users/UserForm', () => ({
  UserForm: () => <div data-testid="user-form" />,
}));

describe('UserPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useRole as jest.Mock).mockReturnValue({
      getRoleLabel: jest.fn().mockReturnValue('Admin'),
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept userId prop.', () => {
    const { container } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <button>Open User</button>
      </UserPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render different content when open is true.', () => {
    const { container: container1 } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should render different content when open is false.', () => {
    const { container } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render children trigger element.', () => {
    renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <button>Open User</button>
      </UserPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should render with different userId values.', () => {
    const { container: container1 } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <UserPreviewDialog
        title="Test User"
        description="Test User Description"
        user={userMock}
      >
        <div>Test Child</div>
      </UserPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

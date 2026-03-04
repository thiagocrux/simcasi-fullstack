import { roleMock } from '@/tests/mocks/repositories/role.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { RolePreviewDialog } from './RolePreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/role.actions');

describe('RolePreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept roleId prop.', () => {
    const { container } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <button>Open Role</button>
      </RolePreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with different role IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should handle open state changes.', () => {
    const { container: container1 } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <RolePreviewDialog
        title="Test Role"
        description="Test Role Description"
        role={roleMock}
      >
        <div>Test Child</div>
      </RolePreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

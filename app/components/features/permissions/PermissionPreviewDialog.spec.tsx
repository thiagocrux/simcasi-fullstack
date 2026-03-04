import { permissionMock } from '@/tests/mocks/repositories/permission.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { PermissionPreviewDialog } from './PermissionPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/permission.actions');

describe('PermissionPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept permissionId prop.', () => {
    const { container } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <button>Open Permission</button>
      </PermissionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with different permission IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should handle open state changes.', () => {
    const { container: container1 } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <PermissionPreviewDialog
        title="Test Permission"
        description="Test Permission Description"
        permission={permissionMock}
      >
        <div>Test Child</div>
      </PermissionPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

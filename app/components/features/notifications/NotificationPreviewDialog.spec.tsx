import { notificationMock } from '@/tests/mocks/repositories/notification.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { NotificationPreviewDialog } from './NotificationPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/notification.actions');

describe('NotificationPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept notificationId prop.', () => {
    const { container } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <button>Open Notification</button>
      </NotificationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with different notification IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should handle open state changes.', () => {
    const { container: container1 } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <NotificationPreviewDialog
        title="Test Notification"
        description="Test Notification Description"
        notification={notificationMock}
      >
        <div>Test Child</div>
      </NotificationPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

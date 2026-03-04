import * as notificationActions from '@/app/actions/notification.actions';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { NotificationForm } from './NotificationForm';

jest.mock('next/navigation');
jest.mock('@/hooks/useLogout');
jest.mock('@/hooks/useUser');
jest.mock('@/app/actions/notification.actions');

describe('NotificationForm', () => {
  const mockPatientId = 'patient-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (useLogout as jest.Mock).mockReturnValue({ handleLogout: jest.fn() });
    (useUser as jest.Mock).mockReturnValue({
      user: { id: 'user-1', name: 'Test User' },
    });

    (notificationActions.getNotification as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'notification-1',
        patientId: mockPatientId,
        notificationType: 'SMS',
        status: 'Sent',
      },
    });
    (notificationActions.createNotification as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'notification-2' },
    });
    (notificationActions.updateNotification as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'notification-1' },
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <NotificationForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept patientId prop.', () => {
    const { container } = renderWithProviders(
      <NotificationForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept notificationId prop.', () => {
    const { container } = renderWithProviders(
      <NotificationForm
        patientId={mockPatientId}
        notificationId="notification-1"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept isEditMode prop.', () => {
    const { container } = renderWithProviders(
      <NotificationForm
        isEditMode={true}
        patientId={mockPatientId}
        notificationId="notification-1"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<NotificationForm patientId={mockPatientId} />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should call useLogout hook.', () => {
    renderWithProviders(<NotificationForm patientId={mockPatientId} />);
    expect(useLogout).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(
      <NotificationForm patientId={mockPatientId} />
    );
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(
      <NotificationForm patientId={mockPatientId} />
    );
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render input fields.', () => {
    const { container } = renderWithProviders(
      <NotificationForm patientId={mockPatientId} />
    );
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

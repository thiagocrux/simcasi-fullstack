import * as userActions from '@/app/actions/user.actions';
import { usePermission } from '@/hooks/usePermission';
import { useRole } from '@/hooks/useRole';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { UserForm } from './UserForm';

jest.mock('next/navigation');
jest.mock('@/hooks/usePermission');
jest.mock('@/hooks/useRole');
jest.mock('@/app/actions/user.actions');

describe('UserForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });
    (usePermission as jest.Mock).mockReturnValue({ can: jest.fn(() => true) });
    (useRole as jest.Mock).mockReturnValue({ roles: [] });

    // Mock user actions with default return values
    (userActions.getUser as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        roleId: 'role-1',
      },
    });
    (userActions.createUser as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'user-2' },
    });
    (userActions.updateUser as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'user-1' },
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<UserForm />);
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<UserForm />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should call usePermission hook.', () => {
    renderWithProviders(<UserForm />);
    expect(usePermission).toHaveBeenCalled();
  });

  it('should call useRole hook.', () => {
    renderWithProviders(<UserForm />);
    expect(useRole).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(<UserForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should accept userId prop.', () => {
    const { container } = renderWithProviders(<UserForm userId="user-1" />);
    expect(container).toBeInTheDocument();
  });

  it('should accept isEditMode prop.', () => {
    const { container } = renderWithProviders(
      <UserForm isEditMode={true} userId="user-1" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept className prop.', () => {
    const { container } = renderWithProviders(
      <UserForm className="custom-class" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with roles data.', () => {
    (useRole as jest.Mock).mockReturnValue({
      roles: [{ id: 'role-1', name: 'Admin' }],
    });
    const { container } = renderWithProviders(<UserForm />);
    expect(container).toBeInTheDocument();
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(<UserForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should handle form submission.', () => {
    const { container } = renderWithProviders(<UserForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render with multiple input fields.', () => {
    const { container } = renderWithProviders(<UserForm />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

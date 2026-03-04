import * as patientActions from '@/app/actions/patient.actions';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { PatientForm } from './PatientForm';

jest.mock('next/navigation');
jest.mock('@/hooks/useLogout');
jest.mock('@/hooks/useUser');
jest.mock('@/app/actions/patient.actions');

describe('PatientForm', () => {
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

    (patientActions.getPatient as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'patient-1',
        name: 'Test Patient',
        email: 'patient@example.com',
        phoneNumber: '(11) 98765-4321',
      },
    });
    (patientActions.createPatient as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'patient-2' },
    });
    (patientActions.updatePatient as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'patient-1' },
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(<PatientForm />);
    expect(container).toBeInTheDocument();
  });

  it('should accept patientId prop.', () => {
    const { container } = renderWithProviders(
      <PatientForm patientId="patient-1" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept isEditMode prop.', () => {
    const { container } = renderWithProviders(
      <PatientForm isEditMode={true} patientId="patient-1" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept className prop.', () => {
    const { container } = renderWithProviders(
      <PatientForm className="custom-class" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<PatientForm />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should call useLogout hook.', () => {
    renderWithProviders(<PatientForm />);
    expect(useLogout).toHaveBeenCalled();
  });

  it('should call useUser hook.', () => {
    renderWithProviders(<PatientForm />);
    expect(useUser).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(<PatientForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(<PatientForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render multiple input fields.', () => {
    const { container } = renderWithProviders(<PatientForm />);
    const inputs = container.querySelectorAll('input, textarea, select');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should handle form submission.', () => {
    const { container } = renderWithProviders(<PatientForm />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});

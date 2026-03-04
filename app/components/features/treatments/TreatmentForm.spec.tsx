import * as treatmentActions from '@/app/actions/treatment.actions';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { TreatmentForm } from './TreatmentForm';

jest.mock('next/navigation');
jest.mock('@/hooks/useLogout');
jest.mock('@/hooks/useUser');
jest.mock('@/app/actions/treatment.actions');

describe('TreatmentForm', () => {
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

    (treatmentActions.getTreatment as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'treatment-1',
        patientId: mockPatientId,
        treatmentType: 'Antibiotic',
        startDate: '2024-01-20',
      },
    });
    (treatmentActions.createTreatment as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'treatment-2' },
    });
    (treatmentActions.updateTreatment as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'treatment-1' },
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <TreatmentForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept patientId prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept treatmentId prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentForm patientId={mockPatientId} treatmentId="treatment-1" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept isEditMode prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentForm
        isEditMode={true}
        patientId={mockPatientId}
        treatmentId="treatment-1"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<TreatmentForm patientId={mockPatientId} />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should call useLogout hook.', () => {
    renderWithProviders(<TreatmentForm patientId={mockPatientId} />);
    expect(useLogout).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(
      <TreatmentForm patientId={mockPatientId} />
    );
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(
      <TreatmentForm patientId={mockPatientId} />
    );
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render input fields.', () => {
    const { container } = renderWithProviders(
      <TreatmentForm patientId={mockPatientId} />
    );
    const inputs = container.querySelectorAll('input, textarea');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

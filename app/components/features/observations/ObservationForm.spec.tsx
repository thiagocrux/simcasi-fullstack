import * as observationActions from '@/app/actions/observation.actions';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { ObservationForm } from './ObservationForm';

jest.mock('next/navigation');
jest.mock('@/hooks/useLogout');
jest.mock('@/hooks/useUser');
jest.mock('@/app/actions/observation.actions');

describe('ObservationForm', () => {
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

    (observationActions.getObservation as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'observation-1',
        patientId: mockPatientId,
        title: 'Test Observation',
        description: 'Test description',
      },
    });
    (observationActions.createObservation as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'observation-2' },
    });
    (observationActions.updateObservation as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'observation-1' },
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <ObservationForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept patientId prop.', () => {
    const { container } = renderWithProviders(
      <ObservationForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept observationId prop.', () => {
    const { container } = renderWithProviders(
      <ObservationForm
        patientId={mockPatientId}
        observationId="observation-1"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept isEditMode prop.', () => {
    const { container } = renderWithProviders(
      <ObservationForm
        isEditMode={true}
        patientId={mockPatientId}
        observationId="observation-1"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<ObservationForm patientId={mockPatientId} />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should call useLogout hook.', () => {
    renderWithProviders(<ObservationForm patientId={mockPatientId} />);
    expect(useLogout).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(
      <ObservationForm patientId={mockPatientId} />
    );
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(
      <ObservationForm patientId={mockPatientId} />
    );
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render input fields.', () => {
    const { container } = renderWithProviders(
      <ObservationForm patientId={mockPatientId} />
    );
    const inputs = container.querySelectorAll('input, textarea');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

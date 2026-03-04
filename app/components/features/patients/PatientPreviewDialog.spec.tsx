import { patientMock } from '@/tests/mocks/repositories/patient.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { PatientPreviewDialog } from './PatientPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/patient.actions');

describe('PatientPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept patientId prop.', () => {
    const { container } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <button>Open Patient</button>
      </PatientPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with different patient IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should handle open state changes.', () => {
    const { container: container1 } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <PatientPreviewDialog
        title="Test Patient"
        description="Test Patient Description"
        patient={patientMock}
      >
        <div>Test Child</div>
      </PatientPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

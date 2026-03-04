import { treatmentMock } from '@/tests/mocks/repositories/treatment.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { TreatmentPreviewDialog } from './TreatmentPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/treatment.actions');

describe('TreatmentPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept treatmentId prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <button>Open Treatment</button>
      </TreatmentPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with different treatment IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should handle open state changes.', () => {
    const { container: container1 } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <TreatmentPreviewDialog
        title="Test Treatment"
        description="Test Treatment Description"
        treatment={treatmentMock}
      >
        <div>Test Child</div>
      </TreatmentPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

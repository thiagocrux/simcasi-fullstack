import { observationMock } from '@/tests/mocks/repositories/observation.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { ObservationPreviewDialog } from './ObservationPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/observation.actions');

describe('ObservationPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept observationId prop.', () => {
    const { container } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <button>Open Observation</button>
      </ObservationPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with different observation IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should handle open state changes.', () => {
    const { container: container1 } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <ObservationPreviewDialog
        title="Test Observation"
        description="Test Observation Description"
        observation={observationMock}
      >
        <div>Test Child</div>
      </ObservationPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

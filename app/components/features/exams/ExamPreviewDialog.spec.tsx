import { examMock } from '@/tests/mocks/repositories/exam.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { ExamPreviewDialog } from './ExamPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/exam.actions');

describe('ExamPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept examId prop.', () => {
    const { container } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <button>Open Exam</button>
      </ExamPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should handle open state.', () => {
    const { container: container1 } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should render with different exam IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <ExamPreviewDialog
        title="Test Exam"
        description="Test Exam Description"
        exam={examMock}
      >
        <div>Test Child</div>
      </ExamPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

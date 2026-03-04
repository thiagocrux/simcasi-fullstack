import * as examActions from '@/app/actions/exam.actions';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { ExamForm } from './ExamForm';

jest.mock('next/navigation');
jest.mock('@/hooks/useLogout');
jest.mock('@/hooks/useUser');
jest.mock('@/app/actions/exam.actions');

describe('ExamForm', () => {
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

    (examActions.getExam as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'exam-1',
        patientId: mockPatientId,
        title: 'Test Exam',
        result: 'Positive',
        examinedAt: '2024-01-20',
      },
    });
    (examActions.createExam as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'exam-2' },
    });
    (examActions.updateExam as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 'exam-1' },
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <ExamForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept patientId prop.', () => {
    const { container } = renderWithProviders(
      <ExamForm patientId={mockPatientId} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept examId prop.', () => {
    const { container } = renderWithProviders(
      <ExamForm patientId={mockPatientId} examId="exam-1" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept isEditMode prop.', () => {
    const { container } = renderWithProviders(
      <ExamForm isEditMode={true} patientId={mockPatientId} examId="exam-1" />
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(<ExamForm patientId={mockPatientId} />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should call useLogout hook.', () => {
    renderWithProviders(<ExamForm patientId={mockPatientId} />);
    expect(useLogout).toHaveBeenCalled();
  });

  it('should render form element.', () => {
    const { container } = renderWithProviders(
      <ExamForm patientId={mockPatientId} />
    );
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should render submit button.', () => {
    const { container } = renderWithProviders(
      <ExamForm patientId={mockPatientId} />
    );
    const button = container.querySelector('button[type="submit"]');
    expect(button).toBeInTheDocument();
  });

  it('should render input fields.', () => {
    const { container } = renderWithProviders(
      <ExamForm patientId={mockPatientId} />
    );
    const inputs = container.querySelectorAll('input, textarea');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

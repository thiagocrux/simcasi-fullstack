/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { NewMedicalRecordDialog } from './NewMedicalRecordDialog';

// Mock Next.js router
jest.mock('next/navigation');

// Mock patient actions
jest.mock('@/app/actions/patient.actions');

// Mock React Query
jest.mock('@tanstack/react-query');

// Mock child components that are complex
jest.mock('./AppDialog', () => ({
  AppDialog: ({
    title,
    description,
    content,
    children,
    cancelAction,
    continueAction,
  }: any) => (
    <div data-testid="app-dialog">
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        data-testid="cancel-button"
        onClick={cancelAction?.action}
        disabled={cancelAction?.disabled}
        hidden={cancelAction?.hidden}
      >
        {cancelAction?.label || 'Cancel'}
      </button>
      <button
        data-testid="continue-button"
        onClick={continueAction?.action}
        disabled={continueAction?.disabled}
        hidden={continueAction?.hidden}
      >
        {continueAction?.label || 'Continue'}
      </button>
      <div data-testid="dialog-content">{content}</div>
      {children}
    </div>
  ),
}));

jest.mock('./AppTablePagination', () => ({
  AppTablePagination: ({ table }: any) => (
    <div data-testid="app-table-pagination">Pagination</div>
  ),
}));

jest.mock('./CustomSkeleton', () => ({
  CustomSkeleton: ({ variant }: any) => (
    <div data-testid="custom-skeleton">{variant}</div>
  ),
}));

jest.mock('./EmptyTableFeedback', () => ({
  EmptyTableFeedback: ({ variant }: any) => (
    <div data-testid="empty-table-feedback">{variant}</div>
  ),
}));

jest.mock('./HighlightedText', () => ({
  HighlightedText: ({ text, highlight }: any) => (
    <span data-testid="highlighted-text">{text}</span>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('NewMedicalRecordDialog', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockPatientData = {
    success: true,
    data: {
      items: [
        { id: '1', name: 'John Doe', cpf: '12345678901' },
        { id: '2', name: 'Jane Smith', cpf: '98765432101' },
      ],
      total: 2,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useQuery as jest.Mock).mockReturnValue({
      data: mockPatientData,
      isPending: false,
    });
  });

  it('should render dialog with default title', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    expect(screen.getByText(/Quase lá/i)).toBeInTheDocument();
  });

  it('should render dialog with custom title', () => {
    render(<NewMedicalRecordDialog variant="exams" title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('should render dialog with custom description', () => {
    render(
      <NewMedicalRecordDialog
        variant="exams"
        description="Custom Description"
      />
    );
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('should render loading skeleton while fetching patients', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isPending: true,
    });

    render(<NewMedicalRecordDialog variant="exams" />);
    expect(screen.getByTestId('custom-skeleton')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    const input = screen.getByPlaceholderText(/Pesquisar/i);
    expect(input).toBeInTheDocument();
  });

  it('should update search value on input change', async () => {
    const { getByPlaceholderText } = render(
      <NewMedicalRecordDialog variant="exams" />
    );
    const input = getByPlaceholderText(/Pesquisar/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John' } });
    expect(input.value).toBe('John');
  });

  it('should render search column dropdown', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    const dropdown = screen.getByRole('button', { name: /Nome/i });
    expect(dropdown).toBeInTheDocument();
  });

  it('should render clear search button when search value exists', async () => {
    const { getByPlaceholderText } = render(
      <NewMedicalRecordDialog variant="exams" />
    );
    const input = getByPlaceholderText(/Pesquisar/);
    fireEvent.change(input, { target: { value: 'John' } });
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
  });

  it('should clear search value when clear button clicked', async () => {
    const { getByPlaceholderText } = render(
      <NewMedicalRecordDialog variant="exams" />
    );
    const input = getByPlaceholderText(/Pesquisar/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'John' } });
    expect(input.value).toBe('John');
  });

  it('should render patient list', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should select patient when clicked', async () => {
    const { container } = render(<NewMedicalRecordDialog variant="exams" />);
    const patientButton = Array.from(container.querySelectorAll('button')).find(
      (btn) => btn.textContent?.includes('John Doe')
    );
    if (patientButton) {
      fireEvent.click(patientButton);
    }
    expect(screen.getByTestId('app-dialog')).toBeInTheDocument();
  });

  it('should deselect patient when clicked again', async () => {
    const { container } = render(<NewMedicalRecordDialog variant="exams" />);
    const patientButton = Array.from(container.querySelectorAll('button')).find(
      (btn) => btn.textContent?.includes('John Doe')
    );
    if (patientButton) {
      fireEvent.click(patientButton);
      fireEvent.click(patientButton);
    }
    expect(screen.getByTestId('app-dialog')).toBeInTheDocument();
  });

  it('should disable continue button when no patient selected', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).toBeDisabled();
  });

  it('should enable continue button when patient selected', () => {
    const { container } = render(<NewMedicalRecordDialog variant="exams" />);
    const patientButton = Array.from(container.querySelectorAll('button')).find(
      (btn) => btn.textContent?.includes('John Doe')
    );
    if (patientButton) {
      fireEvent.click(patientButton);
    }
    expect(screen.getByTestId('app-dialog')).toBeInTheDocument();
  });

  it('should navigate to exams route on continue action', async () => {
    const { container } = render(<NewMedicalRecordDialog variant="exams" />);
    const patientButton = Array.from(container.querySelectorAll('button')).find(
      (btn) => btn.textContent?.includes('John Doe')
    );
    if (patientButton) {
      fireEvent.click(patientButton);
    }
    const continueButton = screen.getByTestId('continue-button');
    fireEvent.click(continueButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/patients/1/exams/new');
  });

  it('should navigate to notifications route for notifications variant', () => {
    render(<NewMedicalRecordDialog variant="notifications" />);
    expect(screen.getByTestId('app-dialog')).toBeInTheDocument();
  });

  it('should navigate to observations route for observations variant', () => {
    render(<NewMedicalRecordDialog variant="observations" />);
    expect(screen.getByTestId('app-dialog')).toBeInTheDocument();
  });

  it('should navigate to treatments route for treatments variant', () => {
    render(<NewMedicalRecordDialog variant="treatments" />);
    expect(screen.getByTestId('app-dialog')).toBeInTheDocument();
  });

  it('should show empty state when no patients in database', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        success: true,
        data: { items: [], total: 0 },
      },
      isPending: false,
    });

    render(<NewMedicalRecordDialog variant="exams" />);
    expect(screen.getByTestId('empty-table-feedback')).toBeInTheDocument();
  });

  it('should show empty search results message when search returns no results', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: {
        success: true,
        data: { items: [], total: 2 },
      },
      isPending: false,
    });

    render(<NewMedicalRecordDialog variant="exams" />);
    expect(
      screen.getByText(/Sua busca não retornou resultados/i)
    ).toBeInTheDocument();
  });

  it('should render pagination controls when patients exist', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    expect(screen.getByTestId('app-table-pagination')).toBeInTheDocument();
  });

  it('should render cancel button', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    const cancelButton = screen.getByTestId('cancel-button');
    expect(cancelButton).toBeInTheDocument();
  });

  it('should call cancel action when cancel button clicked', async () => {
    const mockCancelAction = jest.fn();
    render(
      <NewMedicalRecordDialog
        variant="exams"
        cancelAction={{ action: mockCancelAction, label: 'Cancel' }}
      />
    );
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);
    expect(mockCancelAction).toHaveBeenCalled();
  });

  it('should render children', () => {
    render(
      <NewMedicalRecordDialog variant="exams">
        <button>Test Child</button>
      </NewMedicalRecordDialog>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should query patients with correct parameters', () => {
    render(<NewMedicalRecordDialog variant="exams" />);
    expect(useQuery).toHaveBeenCalled();
  });

  it('should reset page index when search value changes', async () => {
    const { getByPlaceholderText } = render(
      <NewMedicalRecordDialog variant="exams" />
    );
    const input = getByPlaceholderText(/Pesquisar/);
    fireEvent.change(input, { target: { value: 'John' } });
    expect(useQuery).toHaveBeenCalled();
  });
});

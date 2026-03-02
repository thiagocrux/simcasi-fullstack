import { usePermission } from '@/hooks/usePermission';
import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { EmptyTableFeedback } from './EmptyTableFeedback';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock('./NewMedicalRecordDialog', () => ({
  NewMedicalRecordDialog: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medical-record-dialog">{children}</div>
  ),
}));

describe('EmptyTableFeedback', () => {
  let mockCan: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockCan = jest.fn((_: string) => true);
    (usePermission as jest.Mock).mockReturnValue({ can: mockCan });

    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  describe('users variant', () => {
    it('should render users empty state title', () => {
      render(<EmptyTableFeedback variant="users" />);
      expect(screen.getByText(/Nenhum usuário/)).toBeInTheDocument();
    });

    it('should render create user button when has permission', () => {
      mockCan.mockImplementation((perm: string) => perm === 'create:user');
      render(<EmptyTableFeedback variant="users" />);
      expect(screen.getByText('Cadastrar usuário')).toBeInTheDocument();
    });

    it('should navigate to users page when create button clicked', () => {
      mockCan.mockReturnValue(true);
      render(<EmptyTableFeedback variant="users" />);
      fireEvent.click(screen.getByText('Cadastrar usuário'));
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('patients variant', () => {
    it('should render patients empty state title', () => {
      render(<EmptyTableFeedback variant="patients" />);
      expect(screen.getByText(/Nenhum paciente/)).toBeInTheDocument();
    });

    it('should render create patient button', () => {
      mockCan.mockImplementation((perm: string) => perm === 'create:patient');
      render(<EmptyTableFeedback variant="patients" />);
      expect(screen.getByText('Cadastrar paciente')).toBeInTheDocument();
    });
  });

  describe('exams variant', () => {
    it('should render exams empty state without patientId', () => {
      render(<EmptyTableFeedback variant="exams" />);
      expect(screen.getByText(/Nenhum exame/)).toBeInTheDocument();
    });

    it('should render patient-specific message when patientId is provided', () => {
      render(<EmptyTableFeedback variant="exams" patientId="patient-123" />);
      expect(
        screen.getByText(/Nenhum exame encontrado para este paciente/)
      ).toBeInTheDocument();
    });

    it('should use medical record dialog for patient exams', () => {
      mockCan.mockReturnValue(true);
      render(<EmptyTableFeedback variant="exams" patientId="patient-123" />);
      fireEvent.click(screen.getByText('Cadastrar exame'));
      expect(mockPush).toHaveBeenCalledWith('/patients/patient-123/exams/new');
    });

    it('should show medical record dialog without patientId', () => {
      mockCan.mockReturnValue(true);
      const { container } = render(<EmptyTableFeedback variant="exams" />);
      expect(
        container.querySelector('[data-testid="medical-record-dialog"]')
      ).toBeInTheDocument();
    });
  });

  describe('notifications variant', () => {
    it('should render notifications empty state', () => {
      render(<EmptyTableFeedback variant="notifications" />);
      expect(screen.getByText(/Nenhuma notificação/)).toBeInTheDocument();
    });

    it('should show patient-specific message with patientId', () => {
      render(<EmptyTableFeedback variant="notifications" patientId="p-456" />);
      expect(screen.getByText(/para este paciente/)).toBeInTheDocument();
    });
  });

  describe('observations variant', () => {
    it('should render observations empty state', () => {
      render(<EmptyTableFeedback variant="observations" />);
      expect(screen.getByText(/Nenhuma observação/)).toBeInTheDocument();
    });

    it('should navigate when patientId is provided', () => {
      mockCan.mockReturnValue(true);
      render(<EmptyTableFeedback variant="observations" patientId="p-789" />);
      fireEvent.click(screen.getByText('Cadastrar observação'));
      expect(mockPush).toHaveBeenCalledWith('/patients/p-789/observations/new');
    });
  });

  describe('treatments variant', () => {
    it('should render treatments empty state', () => {
      render(<EmptyTableFeedback variant="treatments" />);
      expect(screen.getByText(/Nenhum tratamento/)).toBeInTheDocument();
    });
  });

  describe('audit-logs variant', () => {
    it('should render audit logs empty state', () => {
      render(<EmptyTableFeedback variant="audit-logs" />);
      expect(screen.getByText(/Nenhum log de auditoria/)).toBeInTheDocument();
    });

    it('should not render button for audit logs', () => {
      mockCan.mockReturnValue(true);
      render(<EmptyTableFeedback variant="audit-logs" />);
      expect(screen.queryByText(/Cadastrar/)).not.toBeInTheDocument();
    });
  });

  describe('permission-based rendering', () => {
    it('should render no-permission message when user lacks permission', () => {
      mockCan.mockReturnValue(false);
      render(<EmptyTableFeedback variant="users" />);
      expect(
        screen.getByText('Nenhum registro cadastrado')
      ).toBeInTheDocument();
      expect(screen.getByText(/procure o administrador/)).toBeInTheDocument();
    });

    it('should not render action button when no permission', () => {
      mockCan.mockReturnValue(false);
      render(<EmptyTableFeedback variant="users" />);
      expect(screen.queryByText('Cadastrar')).not.toBeInTheDocument();
    });

    it('should render permission-dependent content based on variant', () => {
      mockCan.mockImplementation((perm: string) => {
        return perm === 'create:patient';
      });

      render(<EmptyTableFeedback variant="patients" />);
      expect(
        screen.getByText(/Nenhum paciente foi encontrado/)
      ).toBeInTheDocument();
    });
  });

  describe('medical record variants behavior', () => {
    const medicalRecordVariants: Array<
      'exams' | 'notifications' | 'observations' | 'treatments'
    > = ['exams', 'notifications', 'observations', 'treatments'];

    medicalRecordVariants.forEach((variant) => {
      it(`should handle ${variant} variant properly`, () => {
        mockCan.mockReturnValue(true);
        render(<EmptyTableFeedback variant={variant} />);
        expect(screen.getByText(/nenhum|nenhuma/i)).toBeInTheDocument();
      });
    });
  });

  describe('image rendering', () => {
    it('should render no-results icon', () => {
      const { container } = render(<EmptyTableFeedback variant="users" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', '/icons/no-results-found.svg');
    });

    it('should render image with correct dimensions', () => {
      const { container } = render(<EmptyTableFeedback variant="users" />);
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/icons/no-results-found.svg');
    });
  });

  describe('layout and styling', () => {
    it('should render centered container', () => {
      const { container } = render(<EmptyTableFeedback variant="users" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('justify-center', 'items-center');
    });

    it('should have text-center styling', () => {
      const { container } = render(<EmptyTableFeedback variant="users" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('text-center');
    });

    it('should have responsive padding', () => {
      const { container } = render(<EmptyTableFeedback variant="users" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('sm:p-12', 'px-6');
    });

    it('should have max-width constraint', () => {
      const { container } = render(<EmptyTableFeedback variant="users" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('max-w-lg');
    });
  });

  describe('patient-specific behavior', () => {
    it('should use patientId in navigation route', () => {
      mockCan.mockReturnValue(true);
      const patientId = 'patient-special-123';
      render(<EmptyTableFeedback variant="exams" patientId={patientId} />);
      fireEvent.click(screen.getByText('Cadastrar exame'));
      expect(mockPush).toHaveBeenCalledWith(`/patients/${patientId}/exams/new`);
    });

    it('should show patient-specific messages for each variant', () => {
      mockCan.mockReturnValue(true);
      render(<EmptyTableFeedback variant="exams" patientId="p-1" />);
      expect(
        screen.getByText(/Este paciente ainda não possui exames/)
      ).toBeInTheDocument();
    });
  });
});

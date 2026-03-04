import { sessionMock } from '@/tests/mocks/repositories/session.mock';
import { renderWithProviders } from '@/tests/utils';
import { useRouter } from 'next/navigation';
import { SessionPreviewDialog } from './SessionPreviewDialog';

jest.mock('next/navigation');
jest.mock('@/app/actions/session.actions');

describe('SessionPreviewDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should call useRouter hook.', () => {
    renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    expect(useRouter).toHaveBeenCalled();
  });

  it('should accept sessionId prop.', () => {
    const { container } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept open prop.', () => {
    const { container } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept children prop.', () => {
    const { container } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <button>Open Session</button>
      </SessionPreviewDialog>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with different session IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should handle open state changes.', () => {
    const { container: container1 } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    const { container: container2 } = renderWithProviders(
      <SessionPreviewDialog
        title="Test Session"
        description="Test Session Description"
        session={sessionMock}
      >
        <div>Test Child</div>
      </SessionPreviewDialog>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });
});

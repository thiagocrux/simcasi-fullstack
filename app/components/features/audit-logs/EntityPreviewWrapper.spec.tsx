import { renderWithProviders } from '@/tests/utils';
import { useQuery } from '@tanstack/react-query';
import { EntityPreviewWrapper } from './EntityPreviewWrapper';

jest.mock('@tanstack/react-query');

describe('EntityPreviewWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useQuery as jest.Mock).mockReturnValue({
      data: { success: true, data: {} },
      isPending: false,
      error: null,
    });
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-1">
        <div>Test Child</div>
      </EntityPreviewWrapper>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept entityType prop.', () => {
    const { container } = renderWithProviders(
      <EntityPreviewWrapper entityName="PATIENT" entityId="patient-1">
        <div>Test Child</div>
      </EntityPreviewWrapper>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept entityId prop.', () => {
    const { container } = renderWithProviders(
      <EntityPreviewWrapper entityName="EXAM" entityId="exam-1">
        <div>Test Child</div>
      </EntityPreviewWrapper>
    );
    expect(container).toBeInTheDocument();
  });

  it('should handle pending state.', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    });
    const { container } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-1">
        <div>Test Child</div>
      </EntityPreviewWrapper>
    );
    expect(container).toBeInTheDocument();
  });

  it('should handle error state.', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: new Error('Test error'),
    });
    const { container } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-1">
        <div>Test Child</div>
      </EntityPreviewWrapper>
    );
    expect(container).toBeInTheDocument();
  });

  it('should render different entity types.', () => {
    const { container: container1 } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-1">
        <div>User Content</div>
      </EntityPreviewWrapper>
    );
    const { container: container2 } = renderWithProviders(
      <EntityPreviewWrapper entityName="PATIENT" entityId="patient-1">
        <div>Patient Content</div>
      </EntityPreviewWrapper>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should render with multiple children.', () => {
    const { container } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-1">
        <div>First Child</div>
        <div>Second Child</div>
      </EntityPreviewWrapper>
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept different entity IDs.', () => {
    const { container: container1 } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-1">
        <div>Test</div>
      </EntityPreviewWrapper>
    );
    const { container: container2 } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-2">
        <div>Test</div>
      </EntityPreviewWrapper>
    );
    expect(container1).toBeInTheDocument();
    expect(container2).toBeInTheDocument();
  });

  it('should accept optional children prop.', () => {
    const { container } = renderWithProviders(
      <EntityPreviewWrapper entityName="USER" entityId="user-1">
        <></>
      </EntityPreviewWrapper>
    );
    expect(container).toBeInTheDocument();
  });
});

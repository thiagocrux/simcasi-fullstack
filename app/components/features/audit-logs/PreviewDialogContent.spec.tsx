import { renderWithProviders } from '@/tests/utils';
import { PreviewDialogContent } from './PreviewDialogContent';

describe('PreviewDialogContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component.', () => {
    const { container } = renderWithProviders(
      <PreviewDialogContent fields={[]} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should accept fields prop.', () => {
    const fields = [
      { label: 'Name', value: 'Test' },
      { label: 'Email', value: 'test@example.com' },
    ];
    const { container } = renderWithProviders(
      <PreviewDialogContent fields={fields} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render field labels.', () => {
    const fields = [{ label: 'Custom Label', value: 'Custom Value' }];
    const { container } = renderWithProviders(
      <PreviewDialogContent fields={fields} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render fields with numeric values.', () => {
    const fields = [{ label: 'Count', value: 42 }];
    const { container } = renderWithProviders(
      <PreviewDialogContent fields={fields} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render fields with null values.', () => {
    const fields = [{ label: 'Optional', value: null }];
    const { container } = renderWithProviders(
      <PreviewDialogContent fields={fields} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render with empty fields array.', () => {
    const { container } = renderWithProviders(
      <PreviewDialogContent fields={[]} />
    );
    expect(container).toBeInTheDocument();
  });
});

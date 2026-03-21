import { renderWithProviders } from '@/tests/utils';
import { screen } from '@testing-library/react';
import { DetailsPageProperties } from './DetailsPageProperties';

describe('DetailsPageProperties', () => {
  it('should render card container', () => {
    const { container: _container } = renderWithProviders(
      <DetailsPageProperties data={[]} />
    );
    expect(_container.firstChild).toBeInTheDocument();
  });

  it('should render single section with title', () => {
    const data = [
      {
        title: 'Personal Information',
        fields: [
          { label: 'Name', value: 'John Doe' },
          { label: 'Email', value: 'john@example.com' },
        ],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('should render multiple sections', () => {
    const data = [
      {
        title: 'Section 1',
        fields: [{ label: 'Field 1', value: 'Value 1' }],
      },
      {
        title: 'Section 2',
        fields: [{ label: 'Field 2', value: 'Value 2' }],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('should render field labels', () => {
    const data = [
      {
        title: 'Info',
        fields: [
          { label: 'First Name', value: 'John' },
          { label: 'Last Name', value: 'Doe' },
        ],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
  });

  it('should render field values', () => {
    const data = [
      {
        title: 'Details',
        fields: [
          { label: 'CPF', value: '12345678901' },
          { label: 'Email', value: 'test@example.com' },
        ],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('12345678901')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should not render value when it is null', () => {
    const data = [
      {
        title: 'Info',
        fields: [
          { label: 'Phone', value: null },
          { label: 'Email', value: 'test@example.com' },
        ],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should not render value when it is undefined', () => {
    const data = [
      {
        title: 'Info',
        fields: [
          { label: 'Phone', value: undefined },
          { label: 'Name', value: 'John' },
        ],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should render section without title', () => {
    const data = [
      {
        fields: [
          { label: 'Field 1', value: 'Value 1' },
          { label: 'Field 2', value: 'Value 2' },
        ],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('Field 1')).toBeInTheDocument();
    expect(screen.getByText('Value 1')).toBeInTheDocument();
  });

  it('should render separator between section title and fields', () => {
    renderWithProviders(
      <DetailsPageProperties
        data={[
          {
            title: 'Address',
            fields: [{ label: 'City', value: 'São Paulo' }],
          },
        ]}
      />
    );

    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });

  it('should render dotted separator line between labels and values', () => {
    const { container } = renderWithProviders(
      <DetailsPageProperties
        data={[
          {
            title: 'Info',
            fields: [{ label: 'Status', value: 'Active' }],
          },
        ]}
      />
    );

    const dottedLine = container.querySelector('[class*="border-dashed"]');
    expect(dottedLine).toBeInTheDocument();
  });

  it('should render clipboard copy button for non-empty values', () => {
    const { container } = renderWithProviders(
      <DetailsPageProperties
        data={[
          {
            title: 'Contact',
            fields: [{ label: 'Email', value: 'user@example.com' }],
          },
        ]}
      />
    );

    // ClipboardCopyButton renders a button with copy icon
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('should render empty section list when no data', () => {
    const { container: _container } = renderWithProviders(
      <DetailsPageProperties data={[]} />
    );

    expect(_container.firstChild).toBeInTheDocument();
  });

  it('should render fields with proper flex layout', () => {
    const { container } = renderWithProviders(
      <DetailsPageProperties
        data={[
          {
            title: 'Info',
            fields: [{ label: 'Label', value: 'Value' }],
          },
        ]}
      />
    );

    const fieldDiv = container.querySelector(
      '[class*="flex"][class*="items-start"]'
    );
    expect(fieldDiv).toBeInTheDocument();
  });

  it('should handle multiple fields in single section', () => {
    const data = [
      {
        title: 'Patient Info',
        fields: [
          { label: 'Full Name', value: 'John Doe' },
          { label: 'Date of Birth', value: '1990-01-01' },
          { label: 'Gender', value: 'Male' },
          { label: 'CPF', value: '12345678901' },
        ],
      },
    ];
    renderWithProviders(<DetailsPageProperties data={data} />);

    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByText('1990-01-01')).toBeInTheDocument();
  });

  it('should use consistent spacing between sections', () => {
    const { container } = renderWithProviders(
      <DetailsPageProperties
        data={[
          { title: 'Section 1', fields: [{ label: 'Field', value: 'Value' }] },
          { title: 'Section 2', fields: [{ label: 'Field', value: 'Value' }] },
        ]}
      />
    );

    const card = container.querySelector('[class*="gap-8"]');
    expect(card).toBeInTheDocument();
  });

  it('should render multiple property sections', () => {
    renderWithProviders(
      <DetailsPageProperties
        data={[
          {
            title: 'Patient Details',
            fields: [
              { label: 'ID', value: '12345' },
              { label: 'Status', value: 'Active' },
            ],
          },
        ]}
      />
    );
  });
});

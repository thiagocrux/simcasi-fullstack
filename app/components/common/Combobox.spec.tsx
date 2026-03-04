import { renderWithProviders } from '@/tests/utils';
import { fireEvent, screen } from '@testing-library/react';
import { Combobox } from './Combobox';

describe('Combobox', () => {
  const mockData = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];

  it('should render trigger button with placeholder when no value is selected', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select an option"
        searchPlaceholder="Search..."
        emptySearchMessage="No options found"
        disabled={false}
      />
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should render selected label when value is provided', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value="opt2"
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it.skip('should open popover when trigger button is clicked', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it.skip('should render command input with search placeholder when opened', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Type to search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(
      screen.getByPlaceholderText('Type to search...')
    ).toBeInTheDocument();
  });

  it.skip('should render all data items as options', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it.skip('should call onChange when an option is selected', () => {
    const mockOnChange = jest.fn();
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={mockOnChange}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);

    expect(mockOnChange).toHaveBeenCalledWith('opt2');
  });

  it.skip('should close popover after selection', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it.skip('should filter options based on search input', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'Option 2' } });

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it.skip('should show empty message when no matches found', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="No results"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it.skip('should show checkmark on selected option', () => {
    const { container } = renderWithProviders(
      <Combobox
        data={mockData}
        value="opt1"
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const checkmarks = container.querySelectorAll('svg');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('should disable button when disabled prop is true', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={true}
      />
    );
    const button = screen.getByRole('combobox') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('should render outline variant button', () => {
    renderWithProviders(
      <Combobox
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    expect(button?.className).toContain('shadow-xs');
  });

  it('should accept ref forwarding', () => {
    const ref = jest.fn();
    renderWithProviders(
      <Combobox
        ref={ref}
        data={mockData}
        value=""
        onChange={jest.fn()}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    expect(ref).toHaveBeenCalled();
  });

  it.skip('should toggle selection when clicking already selected option', () => {
    const mockOnChange = jest.fn();
    renderWithProviders(
      <Combobox
        data={mockData}
        value="opt1"
        onChange={mockOnChange}
        placeholder="Select"
        searchPlaceholder="Search..."
        emptySearchMessage="Not found"
        disabled={false}
      />
    );
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);

    expect(mockOnChange).toHaveBeenCalledWith('');
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { AppTableToolbar } from './AppTableToolbar';

interface TestData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

describe('AppTableToolbar', () => {
  let mockTable: any;
  const mockHandleDataExport = jest.fn();
  const mockSetSelectedFilterOption = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockTable = {
      getColumn: jest.fn(),
      getAllColumns: jest.fn(() => []),
      getState: jest.fn(() => ({})),
    };
  });

  it('should render toolbar container', () => {
    const { container } = render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render advanced filters toggle button', () => {
    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={true}
      />
    );

    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
  });

  it('should toggle advanced filters visibility when button is clicked', () => {
    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={true}
      />
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Data inicial')).toBeInTheDocument();
  });

  it('should not render advanced filters section when showAdvancedFilters is false', () => {
    const { container } = render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={false}
      />
    );

    expect(screen.queryByText('Data inicial')).not.toBeInTheDocument();
  });

  it('should render print button when showPrintButton is true', () => {
    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={true}
        showPrintButton={true}
      />
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    const printButtons = screen.getAllByRole('button');
    expect(printButtons.length).toBeGreaterThan(1);
  });

  it('should not render print button when showPrintButton is false', () => {
    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={false}
        showPrintButton={false}
      />
    );

    const printButtons = screen.queryAllByRole('button');
    expect(printButtons).toBeDefined();
  });

  it('should accept custom className', () => {
    const { container } = render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        className="custom-toolbar-class"
      />
    );

    const toolbar = container.querySelector('.custom-toolbar-class');
    expect(toolbar).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
      >
        <div data-testid="custom-child">Custom Content</div>
      </AppTableToolbar>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  it('should render date range filter fields when filters are toggled', () => {
    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={true}
      />
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(screen.getByText('Data inicial')).toBeInTheDocument();
    expect(screen.getByText('Data final')).toBeInTheDocument();
  });

  it('should have correct default date column id', () => {
    mockTable.getColumn.mockReturnValue({
      getFilterValue: jest.fn().mockReturnValue({}),
      setFilterValue: jest.fn(),
    });

    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={true}
      />
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockTable.getColumn).toHaveBeenCalledWith('createdAt');
  });

  it('should use custom dateColumnId when provided', () => {
    mockTable.getColumn.mockReturnValue({
      getFilterValue: jest.fn().mockReturnValue({}),
      setFilterValue: jest.fn(),
    });

    render(
      <AppTableToolbar
        table={mockTable}
        columnLabelMapper={{ id: 'ID', name: 'Name' }}
        selectedFilterOption="name"
        setSelectedFilterOption={mockSetSelectedFilterOption}
        handleDataExport={mockHandleDataExport}
        showAdvancedFilters={true}
        dateColumnId="customDate"
      />
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(mockTable.getColumn).toHaveBeenCalledWith('customDate');
  });
});

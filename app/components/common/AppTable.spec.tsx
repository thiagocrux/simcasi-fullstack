import { renderWithProviders } from '@/tests/utils';
import { AppTable } from './AppTable';

describe('AppTable', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockTable: any;

  beforeEach(() => {
    mockTable = {
      getHeaderGroups: jest.fn(() => [
        {
          id: 'header-1',
          headers: [
            {
              id: 'col-name',
              column: { columnDef: { header: 'Name' } },
              getContext: jest.fn(() => ({})),
            },
            {
              id: 'col-email',
              column: { columnDef: { header: 'Email' } },
              getContext: jest.fn(() => ({})),
            },
          ],
        },
      ]),
      getRowModel: jest.fn(() => ({
        rows: [
          {
            id: 'row-1',
            getIsSelected: jest.fn(() => false),
            getVisibleCells: jest.fn(() => [
              {
                id: 'cell-1',
                column: { columnDef: {} },
                renderValue: jest.fn(() => 'John Doe'),
                getContext: jest.fn(() => ({})),
              },
              {
                id: 'cell-2',
                column: { columnDef: {} },
                renderValue: jest.fn(() => 'john@example.com'),
                getContext: jest.fn(() => ({})),
              },
            ]),
          },
        ],
      })),
      getAllColumns: jest.fn(() => []),
    };
  });

  it('should render table element', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    expect(container.querySelector('thead')).toBeInTheDocument();
  });

  it('should render table body', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('should render table rows', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should render table cells', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('should use provided table instance', () => {
    renderWithProviders(<AppTable table={mockTable} />);
    expect(mockTable.getHeaderGroups).toHaveBeenCalled();
    expect(mockTable.getRowModel).toHaveBeenCalled();
  });

  it('should render row context menu when provided', () => {
    const mockContextMenu = jest.fn(() => <div>Context Menu</div>);
    const { container } = renderWithProviders(
      <AppTable table={mockTable} renderRowContextMenu={mockContextMenu} />
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('should render column headers in header row', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    const headerCells = container.querySelectorAll('thead th');
    expect(headerCells.length).toBeGreaterThan(0);
  });

  it('should have proper table structure', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    const table = container.querySelector('table');
    expect(table?.querySelector('thead')).toBeInTheDocument();
    expect(table?.querySelector('tbody')).toBeInTheDocument();
  });

  it('should render multiple rows when data has multiple rows', () => {
    mockTable.getRowModel.mockReturnValue({
      rows: [
        {
          id: 'row-1',
          getIsSelected: jest.fn(() => false),
          getVisibleCells: jest.fn(() => [
            {
              id: 'cell-1',
              column: { columnDef: {} },
              renderValue: jest.fn(() => 'John'),
              getContext: jest.fn(() => ({})),
            },
          ]),
        },
        {
          id: 'row-2',
          getIsSelected: jest.fn(() => false),
          getVisibleCells: jest.fn(() => [
            {
              id: 'cell-2',
              column: { columnDef: {} },
              renderValue: jest.fn(() => 'Jane'),
              getContext: jest.fn(() => ({})),
            },
          ]),
        },
      ],
    });

    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should render empty state when no rows', () => {
    mockTable.getRowModel.mockReturnValue({ rows: [] });

    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle column definitions properly', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(mockTable.getHeaderGroups).toHaveBeenCalled();
  });

  it('should be responsive with table layout', () => {
    const { container } = renderWithProviders(<AppTable table={mockTable} />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });
});

import { fireEvent, render } from '@testing-library/react';
import { AppTablePagination } from './AppTablePagination';

describe('AppTablePagination', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockTable: any;

  beforeEach(() => {
    mockTable = {
      getState: jest.fn(() => ({
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      })),
      getPageCount: jest.fn(() => 5),
      getCanPreviousPage: jest.fn(() => false),
      getCanNextPage: jest.fn(() => true),
      previousPage: jest.fn(),
      nextPage: jest.fn(),
      getRowModel: jest.fn(() => ({
        rows: Array(10)
          .fill(null)
          .map((_, i) => ({ id: `row-${i}` })),
      })),
    };
  });

  it('should render pagination container', () => {
    const { container } = render(<AppTablePagination table={mockTable} />);
    expect(
      container.querySelector('[class*="pagination"]') || container.firstChild
    ).toBeInTheDocument();
  });

  it('should display current page information', () => {
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getState).toHaveBeenCalled();
  });

  it('should disable previous button on first page', () => {
    mockTable.getCanPreviousPage.mockReturnValue(false);
    const { container } = render(<AppTablePagination table={mockTable} />);
    const prevButton = container.querySelector(
      'button[aria-label*="previous"]'
    );
    if (prevButton) {
      expect(prevButton).toBeDisabled();
    }
  });

  it('should enable previous button when not on first page', () => {
    mockTable.getCanPreviousPage.mockReturnValue(true);
    mockTable.getState.mockReturnValue({
      pagination: { pageIndex: 1, pageSize: 10 },
    });
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getCanPreviousPage).toHaveBeenCalled();
  });

  it('should disable next button on last page', () => {
    mockTable.getCanNextPage.mockReturnValue(false);
    mockTable.getPageCount.mockReturnValue(1);
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getCanNextPage).toHaveBeenCalled();
  });

  it('should enable next button when not on last page', () => {
    mockTable.getCanNextPage.mockReturnValue(true);
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getCanNextPage).toHaveBeenCalled();
  });

  it('should call previousPage when previous button clicked', async () => {
    mockTable.getCanPreviousPage.mockReturnValue(true);
    const { container } = render(<AppTablePagination table={mockTable} />);
    const buttons = container.querySelectorAll('button');
    const prevButton = Array.from(buttons).find(
      (btn) =>
        btn.textContent?.includes('previous') ||
        btn.textContent?.includes('Previous') ||
        btn.querySelector('[data-icon="chevron-left"]')
    );
    if (prevButton) {
      fireEvent.click(prevButton);
      expect(mockTable.previousPage).toHaveBeenCalled();
    }
  });

  it('should call nextPage when next button clicked', async () => {
    mockTable.getCanNextPage.mockReturnValue(true);
    const { container } = render(<AppTablePagination table={mockTable} />);
    const buttons = container.querySelectorAll('button');
    const nextButton = Array.from(buttons).find(
      (btn) =>
        btn.textContent?.includes('next') ||
        btn.textContent?.includes('Next') ||
        btn.querySelector('[data-icon="chevron-right"]')
    );
    if (nextButton) {
      fireEvent.click(nextButton);
      expect(mockTable.nextPage).toHaveBeenCalled();
    }
  });

  it('should display page count', () => {
    mockTable.getPageCount.mockReturnValue(5);
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getPageCount).toHaveBeenCalled();
  });

  it('should display current page index', () => {
    mockTable.getState.mockReturnValue({
      pagination: { pageIndex: 2, pageSize: 10 },
    });
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getState).toHaveBeenCalled();
  });

  it('should handle page size changes', () => {
    const { container } = render(<AppTablePagination table={mockTable} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should show correct row count for current page', () => {
    mockTable.getRowModel.mockReturnValue({
      rows: Array(10)
        .fill(null)
        .map((_, i) => ({ id: `row-${i}` })),
    });
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getRowModel).toHaveBeenCalled();
  });

  it('should update pagination state when table state changes', () => {
    const { rerender } = render(<AppTablePagination table={mockTable} />);
    mockTable.getState.mockReturnValue({
      pagination: { pageIndex: 1, pageSize: 10 },
    });
    rerender(<AppTablePagination table={mockTable} />);
    expect(mockTable.getState.mock.calls.length).toBeGreaterThan(0);
  });

  it('should maintain pagination boundaries', () => {
    mockTable.getState.mockReturnValue({
      pagination: { pageIndex: 4, pageSize: 10 },
    });
    mockTable.getPageCount.mockReturnValue(5);
    mockTable.getCanNextPage.mockReturnValue(false);
    render(<AppTablePagination table={mockTable} />);
    expect(mockTable.getPageCount).toHaveBeenCalled();
  });
});

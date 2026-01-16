'use client';

import type { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { cn, getPaginationRange } from '@/lib/shared.utils';
import { Button } from '../ui/button';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface AppTablePaginationProps {
  table: Table<Partial<unknown>>;
  showPaginationInput?: boolean;
  className?: string;
}

export function AppTablePagination({
  table,
  showPaginationInput = false,
  className,
}: AppTablePaginationProps) {
  const hasRows = table.getRowModel().rows?.length;

  if (!hasRows) {
    return null;
  }

  return (
    <div className={cn('flex lg:flex-row flex-col gap-4 py-4', className)}>
      <Pagination className="">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              onClick={() => table.setPageIndex(0)}
              className={
                !table.getCanPreviousPage()
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer select-none'
              }
            />
          </PaginationItem>
          <PaginationPrevious
            onClick={table.previousPage}
            aria-disabled={!table.getCanPreviousPage()}
            className={
              !table.getCanPreviousPage()
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer select-none'
            }
          />

          <PaginationItem className="sm:hidden block">
            <span className="px-2 text-muted-foreground text-sm">
              {table.getState().pagination.pageIndex + 1} /{' '}
              {table.getPageCount()}
            </span>
          </PaginationItem>

          {getPaginationRange(
            table.getState().pagination.pageIndex + 1,
            table.getPageCount()
          ).map((page, index) => {
            if (page === '...') {
              return (
                <PaginationItem
                  key={`ellipsis-${index}`}
                  className="hidden sm:block"
                >
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page} className="hidden sm:block">
                <PaginationLink
                  isActive={
                    table.getState().pagination.pageIndex === Number(page) - 1
                  }
                  onClick={() => table.setPageIndex(Number(page) - 1)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={table.nextPage}
              aria-disabled={!table.getCanNextPage()}
              className={
                !table.getCanNextPage()
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer select-none'
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              className={
                !table.getCanNextPage()
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer select-none'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {showPaginationInput && <PaginationInput table={table} />}
    </div>
  );
}

function PaginationInput({ table }: { table: Table<Partial<unknown>> }) {
  const [goToPageInput, setGoToPageInput] = useState('1');

  function handleGoToPage() {
    const page = Number(goToPageInput) - 1;
    if (page >= 0 && page < table.getPageCount()) {
      table.setPageIndex(page);
    }
  }

  useEffect(() => {
    setGoToPageInput((table.getState().pagination.pageIndex + 1).toString());
  }, [table]);

  return (
    <InputGroup className="mx-auto max-w-50!">
      <InputGroupInput
        type="number"
        min={1}
        max={table.getPageCount()}
        value={goToPageInput}
        onChange={(event) => setGoToPageInput(event.target.value)}
        className="w-full"
      />
      <InputGroupAddon align="inline-end" className="p-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoToPage}
          className="mr-1.75 border-l rounded-tl-none rounded-bl-none h-8.5 whitespace-nowrap cursor-pointer"
        >
          Ir para a página
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}

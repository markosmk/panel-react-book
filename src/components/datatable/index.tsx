import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  // SortingState,
  useReactTable
  // VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { DataTableToolbar } from './data-table-toolbar';
import { useSearchParams } from 'react-router-dom';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnToSearch: string | number | symbol;
  columnName?: string;
  children?: React.ReactNode;
  range?: { from: Date; to: Date };
  pageCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnToSearch,
  columnName = 'item',
  children,
  range,
  pageCount = 0
}: DataTableProps<TData, TValue>) {
  // const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  // const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  // const [rowSelection, setRowSelection] = React.useState({})
  // const [globalFilter, setGlobalFilter] = React.useState<string>("")

  const [searchParams, setSearchParams] = useSearchParams();
  // Search params
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get('limit') ?? '10';
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage
  });

  React.useEffect(() => {
    // Update the URL with the new page number and limit
    setSearchParams({
      ...Object.fromEntries(searchParams), // Spread the existing search params
      page: (pageIndex + 1).toString(), // Update the page number (assuming pageIndex is 0-based)
      limit: pageSize.toString() // Update the limit
    });
    // if search is there setting filter value
  }, [pageIndex, pageSize, searchParams, setSearchParams]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // for search
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // onRowSelectionChange: setRowSelection,
    // TODO: globalFilter add, to search more than one word
    // onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: (row, columnIds, filterValue) => {
    //   const searchWords: string[] = filterValue.toLowerCase().split(" ")
    //   if ([columnName].includes(columnIds as string)) {
    //     const columnName: keyof TData = columnIds as keyof TData
    //     const cellValue = row.original[columnName]?.toString().toLowerCase()
    //     return searchWords.every((word) => cellValue?.includes(word))
    //   }
    //   return false
    // },
    state: {
      // sorting,
      columnFilters,
      // rowSelection,
      // globalFilter,
      pagination: { pageIndex, pageSize }
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });

  // TODO: apply loading in table so used, empty tablerow
  return (
    <>
      <DataTableToolbar
        table={table}
        columnToSearch={columnToSearch}
        columnName={columnName}
        actions={children}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground/70"
                >
                  No hay registros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground/60">
          <span className="mr-1">
            {table.getFilteredRowModel().rows.length} registro(s)
          </span>
          {range && (
            <>
              &#x2022; Mostrando registros del{' '}
              {range.from?.toLocaleDateString()} al{' '}
              {range.to?.toLocaleDateString()}
            </>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
}

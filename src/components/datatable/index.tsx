import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
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
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { MenuSelection } from './menu-selection';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnsToSearch?: (keyof TData)[];
  placeholderSearch?: string;
  children?: React.ReactNode;
  handleDeleteSelected?: (data: TData[]) => Promise<boolean>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnsToSearch,
  placeholderSearch,
  handleDeleteSelected,
  children
}: DataTableProps<TData, TValue>) {
  // const [sorting, setSorting] = React.useState<SortingState>([])
  // const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState<string>('');

  const table = useReactTable({
    data,
    columns,
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // for search
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // onRowSelectionChange: setRowSelection,
    state: {
      // sorting,
      // rowSelection,
      columnFilters,
      globalFilter
    },
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue): boolean => {
      if (!columnsToSearch) return false;
      // must be exist data in column
      // if (!columnsToCheck.includes(columnId as keyof CustomerTable)) {
      //   return false;
      // }

      // const cellValue = row.original[columnId];
      // return (
      //   cellValue &&
      //   cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
      // );
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const searchTerms = lowerCaseFilterValue.split(' ').filter(Boolean);

      return columnsToSearch.some((column) => {
        const cellValue = row.original[column as keyof TData];
        if (!cellValue) return false;

        const cellValueString = cellValue.toString().toLowerCase();
        return searchTerms.every((term: string) =>
          cellValueString.includes(term)
        );
        // return (
        //   cellValue &&
        //   cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
        // );
      });
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-2 pb-4">
        {columnsToSearch && columnsToSearch.length > 0 && (
          <div className="relative w-full sm:max-w-lg">
            <Input
              placeholder={placeholderSearch || 'Buscar por...'}
              disabled={table.getFilteredSelectedRowModel().rows.length > 0}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className=""
            />
            {globalFilter.length > 0 && (
              <div
                className="absolute right-3 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-card text-muted-foreground opacity-70 ring-offset-background transition-all hover:bg-background hover:opacity-100 focus:outline-none disabled:pointer-events-none"
                onClick={() => setGlobalFilter('')}
              >
                <Cross2Icon className="h-5 w-5" />
                <span className="sr-only">Clean Input</span>
              </div>
            )}
          </div>
        )}
        <div className="ml-auto flex gap-2">
          {handleDeleteSelected && (
            <MenuSelection
              table={table}
              handleDeleteSelected={handleDeleteSelected}
            />
          )}

          {children && children}
        </div>
      </div>

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
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex w-full flex-col items-center px-2 pt-4 text-muted-foreground">
                    <Icons.check className="h-10 w-10" />
                    <div className="flex flex-col items-center py-4">
                      <div className="text-sm text-muted-foreground">
                        No hay resultados.
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex space-x-2">
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
    </div>
  );
}

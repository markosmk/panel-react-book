import * as React from 'react';

import {
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

interface UseDataTableProps<TData>
  extends Omit<
    TableOptions<TData>,
    | 'state'
    | 'pageCount'
    | 'getCoreRowModel'
    | 'manualFiltering'
    | 'manualPagination'
    | 'manualSorting'
  > {
  // filterFields?: DataTableFilterField<TData>[];
  initialState?: Partial<TableState>;
  columnsToSearch?: (keyof TData)[];
}

export function useDataTable<TData>({
  columnsToSearch = [],
  initialState,
  ...props
}: UseDataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const [pagination, setPagination] = React.useState<PaginationState>(
    initialState?.pagination ?? {
      pageIndex: 0,
      pageSize: 10
    }
  );

  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? []
  );

  const table = useReactTable({
    ...props,
    initialState,
    // pageCount: -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection
      // columnFilters: columnFilters
      // globalFilter
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    // onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(), //depends on getFacetedRowModel
    globalFilterFn: (row, columnId, filterValue): boolean => {
      if (!filterValue) return true;

      const searchTerms = filterValue.toLowerCase().split(' ').filter(Boolean);
      if (searchTerms.length === 0) return true;

      const checkValue = (value: unknown): boolean => {
        if (value == null) return false;
        const valueString = String(value).toLowerCase();
        return searchTerms.every((term: string) => valueString.includes(term));
      };

      if (columnsToSearch.length > 0) {
        return columnsToSearch.some((column) => {
          const value = row.original[column];
          return checkValue(value);
        });
      }

      const visibleColumns = table
        .getAllColumns()
        .filter((column) => column.getIsVisible());
      return visibleColumns.some((column) =>
        checkValue(row.getValue(column.id))
      );
    }
  });

  return { table };
}

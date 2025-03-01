import * as React from 'react';
import type { Row, Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import type { DataTableFilterField } from './data-table.types';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

import { Button } from '@/components/ui/button';
import { cn, formatDateString } from '@/lib/utils';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format: 0000-00-00
const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/; // Format: 00:00:00 o 00:00
function generateOptions<TData>(
  rows: Row<TData>[],
  columnId: string,
  options?: {
    dateRange?: { start: Date; end: Date };
  }
): { value: string; label: string }[] {
  if (rows.length === 0) return [];

  let uniqueValues = Array.from(
    new Set(rows.map((row) => row.getValue(columnId) as string))
  );

  if (options?.dateRange) {
    const { start, end } = options.dateRange;
    const startDateString = start.toISOString().split('T')[0];
    const endDateString = end.toISOString().split('T')[0];

    uniqueValues = uniqueValues.filter((value) => {
      return (
        dateRegex.test(value) &&
        value >= startDateString &&
        value <= endDateString
      );
    });
  }

  return uniqueValues.map((value) => {
    if (dateRegex.test(value)) {
      return {
        value,
        label: formatDateString(value)
      };
    } else if (timeRegex.test(value)) {
      return {
        value,
        label: `${value.slice(0, 5)}hs`
      };
    }
    return {
      value,
      label: value
    };
  });
}

interface DataTableFiltersProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableFilters<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableFiltersProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of filterableColumns
  const filterableColumns = React.useMemo(() => {
    return filterFields
      .filter((field) => table.getColumn(String(field.id)))
      .map((field) => ({
        ...field,
        options: field.options?.length
          ? field.options
          : generateOptions(
              table.getFilteredRowModel().rows,
              field.id,
              field.dateRange ? { dateRange: field.dateRange } : undefined
            )
      }));
  }, [table, filterFields]);

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start justify-between gap-2 lg:flex-row lg:items-center',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {filterableColumns.length > 0 &&
          filterableColumns.map((column) => (
            <DataTableFacetedFilter
              key={String(column.id)}
              column={table.getColumn(column.id)}
              title={column.label}
              options={column.options ?? []}
              helpText={column.helpText}
            />
          ))}
        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

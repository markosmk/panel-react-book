import * as React from 'react';
import type { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { DataTableViewOptions } from './data-table-view-options';
import { useDebounce } from './use-debounce';

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  searchPlaceholder?: string;
  columnsNamesVisibility?: {
    value: keyof TData;
    label: string;
  }[];
  useSelectorVisibility?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Buscar por ...',
  children,
  className,
  columnsNamesVisibility,
  useSelectorVisibility = true,
  ...props
}: DataTableToolbarProps<TData>) {
  const [value, setValue] = React.useState(
    table.getState().globalFilter?.toString() ?? '' ?? ''
  );
  const delay = React.useMemo(() => {
    const rowCount = table.getRowCount();
    if (rowCount > 1000) return 800;
    if (rowCount > 500) return 600;
    if (rowCount > 100) return 300;
    return 100;
  }, [table]);
  const debouncedValue = useDebounce(value, delay);

  React.useEffect(() => {
    table.setGlobalFilter(debouncedValue);
  }, [debouncedValue, table]);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-2',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={table.getFilteredSelectedRowModel().rows.length > 0}
          className="w-full sm:max-w-lg"
        />
        {/* // <Input
                //   placeholder={column.placeholder}
                //   value={
                //     (table
                //       .getColumn(String(column.id))
                //       ?.getFilterValue() as string) ?? ''
                //   }
                //   onChange={(event) =>
                //     table
                //       .getColumn(String(column.id))
                //       ?.setFilterValue(event.target.value)
                //   }
                //   className="h-8 w-40 lg:w-64"
                // />
                // </>
              // )
          // )} */}
      </div>
      {children && children}
      {useSelectorVisibility && (
        <DataTableViewOptions
          table={table}
          columnsNamesVisibility={columnsNamesVisibility}
        />
      )}
    </div>
  );
}

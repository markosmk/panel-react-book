import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnToSearch: string | number | symbol;
  columnName: string;
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  columnToSearch,
  columnName,
  actions
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center pb-4">
      <Input
        placeholder={`Buscar por ${columnName}...`}
        value={
          (table
            .getColumn(columnToSearch as string)
            ?.getFilterValue() as string) ?? ''
        }
        onChange={(event) =>
          table
            .getColumn(columnToSearch as string)
            ?.setFilterValue(event.target.value)
        }
        // value={table.getState()?.globalFilter || ""}
        // onChange={(event) => table.setGlobalFilter(String(event.target.value))}
        className="max-w-sm"
      />
      <div className="ml-auto">{actions && actions}</div>
    </div>
  );
}

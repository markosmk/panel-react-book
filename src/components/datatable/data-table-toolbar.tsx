import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholderSearch?: string;
  actions?: React.ReactNode;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

export function DataTableToolbar<TData>({
  table,
  placeholderSearch = 'Buscar por...',
  globalFilter,
  setGlobalFilter,
  actions
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center pb-4">
      <Input
        placeholder={placeholderSearch}
        value={globalFilter}
        disabled={table.getFilteredSelectedRowModel().rows.length > 0}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full sm:max-w-lg"
      />
      <div className="ml-auto">{actions && actions}</div>
    </div>
  );
}

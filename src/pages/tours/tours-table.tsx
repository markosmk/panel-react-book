import * as React from 'react';
import { Tour } from '@/types/tour.types';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/components/data-table/use-data-table';
import { getColumns } from './tours-column';
import { ToursSelectedActions } from './tours-selected-actions';

export function ToursTable({ data }: { data: Tour[] }) {
  const columns = React.useMemo(() => getColumns(), []);
  const columnsToSearch: (keyof Tour)[] = ['name', 'description', 'price'];

  const { table } = useDataTable<Tour>({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    columnsToSearch
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar
        table={table}
        searchPlaceholder="Buscar Tour por Nombre, Descripcion o Precio..."
        useSelectorVisibility={false}
      >
        <ToursSelectedActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}

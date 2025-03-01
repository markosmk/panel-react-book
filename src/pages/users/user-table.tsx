import * as React from 'react';

import { useDataTable } from '@/components/data-table/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';

import { getColumns } from './user-columns';
import type { UserTable as UserType } from '@/types/user.types';

export function UserTable({ data }: { data: UserType[] }) {
  const columns = React.useMemo(() => getColumns(), []);
  const columnsToSearch: (keyof UserType)[] = ['name', 'email'];

  const { table } = useDataTable<UserType>({
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
        searchPlaceholder="Buscar Usuario por Nombre o Email..."
        useSelectorVisibility={false}
      />
    </DataTable>
  );
}

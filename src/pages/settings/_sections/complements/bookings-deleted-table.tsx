import * as React from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/components/data-table/use-data-table';

import { BookingDelete } from '@/types/booking.types';
import { getColumns } from './bookings-deleted-columns';

export function BookingsDeletedTable({ data }: { data: BookingDelete[] }) {
  const columns = React.useMemo(() => getColumns(), []);
  const columnsToSearch: (keyof BookingDelete)[] = [];

  const { table } = useDataTable<BookingDelete>({
    data,
    columns,
    columnsToSearch
  });

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} useSelectorVisibility={false} />
    </DataTable>
  );
}

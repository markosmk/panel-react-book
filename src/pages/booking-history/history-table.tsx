import * as React from 'react';

import type { DataTableFilterField } from '@/components/data-table/data-table.types';
import { useDataTable } from '@/components/data-table/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableFilters } from '@/components/data-table/data-table-filters';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';

import { BadgeStatus, statusVariant } from '@/components/badge-status';
import { BookingTable, Status } from '@/types/booking.types';

import { getColumns } from './history-columns';

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 10;

export function HistoryTable({ data }: { data: BookingTable[] }) {
  // const [rowAction, setRowAction] =
  //   React.useState<DataTableRowAction<BookingTable> | null>(null);

  const columns = React.useMemo(() => getColumns(), []);

  const filterFields: DataTableFilterField<BookingTable>[] = [
    {
      id: 'tour_name',
      label: 'Tour'
    },
    {
      id: 'status',
      label: 'Estado',
      options: Object.entries(statusVariant)
        .map(([key, { text }]) => ({
          value: key,
          label: text,
          icon: () => <BadgeStatus status={key as Status} useIcon />
        }))
        .filter((o) => o.value !== 'Default')
    }
  ];

  const columnsToSearch: (keyof BookingTable)[] = [
    'customer_name',
    'customer_email',
    'customer_phone'
  ];

  const columnsNamesVisibility: { value: keyof BookingTable; label: string }[] =
    [
      {
        value: 'id',
        label: 'Identificador'
      },
      {
        value: 'customer_name',
        label: 'Cliente'
      },
      {
        value: 'tour_name',
        label: 'Nombre del Tour'
      },
      {
        value: 'schedule_date',
        label: 'Fecha Reserva'
      },
      {
        value: 'quantity',
        label: 'Cantidad'
      },
      {
        value: 'totalPrice',
        label: 'Precio Total'
      },
      {
        value: 'status',
        label: 'Estado'
      },
      {
        value: 'created_at',
        label: 'Fecha Creado'
      }
    ];

  const { table } = useDataTable<BookingTable>({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] },
      pagination: {
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE
      },
      columnVisibility: {
        totalPrice: false,
        id: false
      }
    },
    getRowId: (originalRow) => originalRow.id,
    columnsToSearch
  });

  return (
    <>
      <DataTable
        table={table}
        // floatingBar={<HistoryTableFloatingBar table={table} />}
      >
        <DataTableToolbar
          table={table}
          searchPlaceholder="Buscar por Nombre Cliente, Email o Numero..."
          columnsNamesVisibility={columnsNamesVisibility}
        >
          {/* <DataTableRowsActions
            table={table}
            rowActions={[
              {
                label: 'Archivar',
                disabled: true,
                handleAction(props) {
                  console.log(props);
                }
              }
            ]}
          >
            {/* <HistoryTableActions table={table} /> 
          </DataTableRowsActions> */}
        </DataTableToolbar>
        <DataTableFilters table={table} filterFields={filterFields}>
          <p className="block text-xs text-muted-foreground/70 sm:ml-auto">
            Los horarios están en formato de 24 horas. Los filtros funcionan
            para el periodo seleccionado.
          </p>
        </DataTableFilters>
      </DataTable>
    </>
  );
}

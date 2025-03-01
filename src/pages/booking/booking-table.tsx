import * as React from 'react';

import { useDataTable } from '@/components/data-table/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';

import { getColumns } from './booking-columns';
import type {
  BookingTable as BookingType,
  Status
} from '@/types/booking.types';
import { DataTableFilters } from '@/components/data-table/data-table-filters';
import { DataTableFilterField } from '@/components/data-table/data-table.types';
import { BadgeStatus, statusVariant } from '@/components/badge-status';

const today = new Date();
const todayStartOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);
const fiveDaysFromNow = new Date(
  todayStartOfDay.getFullYear(),
  todayStartOfDay.getMonth(),
  todayStartOfDay.getDate() + 30
);

export function BookingTable({ data }: { data: BookingType[] }) {
  const columns = React.useMemo(() => getColumns(), []);
  const columnsToSearch: (keyof BookingType)[] = [
    'customer_name',
    'customer_email',
    'customer_phone',
    'tour_name',
    'totalPrice',
    'schedule_date',
    'schedule_startTime'
  ];

  const filterFields: DataTableFilterField<BookingType>[] = [
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
    },
    {
      id: 'schedule_date',
      label: 'Fecha Reserva',
      dateRange: {
        start: todayStartOfDay,
        end: fiveDaysFromNow
      },
      helpText: 'filtro hasta los próximos 30 días'
    },
    {
      id: 'schedule_startTime',
      label: 'Horarios'
    },
    {
      id: 'tour_name',
      label: 'Tour'
    }
  ];

  const columnsNamesVisibility: { value: keyof BookingType; label: string }[] =
    React.useMemo(
      () => [
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
          value: 'schedule_startTime',
          label: 'Horario'
        },
        {
          value: 'language',
          label: 'Idioma'
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
      ],
      []
    );

  const { table } = useDataTable<BookingType>({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] },
      columnVisibility: {
        language: false,
        schedule_startTime: false,
        totalPrice: false,
        id: false
      }
    },
    columnsToSearch
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          searchPlaceholder="Buscar por Nombre de Cliente, Email, Telefono, Tour, Precio..."
          columnsNamesVisibility={columnsNamesVisibility}
        ></DataTableToolbar>
        <DataTableFilters table={table} filterFields={filterFields}>
          <p className="block text-xs text-muted-foreground/70 sm:ml-auto">
            Los horarios están en formato de 24 horas.
          </p>
        </DataTableFilters>
      </DataTable>
    </>
  );
}

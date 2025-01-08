import { Table } from '@tanstack/react-table';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Status } from '@/types/booking.types';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { formatDateString } from '@/lib/utils';
import { BadgeStatus, statusVariant } from '@/components/badge-status';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format: 0000-00-00
const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/; // Format: 00:00:00 o 00:00

function generateOptions<TData>(
  table: Table<TData>,
  columnId: string,
  options?: {
    dateRange?: { start: Date; end: Date };
  }
): { value: string; label: string }[] {
  const rows = table.getFilteredRowModel().rows;
  let uniqueValues = Array.from(
    new Set(rows.map((row) => row.getValue(columnId) as string))
  );

  if (options?.dateRange) {
    const { start, end } = options.dateRange;

    const startDateString = start.toISOString().split('T')[0];
    const endDateString = end.toISOString().split('T')[0];

    uniqueValues = uniqueValues.filter((value) => {
      if (!dateRegex.test(value)) return false;
      return value >= startDateString && value <= endDateString;
    });

    // uniqueValues = uniqueValues.filter((value) => {
    //   const date = new Date(value);
    //   return dateRegex.test(value) && date >= start && date <= end;
    // });
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

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const today = new Date();
  const todayStartOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const fiveDaysFromNow = new Date(
    todayStartOfDay.getFullYear(),
    todayStartOfDay.getMonth(),
    todayStartOfDay.getDate() + 5
  );
  const statusOptions = Object.entries(statusVariant).map(
    ([key, { text }]) => ({
      value: key,
      label: text,
      icon: () => <BadgeStatus status={key as Status} useIcon />
    })
  );

  return (
    <div className="flex w-full flex-wrap items-center gap-2 py-4">
      {table.getColumn('status') && (
        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title="Estado"
          options={statusOptions.filter((o) => o.value !== 'Default')}
        />
      )}

      {table.getColumn('schedule_date') && (
        <DataTableFacetedFilter
          column={table.getColumn('schedule_date')}
          title="Fecha Reserva"
          options={generateOptions(table, 'schedule_date', {
            dateRange: {
              start: todayStartOfDay,
              end: fiveDaysFromNow
            }
          })}
          helpText="Solo se muestran las reservas de 5 dias a partir de hoy"
        />
      )}

      {table.getColumn('schedule_startTime') && (
        <DataTableFacetedFilter
          column={table.getColumn('schedule_startTime')}
          title="Horarios"
          options={generateOptions(table, 'schedule_startTime')}
        />
      )}

      {table.getColumn('tour_name') && (
        <DataTableFacetedFilter
          column={table.getColumn('tour_name')}
          title="Tour"
          options={generateOptions(table, 'tour_name')}
        />
      )}

      {isFiltered && (
        <Button
          variant="outline"
          size={'sm'}
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Limpiar
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}

      <p className="block text-xs text-muted-foreground/70 sm:ml-auto">
        Los horarios están en formato de 24 horas.
      </p>
    </div>
  );
}

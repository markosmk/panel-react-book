import { ColumnDef } from '@tanstack/react-table';

import {
  formatDateFriendly,
  formatDateOnly,
  formatDateString,
  formatId,
  formatPrice
} from '@/lib/utils';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { BookingRowActions } from './booking-row-actions';
import { BookingTable } from '@/types/booking.types';
import { BadgeStatus } from '@/components/badge-status';
import { LanguageFlag } from '@/components/language-flag';

export function getColumns(): ColumnDef<BookingTable>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecciona todo"
          className="text-white"
          disabled
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecciona fila"
          disabled
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Identificador" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-2">
            <span className="font-medium italic">
              {formatId(row.getValue('id'))}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Fecha"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col gap-x-2 sm:flex">
          {formatDateFriendly(row.getValue('created_at'))}
          <span className="truncate text-xs text-muted-foreground">
            {formatDateOnly(
              row.getValue('created_at'),
              "EEEE dd 'de' MMM, yyyy"
            )}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'schedule_date',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Fecha Reserva"
          className="hidden md:flex"
        />
      ),
      cell: ({ row }) => {
        // TODO: en un tooltip agregar el desglose de precios
        return (
          <div className="hidden flex-col gap-x-2 md:flex">
            <span className="font-medium italic">
              {formatDateString(row.getValue('schedule_date'))}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.schedule_startTime?.slice(0, 5)}hs
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'customer_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reservado por" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-x-2">
            {row.getValue('customer_name')}
            <span className="truncate text-xs text-muted-foreground">
              {row.original.customer_email ?? 'sin correo'}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'tour_name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Tour"
          className="hidden md:flex"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="hidden min-w-44 flex-col gap-x-2 md:flex">
            {row.getValue('tour_name')}
            <span className="text-xs text-muted-foreground">
              Precio Total:{' '}
              {formatPrice(Number(row.original.totalPrice)) ?? 'N/A'} (
              {row.original.quantity ?? '1'}{' '}
              {`${Number(row.original.quantity) > 1 ? 'personas' : 'persona'}`})
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'schedule_startTime',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Hora"
          className="hidden md:flex"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="hidden min-w-20 flex-col gap-x-2 md:flex">
            <span className="font-medium italic">
              {row.original.schedule_startTime?.slice(0, 5)}hs
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <BadgeStatus status={row.getValue('status')} useIcon />
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Precio Total"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col sm:flex">
          {formatPrice(row.getValue('totalPrice'))}
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'language',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Idioma"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col sm:flex">
          <LanguageFlag language={row.getValue('language')} />
        </div>
      ),
      enableSorting: false
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <BookingRowActions data={row.original} />,
      size: 40
    }
  ];
}

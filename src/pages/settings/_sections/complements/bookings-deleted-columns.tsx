import { ColumnDef } from '@tanstack/react-table';

import { BookingDelete } from '@/types/booking.types';
import { formatDateOnly, formatId, formatPrice } from '@/lib/utils';
import { BadgeStatus } from '@/components/badge-status';

import { BookingDeletedActions } from './bookings-deleted-actions';

export function getColumns(): ColumnDef<BookingDelete>[] {
  return [
    {
      accessorKey: 'id',
      header: () => (
        <div className="text-xs font-semibold uppercase">Identificador</div>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-x-2 font-semibold">
          {formatId(row.getValue('id'))}
        </div>
      )
    },
    {
      accessorKey: 'totalPrice',
      header: () => (
        <div className="hidden text-xs font-semibold uppercase sm:flex">
          Precio
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="hidden font-medium sm:flex">
            {formatPrice(row.getValue('totalPrice'))}
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: () => (
        <div className="text-xs font-semibold uppercase">Estado</div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-start">
            <BadgeStatus status={row.getValue('status')} />
          </div>
        );
      }
    },
    {
      accessorKey: 'deleted_at',
      header: () => (
        <div className="hidden text-xs font-semibold uppercase sm:flex">
          Fecha Eliminado
        </div>
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col gap-x-2 sm:flex">
          {formatDateOnly(row.getValue('deleted_at'), "EEEE dd 'de' MMM, yyyy")}
        </div>
      )
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <BookingDeletedActions data={row.original} />
    }
  ];
}

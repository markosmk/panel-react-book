import type { ColumnDef } from '@tanstack/react-table';
import {
  // Ellipsis,
  UserCheck2
} from 'lucide-react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
import { BadgeStatus } from '@/components/badge-status';

// import { getErrorMessage } from "@/lib/handle-error";
import { BookingTable } from '@/types/booking.types';
import {
  formatDateOnly,
  formatDateString,
  formatId,
  formatPrice,
  formatTimeTo24Hour
} from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { HistoryRowActions } from './history-row-actions';
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
          aria-label="Select all"
          className="translate-y-0.5"
          disabled
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
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
      cell: ({ row }) => (
        <div className="font-medium">{formatId(row.getValue('id'))}</div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'schedule_date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha Reserva" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col space-y-1">
          {formatDateString(row.getValue('schedule_date'))}
          <span className="text-sm text-muted-foreground">
            {formatTimeTo24Hour(row.original.schedule_startTime || '')}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'tour_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre del Tour" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col space-y-1">
            <span className="truncate font-medium">
              {row.getValue('tour_name')}
            </span>
            <span className="text-xs text-muted-foreground">
              Precio p/pers:{' '}
              {formatPrice(Number(row.original.tour_price)) ?? 'N/A'}{' '}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'customer_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cliente" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col space-y-1">
            <span className="truncate font-medium">
              {row.getValue('customer_name')}
            </span>
            <span className="text-sm text-muted-foreground">
              {row.original.customer_email}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="max-w-[5rem] justify-center"
          column={column}
          title="Estado"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex max-w-[5rem] items-center justify-center">
            <BadgeStatus status={row.getValue('status')} useIcon />
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="justify-center"
          column={column}
          title="Cantidad"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <UserCheck2
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="">{row.original.quantity}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      },
      enableSorting: false
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
      ),
      cell: ({ row }) => <span>{formatPrice(row.original.totalPrice)}</span>
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
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha Creado" />
      ),
      cell: ({ cell }) =>
        formatDateOnly(cell.getValue() as Date, 'd MMMM, yyyy (HH:mm)')
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <HistoryRowActions data={row.original} />,
      size: 40
    }
    // {
    //   id: 'actions',
    //   cell: function Cell() {
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button
    //             aria-label="Open menu"
    //             variant="ghost"
    //             className="flex size-8 p-0 data-[state=open]:bg-muted"
    //           >
    //             <Ellipsis className="size-4" aria-hidden="true" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end" className="w-40">
    //           <DropdownMenuItem onSelect={() => {}}>Ver</DropdownMenuItem>
    //           <DropdownMenuItem onSelect={() => {}}>Editar</DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem onSelect={() => {}}>Eliminar</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    //   size: 40
    // }
  ];
}

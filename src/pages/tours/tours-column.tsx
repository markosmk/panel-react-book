import { ColumnDef } from '@tanstack/react-table';

import {
  cn,
  formatDateFriendly,
  formatDateOnly,
  formatPrice
} from '@/lib/utils';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { ToursRowActions } from './tours-row-actions';
import { Icons } from '@/components/icons';
import { Tour } from '@/types/tour.types';

export function getColumns(): ColumnDef<Tour>[] {
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecciona fila"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Nombre"
          className="hidden md:flex"
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-x-2 sm:min-w-52">
            {row.getValue('name')}
            <span className="text-xs text-muted-foreground">
              Dur.: {row.original.duration ?? '0'} - Cap.:{' '}
              {row.original.capacity ?? '0'} personas
            </span>
          </div>
        );
      },
      enableHiding: false
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Precio" />
      ),
      cell: ({ row }) => <div>{formatPrice(row.getValue('price'))}</div>,
      enableHiding: false
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Estado"
          className="hidden lg:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Icons.circle
            className={cn(
              'size-3',
              row.getValue('active') == 1 ? 'text-green-600' : 'text-red-600'
            )}
          />
        </div>
      ),
      enableHiding: false
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
      ),
      enableHiding: false
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ToursRowActions data={row.original} />,
      size: 40
    }
  ];
}

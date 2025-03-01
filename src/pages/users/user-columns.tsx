import { ColumnDef } from '@tanstack/react-table';

import { formatDateOnly } from '@/lib/utils';

import { Checkbox } from '@/components/ui/checkbox';
import { UserTable } from '@/types/user.types';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { UserRowActions } from './user-row-actions';
import { Badge } from '@/components/ui/badge';

export function getColumns(): ColumnDef<UserTable>[] {
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
          <div className="hidden truncate md:flex">{row.getValue('name')}</div>
        );
      },
      enableHiding: false
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Correo Electronico" />
      ),
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      enableHiding: false
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Rol"
          className="hidden lg:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden lg:flex">
          <Badge>{row.getValue('role')}</Badge>
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
        <div className="hidden truncate sm:flex">
          {formatDateOnly(row.getValue('created_at'), "EEEE dd 'de' MMM, yyyy")}
        </div>
      ),
      enableHiding: false
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <UserRowActions data={row.original} />,
      size: 40
    }
  ];
}

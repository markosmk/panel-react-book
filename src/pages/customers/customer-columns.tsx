import { ColumnDef } from '@tanstack/react-table';

import { cn, formatDateFriendly, formatDateOnly } from '@/lib/utils';

import { Icons } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CustomerTable } from '@/types/customer.types';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { toast } from '@/components/notifications';
import { CustomerRowActions } from './customer-row-actions';

// eslint-disable-next-line react-refresh/only-export-components
const CellPhoneWithActions = ({
  phone,
  className
}: {
  phone: string;
  className?: string;
}) => {
  if (!phone) {
    return (
      <div
        className={cn(
          'ml-2 flex items-center px-1 text-xs text-muted-foreground'
        )}
      >
        No Especificado
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          toast.success('Numero copiado al portapapeles');
          navigator.clipboard.writeText(phone);
        }}
        title="Copiar Número"
      >
        {phone} <Icons.copy className="ml-2 size-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(`https://wa.me/${phone}`, '_blank')}
        title="Enviar Whatsapp"
        className="px-2 text-green-600 hover:text-green-500"
      >
        <Icons.whatsapp className="size-4" />
      </Button>
    </div>
  );
};

export function getColumns(): ColumnDef<CustomerTable>[] {
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
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Fecha"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col sm:flex">
          {formatDateFriendly(row.getValue('created_at'))}
          <span className="text-xs text-muted-foreground">
            {formatDateOnly(
              row.getValue('created_at'),
              "EEEE dd 'de' MMM, yyyy"
            )}
          </span>
        </div>
      )
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-x-2">
            {row.getValue('name')}
            <span className="text-xs text-muted-foreground ">
              {row.original.email || 'correo no especificado'}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Telefono"
          className="ml-3 hidden lg:flex"
        />
      ),
      cell: ({ row }) => (
        <CellPhoneWithActions
          phone={row.getValue('phone')}
          className="hidden lg:flex"
        />
      )
    },
    {
      accessorKey: 'total_bookings',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Reservas"
          className="hidden w-full max-w-20 lg:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden w-full items-center justify-center font-medium lg:flex">
          {row.getValue('total_bookings')}
        </div>
      )
    },

    {
      accessorKey: 'about',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Como Conocio ZW"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col sm:flex">{row.getValue('about')}</div>
      ),
      enableSorting: false
    },

    {
      accessorKey: 'hotel',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Hospedaje"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col sm:flex">{row.getValue('hotel')}</div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'origen',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Residencia"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col sm:flex">{row.getValue('origen')}</div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'wantNewsletter',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Newsletter"
          className="hidden sm:flex"
        />
      ),
      cell: ({ row }) => (
        <div className="hidden flex-col sm:flex">
          {row.getValue('wantNewsletter') == '1' ? 'Si' : 'No'}
        </div>
      ),
      enableSorting: false
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <CustomerRowActions data={row.original} />,

      size: 40
    }
  ];
}

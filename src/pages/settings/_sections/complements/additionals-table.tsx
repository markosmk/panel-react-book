import { ColumnDef } from '@tanstack/react-table';

import { Additional } from '@/types/app.types';
import { useModal } from '@/hooks/use-modal';
import { cn, formatDateOnly, formatPrice } from '@/lib/utils';
import { useAdditionals } from '@/services/hooks/additional.query';
import { deleteAdditionalSelected } from '@/services/additional.service';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/datatable';
import { PendingContent } from '@/components/pending-content';
import { DataTableActions } from './data-table-actions';
import { AdditionalForm } from './additional-form';

const columns: ColumnDef<Additional>[] = [
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
    header: () => <div className="text-xs font-semibold uppercase">Nombre</div>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-x-2">{row.getValue('name')}</div>
    )
  },
  {
    accessorKey: 'price',
    header: () => (
      <div className="hidden text-xs font-semibold uppercase sm:flex">
        Price
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden font-medium sm:flex">
          {formatPrice(row.getValue('price'))}
        </div>
      );
    }
  },
  {
    accessorKey: 'active',
    header: () => <div className="text-xs font-semibold uppercase">Estado</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Icons.circle
            className={cn(
              'size-3',
              row.getValue('active') == 1 ? 'text-green-500' : 'text-red-500'
            )}
          />
        </div>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: () => (
      <div className="hidden text-xs font-semibold uppercase sm:flex">
        Creado
      </div>
    ),
    cell: ({ row }) => (
      <div className="hidden flex-col gap-x-2 sm:flex">
        {formatDateOnly(row.getValue('created_at'), "EEEE dd 'de' MMM, yyyy")}
      </div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <DataTableActions data={row.original} />
  }
];

export function AdditionalsTable() {
  const { data, isLoading } = useAdditionals();
  const { openModal, closeModal } = useModal();

  if (isLoading) return <PendingContent withOutText className="h-40" />;
  if (!data) return <>No hay datos</>;

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        columnsToSearch={['name', 'description', 'price']}
        placeholderSearch="Busca por nombre, descripcion, precio"
        handleDeleteSelected={async (data) => {
          if (data.length === 0) throw new Error('Debe seleccionar al menos 1');
          const ids = data.map((item) => item.id);
          await deleteAdditionalSelected({ ids });
          return true;
        }}
      >
        <Button
          type="button"
          onClick={() => {
            openModal({
              title: 'Crear Nuevo',
              component: <AdditionalForm closeModal={closeModal} />
            });
          }}
        >
          Crear Nuevo
        </Button>
      </DataTable>
    </>
  );
}

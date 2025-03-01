import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';

import { cn, formatDateOnly, formatPrice } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Additional } from '@/types/app.types';
// import { AdditionalsRowActions } from './additionals-row-actions';

import { Icons } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableRowAction } from '@/components/data-table/data-table.types';
import { TooltipHelper } from '@/components/tooltip-helper';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Additional> | null>
  >;
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<Additional>[] {
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
      header: () => (
        <div className="text-xs font-semibold uppercase">Nombre</div>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-x-2">{row.getValue('name')}</div>
      )
    },
    {
      accessorKey: 'price',
      header: () => (
        <div className="hidden text-xs font-semibold uppercase sm:flex">
          Precio
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
      header: () => (
        <div className="text-xs font-semibold uppercase">Estado</div>
      ),
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
      // cell: ({ row }) => <AdditionalsRowActions data={row.original} />
      cell: function Cell({ row }) {
        const isMobile = useMediaQuery('(max-width: 640px)');
        return (
          <>
            <div className="hidden justify-end gap-x-1 sm:flex">
              <TooltipHelper content="Ver Item">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRowAction({ row, type: 'show' })}
                >
                  <Icons.look className="size-5" />
                </Button>
              </TooltipHelper>
              <TooltipHelper content="Editar">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRowAction({ row, type: 'edit' })}
                  title="Editar"
                >
                  <Icons.edit className="size-5" />
                </Button>
              </TooltipHelper>
              <TooltipHelper content="Eliminar">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setRowAction({ row, type: 'delete' })}
                  title="Eliminar"
                >
                  <Icons.remove className="size-5" />
                </Button>
              </TooltipHelper>
            </div>

            {isMobile && (
              <div className="inline-flex sm:hidden">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 data-[state=open]:bg-background"
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setRowAction({ row, type: 'show' })}
                    >
                      <Icons.look className="mr-2 size-4" />
                      Ver Item
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setRowAction({ row, type: 'edit' })}
                    >
                      <Icons.copy className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setRowAction({ row, type: 'delete' })}
                    >
                      <Icons.remove className="mr-2 size-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </>
        );
      },
      size: 40
    }
  ];
}

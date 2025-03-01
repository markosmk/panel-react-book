import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { deleteAdditionalSelected } from '@/services/additional.service';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export function SelectedActions<TData>({ table }: { table: Table<TData> }) {
  const queryClient = useQueryClient();
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const { openConfirm } = useConfirmStore();

  const handleDelete = async () => {
    openConfirm({
      title: '¿Seguro que quieres Eliminarlos?',
      description: `Esta acción no se puede deshacer.\nHaz click en "Si, Continuar" y eliminar los items seleccionados.`,
      onConfirm: async () => {
        const selectedRows = table.getSelectedRowModel()?.flatRows || [];
        const selectedData = selectedRows.map((row) => row.original) as TData &
          { id: string }[];
        if (selectedData.length === 0)
          throw new Error('Debe seleccionar al menos 1');
        const ids = selectedData.map((item) => item.id);
        await deleteAdditionalSelected({ ids });
      },
      messageSuccess: 'Items eliminados correctamente.',
      onSuccess: () => {
        table.resetRowSelection();
        queryClient.invalidateQueries({ queryKey: ['additionals'] });
      }
    });
  };

  return (
    <div
      className={cn(
        'ml-auto hidden',
        table.getFilteredSelectedRowModel().rows.length > 0 && 'flex'
      )}
    >
      <DropdownMenu
        open={isOpenMenu}
        onOpenChange={(prev) => {
          setIsOpenMenu(prev);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto truncate data-[state=open]:bg-muted"
          >
            <div className="flex truncate">
              <span className="mr-2 hidden sm:flex">Seleccionados</span>
              {table.getFilteredSelectedRowModel().rows.length > 0 &&
                '(' + table.getFilteredSelectedRowModel().rows.length + ')'}
            </div>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem onClick={handleDelete}>
            <Icons.remove className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

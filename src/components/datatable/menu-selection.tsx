import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { toast } from '../notifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { DialogConfirm } from '../dialog-confirm';
import { Icons } from '../icons';

export function MenuSelection<TData>({
  table,
  handleDeleteSelected
}: {
  table: Table<TData>;
  handleDeleteSelected: (data: TData[]) => Promise<boolean>;
}) {
  const queryClient = useQueryClient();
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [isOpenDialogDelete, setOpenDialogDelete] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsPending(true);
      const selectedRows = table.getSelectedRowModel()?.flatRows || [];
      const selectedData = selectedRows.map((row) => row.original) as TData[];
      await handleDeleteSelected(selectedData);
      table.resetRowSelection();
      queryClient.invalidateQueries({ queryKey: ['additionals'] });
      toast.success('Items eliminados correctamente.');
      setTimeout(() => {
        setOpenDialogDelete(false);
      }, 150);
    } catch (error) {
      console.log(error);
      toast.error('Error al eliminar los items.');
    } finally {
      setIsPending(false);
    }
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
          // if (isPending) return;
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
          <DropdownMenuItem
            onClick={() => setOpenDialogDelete(true)}
            disabled={isPending}
          >
            {isPending ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.remove className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Procesando...' : 'Eliminar'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogConfirm
        title={`¿Seguro que quieres Eliminarlos?`}
        description={`Esta acción no se puede deshacer.\nHaz click en "Si, Continuar" y eliminar los items seleccionados.`}
        onConfirm={handleDelete}
        isOpen={isOpenDialogDelete}
        onOpenChange={setOpenDialogDelete}
        isProcessing={isPending}
      />
    </div>
  );
}

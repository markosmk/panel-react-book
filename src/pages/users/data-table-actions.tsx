import * as React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { useModal } from '@/hooks/use-modal';
import { formatDateOnly } from '@/lib/utils';
import { useDeleteUser } from '@/services/hooks/user.mutation';
import { UserTable } from '@/types/user.types';
import { useMediaQuery } from '@/hooks/use-media-query';

import { Icons } from '@/components/icons';
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
import { DialogConfirm } from '@/components/dialog-confirm';
import { Card } from '@/components/ui/card';
import { FormUser } from './form-edit-user';
import { toast } from '@/components/notifications';

function ItemInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-1 space-y-1">
      <p className="text-xs text-muted-foreground">{label}:</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function DetailModal({ detail }: { detail: UserTable }) {
  return (
    <div className="relative flex flex-col gap-2">
      <div className="my-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información del Usuario
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
              <div className="grid w-full grid-cols-2 gap-2">
                <ItemInfo label="Nombre" value={detail.name} />
                <ItemInfo label="Nombre Usuario" value={detail.username} />
                <ItemInfo label="Email" value={detail.email} />
                <ItemInfo label="Rol" value={detail.role} />
              </div>
            </li>
          </ul>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        ultima actualizacion: {formatDateOnly(detail.updated_at)}
      </p>
    </div>
  );
}

export function ActionsDataTable({ data }: { data: UserTable }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [openDialog, setOpenDialog] = React.useState(false);
  const { mutateAsync, isPending } = useDeleteUser();
  const { openModal, closeModal } = useModal();

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles de Usuario',
      description: 'registro creado el ' + formatDateOnly(data.created_at),
      component: <DetailModal detail={data} />
    });
  };

  const handleOpenEdit = () => {
    openModal({
      title: 'Editar Usuario',
      description: 'ultima actualizacion el ' + formatDateOnly(data.updated_at),
      component: <FormUser data={data} closeModal={closeModal} />
    });
  };

  const handleDelete = async () => {
    await mutateAsync(data.id, {
      onSuccess: (data) => {
        const message = data?.data?.message;
        toast.success(message || 'Usuario eliminado correctamente.');
        setTimeout(() => {
          setOpenDialog(false);
        }, 150);
      }
    });
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Ver Usuario">
          <Button variant="outline" size="icon" onClick={handleOpenDetails}>
            <Icons.look className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Editar">
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenEdit}
            title="Editar"
          >
            <Icons.edit className="h-4 w-4" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Eliminar">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpenDialog(true)}
            title="Eliminar"
          >
            <Icons.remove className="h-4 w-4" />
          </Button>
        </TooltipHelper>
      </div>

      {isMobile && (
        <div className="inline-flex sm:hidden">
          <DropdownMenu>
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
              <DropdownMenuItem onClick={handleOpenDetails}>
                <Icons.look className="mr-2 size-4" />
                Ver Usuario
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEdit}>
                <Icons.copy className="mr-2 h-4 w-4" /> Editar Usuario
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                <Icons.remove className="mr-2 size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <DialogConfirm
        title={`¿Seguro que quieres Eliminar a: ${data.name}?`}
        description={`Esta acción no se puede deshacer.\nHaz click en "Si, Continuar" para eliminar el usuario.`}
        onConfirm={handleDelete}
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        isProcessing={isPending}
      />
    </>
  );
}

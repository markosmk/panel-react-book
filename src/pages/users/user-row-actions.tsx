import { MoreHorizontalIcon } from 'lucide-react';

import { formatDateOnly } from '@/lib/utils';
import { UserTable } from '@/types/user.types';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { useModalStore } from '@/utils/modal/use-modal-store';

import { TooltipHelper } from '@/components/tooltip-helper';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserForm } from './user-form';
import { UserDetail } from './user-detail';
import { useDeleteUser } from '@/services/hooks/user.mutation';
import { useAuthStore } from '@/stores/use-auth-store';

export function UserRowActions({ data }: { data: UserTable }) {
  const { user } = useAuthStore();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal, closeModal } = useModalStore();
  const { openConfirm } = useConfirmStore();
  const { mutateAsync } = useDeleteUser();

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles de Usuario',
      description: 'registro creado el ' + formatDateOnly(data.created_at),
      content: <UserDetail data={data} />
    });
  };

  const handleOpenEdit = () => {
    openModal({
      title: 'Editar Usuario',
      description: 'ultima actualizacion el ' + formatDateOnly(data.updated_at),
      content: <UserForm data={data} closeModal={closeModal} />
    });
  };

  const handleConfirmDelete = () => {
    openConfirm({
      title: 'Eliminar Usuario',
      description: `¿Esta seguro de eliminar este usuario: ${data.name}?`,
      onConfirm: async () => {
        await mutateAsync(data.id, {});
      },
      messageSuccess: 'Usuario eliminado correctamente.'
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
        <TooltipHelper content="Editar Usuario">
          <Button variant="outline" size="icon" onClick={handleOpenEdit}>
            <Icons.edit className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Eliminar Usuario">
          <Button
            variant="outline"
            size="icon"
            onClick={handleConfirmDelete}
            disabled={user?.id === data.id}
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
              <DropdownMenuItem onClick={handleOpenDetails}>
                <Icons.look className="mr-2 size-4" />
                Ver Usuario
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEdit}>
                <Icons.edit className="mr-2 size-4" /> Editar Usuario
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleConfirmDelete}
                disabled={user?.id === data.id}
              >
                <Icons.remove className="mr-2 size-4" /> Eliminar Usuario
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}

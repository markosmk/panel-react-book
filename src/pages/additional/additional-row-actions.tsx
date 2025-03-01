import { MoreHorizontalIcon } from 'lucide-react';

import { formatDateOnly } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAdditionalDelete } from '@/services/hooks/additional.mutation';

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

import { Additional } from '@/types/app.types';
import { useModalStore } from '@/utils/modal/use-modal-store';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { AdditionalForm } from './additional-form';
import { AdditionalDetail } from './additional-detail';

export function AdditionalRowActions({ data }: { data: Additional }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal, closeModal } = useModalStore();
  const { openConfirm } = useConfirmStore();
  const { mutateAsync } = useAdditionalDelete();

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles Item',
      description: 'registro creado el ' + formatDateOnly(data.created_at),
      content: <AdditionalDetail detail={data} />
    });
  };

  const handleOpenEdit = () => {
    openModal({
      title: 'Editar Item',
      description: 'ultima actualizacion el ' + formatDateOnly(data.updated_at),
      content: <AdditionalForm data={data} closeModal={closeModal} />
    });
  };

  const handleDelete = async () => {
    openConfirm({
      title: '¿Seguro que quieres Eliminar?',
      description: `Esta acción no se puede deshacer.\nHaz click en "Confirmar" para eliminar el item.`,
      onConfirm: async () => {
        await mutateAsync(data.id);
      }
    });
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Ver Item">
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
            <Icons.edit className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Eliminar">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
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
              <DropdownMenuItem onClick={handleOpenDetails}>
                <Icons.look className="mr-2 size-4" />
                Ver Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEdit}>
                <Icons.copy className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Icons.remove className="mr-2 size-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}

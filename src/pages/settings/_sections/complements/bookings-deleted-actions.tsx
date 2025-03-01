import { ArchiveRestoreIcon, MoreHorizontalIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import axiosApp from '@/lib/axios';
import { useMediaQuery } from '@/hooks/use-media-query';
import { BookingDelete } from '@/types/booking.types';
import { formatDateOnly, formatId } from '@/lib/utils';
import { useModalStore } from '@/utils/modal/use-modal-store';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { getBookingById } from '@/services/booking.service';

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

import { BookingDetail } from '@/pages/booking/_components/booking-detail';

export function BookingDeletedActions({ data }: { data: BookingDelete }) {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal } = useModalStore();
  const { openConfirm } = useConfirmStore();

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles Reserva ' + formatId(data.id),
      description: 'creado el ' + formatDateOnly(data.created_at),
      fetchData: async (signal) => {
        const response = await getBookingById(data.id, signal, true);
        return <BookingDetail detail={response.data} />;
      }
    });
  };

  const handleConfirmDelete = async () => {
    openConfirm({
      title: 'Eliminar Reserva ' + formatId(data.id),
      description: `Esta acción no se puede deshacer.\nHaz click en "Si, Continuar" para eliminar el item.`,
      onConfirm: async () => axiosApp.delete(`/bookings/${data.id}/delete`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bookingsDeleted'] });
      },
      messageSuccess: 'Item eliminado correctamente.'
    });
  };

  const handleConfirmRestore = () => {
    openConfirm({
      title: 'Restaurar Reserva ' + formatId(data.id),
      description:
        'Al continuar, el item se restaurará y podrá ser visualizado nuevamente en lista de Reservas.\n\n Validaremos si hay aún disponibilidad para la fecha y horario en que estaba, ademas se reseteará el idioma si hubiera uno seleccionado.',
      onConfirm: async () => axiosApp.patch(`/bookings/${data.id}/restore`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bookingsDeleted'] });
      },
      messageSuccess: 'Item restaurado correctamente.'
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
        <TooltipHelper content="Restaurar">
          <Button
            variant="outline"
            size="icon"
            onClick={handleConfirmRestore}
            title="Restaurar"
          >
            <ArchiveRestoreIcon className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Eliminar Completamente">
          <Button
            variant="outline"
            size="icon"
            onClick={handleConfirmDelete}
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
              <DropdownMenuItem onClick={handleConfirmRestore}>
                <Icons.copy className="mr-2 h-4 w-4" /> Restaurar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleConfirmDelete}>
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

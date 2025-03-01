import * as React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { useDeleteBooking } from '@/services/hooks/booking.mutation';
import {
  formatDateOnly,
  formatDateString,
  formatId,
  formatTimeTo24Hour
} from '@/lib/utils';
import type { BookingTable } from '@/types/booking.types';
import { getBookingById } from '@/services/booking.service';

import { Icons } from '@/components/icons';
import { TooltipHelper } from '@/components/tooltip-helper';
import { Button } from '@/components/ui/button';
import { FastEditingPopover } from './fast-editing-popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { toast } from '@/components/notifications';
import { DialogConfirm } from '@/components/dialog-confirm';
import { FormChangeStatus } from './form-change-status';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useModalStore } from '@/utils/modal/use-modal-store';
import { BookingEditForm } from './_components/booking-edit-form';
import { BookingDetail } from './_components/booking-detail';

export function BookingRowActions({ data: booking }: { data: BookingTable }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal, closeModal } = useModalStore();
  const { mutateAsync, isPending } = useDeleteBooking();

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles Reserva ' + formatId(booking.id),
      description: 'creado el ' + formatDateOnly(booking.created_at),
      fetchData: async (signal) => {
        const response = await getBookingById(booking.id, signal);
        return <BookingDetail detail={response.data} />;
      }
    });
  };

  const handleOpenEdit = () => {
    openModal({
      title: 'Editar Reserva ' + formatId(booking.id),
      description: 'creado el ' + formatDateOnly(booking.created_at),
      fetchData: async (signal) => {
        const response = await getBookingById(booking.id, signal);
        return <BookingEditForm data={response.data} closeModal={closeModal} />;
      }
    });
  };

  // used in mobile
  const handleOpenEditStatus = () => {
    const dateFormated = booking.schedule_date
      ? formatDateString(booking.schedule_date)
      : '';
    const timeFormated = booking.schedule_startTime
      ? formatTimeTo24Hour(booking.schedule_startTime)
      : '';
    openModal({
      title: 'Editar Estado de Reserva',
      description:
        'Tour: ' +
        booking.tour_name +
        ' - Cliente: ' +
        booking.customer_name +
        ' - Fecha/Horario: ' +
        dateFormated +
        ' / ' +
        timeFormated,
      content: (
        <FormChangeStatus
          booking={booking}
          setIsOpen={closeModal}
          setHasUnsavedChanges={() => {}}
        />
      )
    });
  };

  const handleDelete = async () => {
    await mutateAsync(booking.id, {
      onSuccess: (data) => {
        const message = data?.data?.message;
        toast.success(message || 'Reserva eliminada correctamente.');
        setTimeout(() => {
          setOpenDialog(false);
        }, 150);
      }
    });
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Vista Rápida">
          <Button variant="outline" size="icon" onClick={handleOpenDetails}>
            <Icons.look className="size-5" />
          </Button>
        </TooltipHelper>

        <TooltipHelper content="Editar Reserva">
          <Button
            variant="outline"
            size="icon"
            title="Editar"
            onClick={handleOpenEdit}
          >
            <Icons.edit className="size-5" />
          </Button>
        </TooltipHelper>

        <FastEditingPopover booking={booking} />

        <TooltipHelper content="Eliminar">
          <Button
            variant="outline"
            size="icon"
            title="Eliminar"
            onClick={() => setOpenDialog(true)}
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
                Vista Rápida
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEditStatus}>
                <Icons.transform className="mr-2 size-4" />
                Cambiar Estado
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
        title={`¿Seguro que quieres Eliminar la Reserva de: ${booking.customer_name}?`}
        description={`Al eliminar esta reserva:\n- Se liberarán los lugares reservados\n- El registro del cliente se mantendrá en el sistema\n- La reserva será desactivada del sistema\n\nHaz click en "Si, Continuar" para confirmar.`}
        onConfirm={handleDelete}
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        isProcessing={isPending}
      />
    </>
  );
}

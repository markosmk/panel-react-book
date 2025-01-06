import * as React from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { useModal } from '@/hooks/use-modal';
import { useDeleteBooking } from '@/services/hooks/booking.mutation';
import {
  cn,
  formatDateOnly,
  formatDateString,
  formatPrice,
  formatTimeTo24Hour
} from '@/lib/utils';
import { BookingDetail, BookingTable } from '@/types/booking.types';
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
import { statusVariant } from '@/components/badge-status';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/notifications';
import { DialogConfirm } from '@/components/dialog-confirm';
import { FormChangeStatus } from './form-change-status';
import { useMediaQuery } from '@/hooks/use-media-query';

function DetailBooking({ detail }: { detail: BookingDetail }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const isLargeContent = React.useMemo(
    () =>
      detail.tourData?.content.length && detail.tourData?.content.length > 500,
    [detail.tourData]
  );
  return (
    <div className="relative flex flex-col gap-2">
      <Alert
        variant="default"
        className={cn('px-1 pb-1 pt-6', statusVariant[detail.status]?.bgColor)}
      >
        <div className="mb-4 text-center text-xl font-bold">
          {statusVariant[detail.status].text}
        </div>
        <div className="grid grid-cols-2 gap-4 rounded-md bg-accent py-4">
          <div className="text-center">
            <span className="block text-xs uppercase text-muted-foreground">
              Cantidad Reserva:
            </span>
            <span className="block text-sm font-medium">{detail.quantity}</span>
          </div>
          <div className="text-center">
            <span className="block text-xs uppercase text-muted-foreground">
              Total a Pagar:
            </span>
            <span className="block text-sm font-medium">
              {formatPrice(Number(detail.totalPrice))}
            </span>
          </div>
        </div>
      </Alert>

      <div className="my-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información del Cliente
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
              <div className="grid w-full grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Nombre:</p>
                  <p className="font-semibold">{detail.customer?.name}</p>
                </div>
                <div className="col-span-1 space-y-1">
                  <p className="truncate text-xs text-muted-foreground">
                    Numero Telefono:
                  </p>
                  <p className="font-semibold">{detail.customer?.phone}</p>
                </div>
                <div className="col-span-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Email:</p>
                  <p className="font-semibold">{detail.customer?.email}</p>
                </div>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <div className="my-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información del Horario Seleccionado
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
              <div className="grid w-full grid-cols-3 gap-2">
                <div className="col-span-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Dia:</p>
                  <p className="font-semibold">
                    {formatDateOnly(detail.schedule?.date, 'dd/MM/yyyy')}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Desde:</p>
                  <p className="font-semibold">{detail.schedule?.startTime}</p>
                </div>
                <div className="col-span-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Hasta:</p>
                  <p className="font-semibold">{detail.schedule?.endTime}</p>
                </div>
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información del Adicional Agregado
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            {!detail.aditionalData ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                No hay Adicionales agregados
              </p>
            ) : (
              detail.aditionalData?.map((additional) => (
                <li
                  key={additional.id}
                  className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0"
                >
                  <div className="grid w-full grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs text-muted-foreground">Nombre:</p>
                      <p className="font-semibold">{additional.name}</p>
                    </div>
                    <div className="col-span-1 space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Precio Individual:
                      </p>
                      <p className="font-semibold">
                        {formatPrice(Number(additional.price))}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-2">
        <h4 className="text-xs uppercase text-muted-foreground">
          Información del Tour Reservado
        </h4>

        <Card className="mt-3 overflow-hidden">
          <ul className="flex flex-col">
            <li className="inline-flex flex-wrap items-center gap-x-2 border-b px-4 py-3 text-sm first:mt-0 last:border-b-0">
              <div className="grid w-full grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Nombre:</p>
                  <p className="font-semibold">{detail.tourData?.name}</p>
                </div>
                <div className="col-span-1 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Precio Individual:
                  </p>
                  <p className="font-semibold">
                    {formatPrice(Number(detail.tourData?.price))}
                  </p>
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Duración:</p>
                  <p className="font-semibold">{detail.tourData?.duration}</p>
                </div>

                <div className="col-span-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Capacidad:</p>
                  <p className="font-semibold">{detail.tourData?.capacity}</p>
                </div>

                <div className="col-span-3 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Descripción Tour:
                  </p>
                  <div
                    className={cn(
                      `relative w-full`,
                      isExpanded ? 'max-h-full' : 'max-h-32 overflow-hidden'
                    )}
                  >
                    <p className="whitespace-pre-line font-normal">
                      {detail.tourData?.content}
                    </p>
                    {isLargeContent && !isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-52 w-full bg-gradient-to-t from-background" />
                    )}
                  </div>
                  {isLargeContent && (
                    <div className="w-full text-center">
                      <Button
                        size={'sm'}
                        variant={'outline'}
                        onClick={() => setIsExpanded((prev) => !prev)}
                      >
                        {isExpanded ? 'Ver menos' : 'Ver más'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Ultima Actualización:
                  </p>
                  <p className="font-normal">
                    {detail.tourData?.last_updated &&
                      formatDateOnly(detail.tourData?.last_updated)}
                  </p>
                </div>
              </div>

              {/* {row.observation && (
                        <div className="mt-4 flex w-full flex-row">
                          <Icons.info className="mr-1 h-4 w-4 text-muted-foreground/70" />
                          <div className="flex-1 text-xs text-muted-foreground/70">{row.observation}</div>
                        </div>
                      )} */}
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export function DataTableActions({ data: booking }: { data: BookingTable }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal, closeModal } = useModal();
  const { mutateAsync, isPending } = useDeleteBooking();

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles de la Reserva',
      description: 'creado el ' + formatDateOnly(booking.created_at),
      fetchData: async (signal) => {
        const response = await getBookingById(booking.id, signal);
        return <DetailBooking detail={response.data} />;
      }
    });
  };

  const handleOpenEdit = () => {
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
      component: (
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
        }, 100);
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
                Vista Rápida
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEdit}>
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
        description={`Esta acción no se puede deshacer. Se eliminara la reserva y los datos del cliente.\nTen en cuenta que esto puede implicar cambios en las estadisticas.\nHaz click en "Si, Continuar" para eliminar la reserva.`}
        onConfirm={handleDelete}
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        isProcessing={isPending}
      />
    </>
  );
}

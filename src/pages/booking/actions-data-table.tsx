import { Icons } from '@/components/icons';
import { TooltipHelper } from '@/components/tooltip-helper';
import { Button, buttonVariants } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal';
import { Link } from 'react-router-dom';
import { FastEditingPopover } from './fast-editing-popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn, formatDateOnly, formatDuration, formatPrice } from '@/lib/utils';
import { MoreHorizontalIcon } from 'lucide-react';
import { BookingDetail, BookingTable } from '@/types/booking.types';
import { getBookingById } from '@/services/booking.service';
import { BadgeStatus } from '@/components/badge-status';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import * as React from 'react';

function DetailBooking({ detail }: { detail: BookingDetail }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Limitar la altura del contenido
  const contentStyle = isExpanded
    ? 'max-h-full' // Si está expandido, mostrar todo
    : 'max-h-32 overflow-hidden'; // Si no, limitar a 32px

  return (
    <div className="relative flex flex-col gap-2">
      <div className="absolute left-0 right-0 top-2 z-10 flex items-center justify-center gap-2">
        <BadgeStatus status={detail.status} className="rounded-2xl sm:h-8" />
      </div>

      <Alert variant={'default'} className="mt-6 bg-accent">
        <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-xs text-muted-foreground">Precio:</p>
                  <p className="font-semibold">
                    {formatPrice(Number(detail.tourData?.price))}
                  </p>
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Duración:</p>
                  <p className="font-semibold">
                    {formatDuration(detail.tourData?.duration ?? 0)}
                  </p>
                </div>

                <div className="col-span-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Capacidad:</p>
                  <p className="font-semibold">{detail.tourData?.capacity}</p>
                </div>

                <div className="col-span-3 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Descripción Tour:
                  </p>
                  <div className={`relative ${contentStyle} w-full`}>
                    <p className="whitespace-pre-line font-normal">
                      {detail.tourData?.content}
                    </p>
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-52 w-full bg-gradient-to-t from-background" />
                    )}
                  </div>
                  <div className="w-full text-center">
                    <Button
                      size={'sm'}
                      variant={'outline'}
                      onClick={toggleExpand}
                      className=""
                    >
                      {isExpanded ? 'Ver menos' : 'Ver más'}
                    </Button>
                  </div>
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

export function ActionsDataTable({ data: booking }: { data: BookingTable }) {
  const { openModal } = useModal();

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

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Vista Rápida">
          {/* <Link
            to={`/bookings/${booking.id}`}
            className={buttonVariants({
              variant: 'outline',
              size: 'icon'
            })}
          > */}
          <Button variant="outline" size="icon" onClick={handleOpenDetails}>
            <Icons.look className="size-5" />
          </Button>
          {/* </Link> */}
        </TooltipHelper>
        <TooltipHelper content="Editar Reserva">
          <Link
            to={`/bookings/${booking.id}`}
            title="Editar Reserva"
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'icon'
              }),
              'pointer-events-none opacity-50'
            )}
          >
            <Icons.edit className="size-5" />
          </Link>
        </TooltipHelper>

        <FastEditingPopover booking={booking} />

        <TooltipHelper content="Eliminar">
          <Button variant="outline" size="icon" disabled>
            <Icons.remove className="size-5" />
          </Button>
        </TooltipHelper>
      </div>
      <div className="inline-flex sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/bookings/${booking.id}`}>
                <Icons.look className="mr-2 size-4" />
                Vista Rápida
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/bookings/${booking.id}`}>
                <Icons.edit className="mr-2 size-4" />
                Editar Reserva
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Icons.transform className="mr-2 size-4" />
              Cambiar Estado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Icons.remove className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

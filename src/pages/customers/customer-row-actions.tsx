import { MoreHorizontalIcon } from 'lucide-react';

import { formatDateOnly } from '@/lib/utils';
import { CustomerTable } from '@/types/customer.types';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getBookingsByCustomerId } from '@/services/customer.service';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { useModalStore } from '@/utils/modal/use-modal-store';
import { useDeleteCustomer } from '@/services/hooks/customer.mutation';

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
import { toast } from '@/components/notifications';
import { CustomerForm } from './customer-form';
import { CustomerDetail } from './customer-detail';
import { CustomerBookings } from './customer-bookings';

export function CustomerRowActions({ data }: { data: CustomerTable }) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { openModal, closeModal } = useModalStore();
  const { openConfirm } = useConfirmStore();
  const { mutateAsync } = useDeleteCustomer();

  const handleOpenDetails = () => {
    openModal({
      title: 'Detalles del Cliente',
      description: 'creado el ' + formatDateOnly(data.created_at),
      content: <CustomerDetail data={data} />
    });
  };

  const handleOpenBookings = () => {
    const totalBookings = isNaN(Number(data.total_bookings))
      ? 0
      : Number(data.total_bookings);
    openModal({
      title: 'Reservas de Cliente',
      description: `Tiene un total de ${totalBookings} reservas. ${totalBookings > 7 ? 'Solo se muestran las ultimas 7 reservas.' : ''}`,
      fetchData: async (signal) => {
        if (totalBookings === 0) {
          return <CustomerBookings data={[]} />;
        }
        const response = await getBookingsByCustomerId(data.id, signal);
        return <CustomerBookings data={response.data} />;
      }
    });
  };

  const handleOpenEdit = () => {
    openModal({
      title: 'Detalles del Cliente',
      description: 'creado el ' + formatDateOnly(data.created_at),
      content: <CustomerForm data={data} closeModal={closeModal} />
    });
  };

  const handleConfirmDelete = () => {
    openConfirm({
      title: 'Eliminar Cliente',
      description: `¿Esta seguro de eliminar este cliente: ${data.name}?`,
      onConfirm: async () => {
        await mutateAsync(data.id, {});
      },
      messageSuccess: 'Cliente eliminado correctamente.'
    });
  };

  return (
    <>
      <div className="hidden justify-end gap-x-1 sm:flex">
        <TooltipHelper content="Ver Cliente">
          <Button variant="outline" size="icon" onClick={handleOpenDetails}>
            <Icons.look className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Ver Reservas">
          <Button variant="outline" size="icon" onClick={handleOpenBookings}>
            <Icons.calendar className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Editar Cliente">
          <Button variant="outline" size="icon" onClick={handleOpenEdit}>
            <Icons.edit className="size-5" />
          </Button>
        </TooltipHelper>
        <TooltipHelper content="Eliminar Cliente">
          <Button variant="outline" size="icon" onClick={handleConfirmDelete}>
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
                onClick={() => {
                  toast.success('Numero copiado al portapapeles');
                  navigator.clipboard.writeText(data.phone);
                }}
              >
                <Icons.copy className="mr-2 size-4" />
                Copiar Numero
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenDetails}>
                <Icons.look className="mr-2 size-4" />
                Ver Cliente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenBookings}>
                <Icons.calendar className="mr-2 size-4" /> Ver Reservas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenEdit}>
                <Icons.edit className="mr-2 size-4" /> Editar Cliente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleConfirmDelete}>
                <Icons.remove className="mr-2 size-4" /> Eliminar Cliente
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}

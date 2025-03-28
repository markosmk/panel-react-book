import { formatDateOnly, formatId } from '@/lib/utils';
import type { BookingTable } from '@/types/booking.types';
import { getBookingById } from '@/services/booking.service';

import { Icons } from '@/components/icons';
import { TooltipHelper } from '@/components/tooltip-helper';
import { Button } from '@/components/ui/button';

import { useModalStore } from '@/utils/modal/use-modal-store';
import { BookingDetail } from '../booking/_components/booking-detail';

export function HistoryRowActions({ data: booking }: { data: BookingTable }) {
  const { openModal } = useModalStore();

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

  return (
    <div className="hidden justify-end gap-x-1 sm:flex">
      <TooltipHelper content="Vista Rápida">
        <Button variant="outline" size="icon" onClick={handleOpenDetails}>
          <Icons.look className="size-5" />
        </Button>
      </TooltipHelper>
    </div>
  );
}

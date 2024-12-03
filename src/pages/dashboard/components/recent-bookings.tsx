import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn, formatDateFriendly } from '@/lib/utils';
import { DialogBooking } from './dialog-booking';
import { DashboardBooking } from '@/types/dashboard.types';

function DotIcon({ className }: { className?: string }) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 256 256"
      enableBackground="new 0 0 256 256"
      xmlSpace="preserve"
      className={cn('mr-2 size-3', className)}
    >
      <path
        fill="currentColor"
        d="M10,128c0,65.2,52.9,118,118,118c65.2,0,118-52.9,118-118c0-65.2-52.8-118-118-118C62.9,10,10,62.8,10,128z"
      />
    </svg>
  );
}

function Actions() {
  return (
    <div className="flex gap-x-2">
      <DialogBooking />
      <Select defaultValue="pending">
        <SelectTrigger className="ml-auto w-[145px]" defaultValue={'pending'}>
          <SelectValue placeholder="Cambiar Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">
            <span className="flex items-center">
              <DotIcon className="text-orange-400" />
              Pendiente
            </span>
          </SelectItem>
          <SelectItem value="confirmed">
            <span className="flex items-center">
              <DotIcon className="text-green-400" />
              Confirmado
            </span>
          </SelectItem>
          <SelectItem value="canceled">
            <span className="flex items-center">
              <DotIcon className="text-red-400" />
              Cancelado
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default function RecentBookings({
  data,
  isLoading
}: {
  data: DashboardBooking[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div className="p-5">Cargando REcents...</div>;
  }
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {/* <div className="text-sm font-medium"></div> */}
        <div className="grid gap-6">
          {data &&
            data.map((booking) => (
              <div
                key={booking.booking_id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/avatars/03.png" />
                    <AvatarFallback className="uppercase">
                      {booking.customer_name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {booking.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateFriendly(booking.booking_created_at)}
                    </p>
                  </div>
                </div>
                <Actions />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

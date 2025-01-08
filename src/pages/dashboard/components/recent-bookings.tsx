import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDateFriendly } from '@/lib/utils';
import { DashboardBooking } from '@/types/dashboard.types';

export default function RecentBookings({
  data,
  isLoading
}: {
  data: DashboardBooking[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div className="p-5">Cargando Recientes...</div>;
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
                {/* <Actions /> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

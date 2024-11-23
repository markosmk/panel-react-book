import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DialogBooking } from './dialog-booking';

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

export default function RecentBookings() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {/* <div className="text-sm font-medium"></div> */}
        <div className="grid gap-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/03.png" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">hace 2 min</p>
              </div>
            </div>
            <Actions />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/05.png" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p className="text-sm text-muted-foreground">
                  ayer a las 11:30
                </p>
              </div>
            </div>

            <Actions />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">
                  Lunes 21 de noviembre, 2024
                </p>
              </div>
            </div>

            <Actions />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/03.png" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  Lunes 21 de noviembre, 2024
                </p>
              </div>
            </div>

            <Actions />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/05.png" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p className="text-sm text-muted-foreground">
                  Lunes 21 de noviembre, 2024
                </p>
              </div>
            </div>

            <Actions />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">
                  Viernes 18 de noviembre, 2024
                </p>
              </div>
            </div>

            <Actions />
          </div>
        </div>
      </div>
    </div>
  );
}

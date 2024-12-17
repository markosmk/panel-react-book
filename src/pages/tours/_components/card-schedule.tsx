import { createNotification } from '@/components/notifications';
import { cn, formatDateOnly } from '@/lib/utils';
import { ScheduleWithAvailable } from '@/types/tour.types';

export function CardSchedule({
  schedule,
  onHandleEdit,
  allowEdit
}: {
  schedule: ScheduleWithAvailable;
  onHandleEdit: (schedule: ScheduleWithAvailable) => void;
  allowEdit: boolean;
}) {
  return (
    <button
      type="button"
      className="relative whitespace-nowrap rounded-md bg-secondary px-4 py-2 pt-9 text-sm font-medium text-secondary-foreground transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      onClick={
        allowEdit
          ? () => onHandleEdit(schedule)
          : () => {
              createNotification({
                type: 'error',
                title: 'No disponible',
                text: 'El horario tiene reservas realizadas, no es posible editarlo.'
              });
            }
      }
    >
      <div className="absolute right-4 top-2 text-xs text-muted-foreground/50">
        {formatDateOnly(schedule.date, 'cccc dd, MMM')}
      </div>
      <div className="flex w-full items-center justify-between gap-x-4">
        <div className="flex flex-col">
          <p className="text-left text-xs uppercase text-muted-foreground">
            desde
          </p>
          <p className="font-mono text-xl font-bold">
            {schedule.startTime.slice(0, 5)}
          </p>
        </div>
        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] rounded-full bg-muted-foreground" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 48 48"
            className="absolute size-10 bg-secondary p-2 text-muted-foreground"
          >
            <path
              fill="currentColor"
              d="M24.15 42c-2.5 0 -4.85 -0.475 -7.05 -1.425 -2.2 -0.95 -4.125 -2.2417 -5.775 -3.875 -1.65 -1.6333 -2.95 -3.55 -3.9 -5.75C6.475 28.75 6 26.4 6 23.9s0.475 -4.8333 1.425 -7c0.95 -2.1667 2.25 -4.0583 3.9 -5.675C12.975 9.60833 14.9 8.33333 17.1 7.4c2.2 -0.93333 4.55 -1.4 7.05 -1.4 2.6667 0 5.1917 0.58333 7.575 1.75 2.3833 1.16667 4.4417 2.7667 6.175 4.8v-5.3h3v10.4H30.45v-3h5.25c-1.4667 -1.7 -3.1917 -3.0667 -5.175 -4.1C28.5417 9.51667 26.4167 9 24.15 9c-4.1667 0 -7.7333 1.425 -10.7 4.275C10.4833 16.125 9 19.6167 9 23.75c0 4.2333 1.4667 7.8333 4.4 10.8C16.3333 37.5167 19.9167 39 24.15 39c4.1667 0 7.6833 -1.4667 10.55 -4.4 2.8667 -2.9333 4.3 -6.4833 4.3 -10.65h3c0 5 -1.7333 9.2583 -5.2 12.775C33.3333 40.2417 29.1167 42 24.15 42Zm6.1 -9.85 -7.7 -7.6v-10.7h3v9.45L32.4 30l-2.15 2.15Z"
              strokeWidth={1}
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <p className="text-left text-xs uppercase text-muted-foreground">
            hasta
          </p>
          <p className="font-mono text-xl font-bold">
            {schedule.endTime ? schedule.endTime?.slice(0, 5) : '--:--'}
          </p>
        </div>
      </div>

      <div className="absolute left-2 top-2 flex items-center gap-x-2 rounded-md bg-background px-2 py-0.5">
        <div className="relative flex size-2">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              schedule.active == '1' ? 'bg-green-400' : 'bg-red-400'
            )}
          ></span>
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              schedule.active == '1' ? 'bg-green-500' : 'bg-red-500'
            )}
          ></span>
        </div>
        <p className="text-xs font-medium">{schedule.available ?? 0}</p>
      </div>
    </button>
  );
}

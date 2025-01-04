import { cn } from '@/lib/utils';

type StatusScheduleProps = {
  active: string;
  available: number;
  className?: string;
};

export function StatusSchedule({
  active,
  available,
  className
}: StatusScheduleProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-x-2 rounded-md bg-background px-2 py-0.5',
        className
      )}
    >
      <div className="relative flex size-2">
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            active == '1' ? 'bg-green-400' : 'bg-red-400'
          )}
        />
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            active == '1' ? 'bg-green-500' : 'bg-red-500'
          )}
        />
      </div>
      <p className="text-xs font-medium">{available ?? 0}</p>
    </div>
  );
}

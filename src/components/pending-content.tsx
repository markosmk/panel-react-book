import { cn } from '@/lib/utils';
import { Icons } from './icons';

// TODO: maybe can add skeleton loader
export function PendingContent({
  children = <>Cargando...</>,
  className,
  sizeIcon = 'lg',
  withOutText = false
}: {
  children?: React.ReactNode;
  className?: string;
  sizeIcon?: 'sm' | 'md' | 'lg';
  withOutText?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-1 items-center justify-center text-muted-foreground',
        className
      )}
    >
      <div className="flex flex-col items-center gap-y-2">
        <Icons.spinner
          className={cn(
            sizeIcon === 'sm' && 'size-8',
            sizeIcon === 'md' && 'size-10',
            sizeIcon === 'lg' && 'size-12'
          )}
        />
        {!withOutText && (
          <div className="animate-pulse duration-1000">{children}</div>
        )}
      </div>
    </div>
  );
}

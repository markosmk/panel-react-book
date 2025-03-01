import { ErrorContent } from '@/components/error-content';
import { Icons } from '@/components/icons';
import { PendingContent } from '@/components/pending-content';
import { cn } from '@/lib/utils';

function FetchingData({
  title = 'Actualizando...',
  isFetching,
  className,
  children
}: {
  title?: string;
  isFetching?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('relative w-full', className)}>
      {children}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm',
          'transition-opacity duration-500 ease-in-out',
          isFetching
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex items-center gap-2 rounded-lg bg-gray-active px-4 py-2 text-foreground delay-200">
          <Icons.spinner className="h-6 w-6" />
          {title && <span className="text-sm font-medium">{title}</span>}
        </div>
      </div>
    </div>
  );
}

type WrapperQueryTableProps<T> = {
  data?: T[];
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  noDataComponent?: React.ReactNode;
};

export function WrapperQueryTable<T>({
  data,
  isLoading,
  isFetching,
  isError,
  children,
  loadingComponent = <PendingContent withOutText className="h-40" />,
  errorComponent = <ErrorContent />,
  noDataComponent = <p className="text-muted-foreground">No hay datos</p>
}: WrapperQueryTableProps<T>) {
  if (isLoading) return loadingComponent;
  if (isError) return errorComponent;
  if (!data) return noDataComponent;
  if (data?.length === 0) return noDataComponent;
  return <FetchingData isFetching={isFetching}>{children}</FetchingData>;
}

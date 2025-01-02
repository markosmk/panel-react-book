import { cn } from '@/lib/utils';

type CardFormProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  isPending?: boolean;
  className?: string;
};

export function CardForm({ children, isPending, className }: CardFormProps) {
  return (
    <>
      <div
        className={cn(
          'space-y-4 transition-opacity duration-500 ease-in-out',
          isPending && 'pointer-events-none opacity-50',
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

type CardFormFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};
export function CardFormFooter({ children, className }: CardFormFooterProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 -mx-4 -mb-4 mt-4 flex justify-end bg-card/50 px-6 py-4 backdrop-blur md:-mx-6 md:-mb-6',
        className
      )}
    >
      {children}
    </div>
  );
}

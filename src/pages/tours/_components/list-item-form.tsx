import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ListItemFormProps = {
  title: string;
  description?: string;
  subAction?: JSX.Element;
  required?: boolean;
  hasError?: boolean;
  children: React.ReactNode;
};

export function ListItemForm({
  title,
  description,
  subAction,
  required = false,
  hasError = false,
  children
}: ListItemFormProps) {
  return (
    <li
      className={cn(
        'w-full overflow-hidden border-b border-border px-4 py-2 first:rounded-t-lg last:rounded-b-lg',
        hasError && 'bg-destructive/10'
      )}
    >
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
        <div className="flex w-32 min-w-32 flex-col">
          <Label required={required}>{title}</Label>
          <small className="mt-1 leading-3 text-muted-foreground">
            {description}
          </small>
          {subAction && <div className="mt-1">{subAction}</div>}
        </div>

        <div className="">{children}</div>
      </div>
    </li>
  );
}

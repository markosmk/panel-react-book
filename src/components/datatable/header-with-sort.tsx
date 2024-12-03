import { Column } from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props<T> = {
  column: Column<T, unknown>;
  name: string;
  className?: string;
};

export function HeaderWithSort<T>({ column, name, className }: Props<T>) {
  return (
    <Button
      variant="ghost"
      className={cn('h-8 px-2', className)}
      // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      onClick={column.getToggleSortingHandler()}
      title={
        column.getCanSort()
          ? column.getNextSortingOrder() === 'asc'
            ? 'Ordenar Ascendente'
            : column.getNextSortingOrder() === 'desc'
              ? 'Ordenar Descendente'
              : 'Limpiar orden'
          : undefined
      }
    >
      {name}
      {{
        asc: <ChevronUpIcon className="ml-2 h-4 w-4" />,
        desc: <ChevronDownIcon className="ml-2 h-4 w-4" />
      }[column.getIsSorted() as string] ?? (
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

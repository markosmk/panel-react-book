import { Table } from '@tanstack/react-table';
import { ChevronDown, Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BookingTable } from '@/types/booking.types';

const columnsNames: { value: keyof BookingTable; label: string }[] = [
  {
    value: 'customer_name',
    label: 'Cliente'
  },
  {
    value: 'tour_name',
    label: 'Tour'
  },
  {
    value: 'schedule_date',
    label: 'Fecha Reserva'
  },
  {
    value: 'schedule_startTime',
    label: 'Hora Reserva'
  },
  {
    value: 'created_at',
    label: 'Fecha'
  },
  {
    value: 'status',
    label: 'Estado'
  }
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function DataTableSearch<TData>({
  table,
  searchPlaceholder,
  globalFilter,
  setGlobalFilter
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          disabled={table.getFilteredSelectedRowModel().rows.length > 0}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full sm:max-w-lg"
        />
      </div>
      <div
        className={cn(
          'ml-auto hidden',
          table.getFilteredSelectedRowModel().rows.length > 0 && 'flex'
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto truncate data-[state=open]:bg-muted"
            >
              <div className="flex truncate">
                <span className="mr-2 hidden sm:flex">Seleccionados</span>
                {table.getFilteredSelectedRowModel().rows.length > 0 &&
                  '(' + table.getFilteredSelectedRowModel().rows.length + ')'}
              </div>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuItem onClick={() => {}} disabled>
              <Icons.archive className="mr-2 h-4 w-4" />
              Archivar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}} disabled>
              <Icons.remove className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto hidden h-12 data-[state=open]:bg-muted lg:flex"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Vista
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Columnas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {columnsNames.find((item) => item.value === column.id)
                    ?.label || column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

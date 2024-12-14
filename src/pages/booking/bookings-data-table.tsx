/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { ArrowUpDownIcon, ChevronDown } from 'lucide-react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  cn,
  formatDateFriendly,
  formatDateOnly,
  formatPrice,
  isTodayOrRecent
} from '@/lib/utils';
import { BookingTable } from '@/types/booking.types';
import { TooltipHelper } from '@/components/tooltip-helper';
import { ActionsDataTable } from './actions-data-table';

// const createColumns = (openModal: any) => ([

const columns: ColumnDef<BookingTable>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecciona todo"
        className="text-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecciona fila"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },

  {
    accessorKey: 'customer_name',
    header: () => (
      <div className="text-xs font-semibold uppercase">Cliente</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-x-2">
          {row.getValue('customer_name')}
          <span className="truncate text-xs text-muted-foreground">
            {row.original.customer_email ?? 'sin correo'}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'tour_name',
    header: () => (
      <div className="hidden min-w-44 text-xs font-semibold uppercase md:flex">
        Tour
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden min-w-44 flex-col gap-x-2 md:flex">
          {row.getValue('tour_name')}
          <span className="text-xs text-muted-foreground">
            Precio ind.: {row.original.tour_price ?? 'N/A'}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'totalPrice',
    header: ({ column }) => (
      <div className="hidden items-center gap-x-2 md:flex">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="h-6 py-0 pl-0 hover:bg-transparent focus:bg-transparent active:bg-transparent"
        >
          <div className="truncate text-xs font-semibold uppercase">
            Precio Total
          </div>
          <ArrowUpDownIcon className="ml-2 h-3.5 w-3.5" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      // TODO: en un tooltip agregar el desglose de precios
      return (
        <div className="hidden flex-col gap-x-2 md:flex">
          <span className="font-medium italic">
            {formatPrice(row.getValue('totalPrice'))}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.quantity ?? '1'}{' '}
            {`${Number(row.original.quantity) > 1 ? 'personas' : 'persona'}`}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <div className="hidden items-center gap-x-2 sm:flex">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size={'sm'}
            className="h-6 py-0 pl-0 hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <div className="text-xs font-semibold uppercase">Fecha</div>
            <ArrowUpDownIcon className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="hidden flex-col gap-x-2 sm:flex">
        {formatDateFriendly(row.getValue('created_at'))}
        <span className="truncate text-xs text-muted-foreground">
          {formatDateOnly(row.getValue('created_at'), "EEEE dd 'de' MMM, yyyy")}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: () => (
      <div className="text-center text-xs font-semibold uppercase">Estado</div>
    ),
    cell: ({ row }) => {
      const status = {
        PENDING: <Icons.pending className="h-4 w-4 text-yellow-600" />,
        CONFIRMED: <Icons.success className="h-4 w-4 text-green-600" />,
        CANCELED: <Icons.canceled className="h-4 w-4 text-red-600" />,
        ARCHIVED: <Icons.pending className="h-4 w-4 text-gray-600" />
      };
      const statusText = {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        CANCELED: 'Cancelada',
        ARCHIVED: 'Archivada'
      };
      return (
        <div className="flex items-center justify-center">
          <TooltipHelper
            content={statusText[row.getValue('status') as keyof typeof status]}
          >
            {status[row.getValue('status') as keyof typeof status]}
          </TooltipHelper>
        </div>
      );
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionsDataTable data={row.original} />
  }
];

const columnsToCheck: (keyof BookingTable)[] = [
  'customer_name',
  'customer_email',
  'customer_phone',
  'tour_name',
  'totalPrice'
];

export function BookingsDataTable({ data }: { data: BookingTable[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
    globalFilterFn: (row, columnId, filterValue): boolean => {
      // must be exist data in column
      // if (!columnsToCheck.includes(columnId as keyof CustomerTable)) {
      //   return false;
      // }

      // const cellValue = row.original[columnId];
      // return (
      //   cellValue &&
      //   cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
      // );
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const searchTerms = lowerCaseFilterValue.split(' ').filter(Boolean);

      return columnsToCheck.some((column) => {
        const cellValue = row.original[column as keyof BookingTable];
        if (!cellValue) return false;

        const cellValueString = cellValue.toString().toLowerCase();
        return searchTerms.every((term: string) =>
          cellValueString.includes(term)
        );
        // return (
        //   cellValue &&
        //   cellValue.toString().toLowerCase().includes(filterValue.toLowerCase())
        // );
      });
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-2 py-4">
        <Input
          placeholder="Buscar por nombre, email, telefono, tour..."
          value={globalFilter}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <div
          className={cn(
            'ml-auto hidden',
            table.getFilteredSelectedRowModel().rows.length > 0 && 'flex'
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto truncate">
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
      </div>
      <div className="overflow-hidden rounded-lg bg-card text-card-foreground">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'data-[state=selected]:bg-primary/5',
                      isTodayOrRecent(row.original.created_at.toString()) &&
                        'bg-cyan-900/15'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex w-full flex-col items-center px-2 pt-4 text-muted-foreground">
                    <Icons.check className="h-10 w-10" />
                    <div className="flex flex-col items-center py-4">
                      <div className="text-sm text-muted-foreground">
                        No hay resultados.
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { BadgeStatus } from '@/components/badge-status';

import {
  cn,
  formatDateFriendly,
  formatDateOnly,
  formatDateString,
  formatPrice,
  isTodayOrRecent
} from '@/lib/utils';
import { BookingTable } from '@/types/booking.types';

import { DataTableActions } from './data-table-actions';
import { DataTableToolbar } from './data-table-toolbar';
import { DataTableSearch } from './data-table-search';

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
    accessorKey: 'schedule_date',
    header: ({ column }) => (
      <div className="hidden items-center gap-x-2 md:flex">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="h-6 py-0 pl-0 hover:bg-transparent focus:bg-transparent active:bg-transparent"
        >
          <div className="truncate text-xs font-semibold uppercase">
            Fecha Reserva
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
            {formatDateString(row.getValue('schedule_date'))}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.schedule_startTime?.slice(0, 5)}hs
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'customer_name',
    header: () => (
      <div className="text-xs font-semibold uppercase">Reservado por</div>
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
            Precio Total:{' '}
            {formatPrice(Number(row.original.totalPrice)) ?? 'N/A'} (
            {row.original.quantity ?? '1'}{' '}
            {`${Number(row.original.quantity) > 1 ? 'personas' : 'persona'}`})
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'schedule_startTime',
    header: () => (
      <div className="hidden min-w-20 text-xs font-semibold uppercase md:flex">
        Hora
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden min-w-20 flex-col gap-x-2 md:flex">
          <span className="font-medium italic">
            {row.original.schedule_startTime?.slice(0, 5)}hs
          </span>
        </div>
      );
    },
    enableHiding: false
  },

  {
    accessorKey: 'status',
    header: () => (
      <div className="text-center text-xs font-semibold uppercase">Estado</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <BadgeStatus status={row.getValue('status')} useIcon />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <DataTableActions data={row.original} />
  }
];

const columnsToCheck: (keyof BookingTable)[] = [
  'customer_name',
  'customer_email',
  'customer_phone',
  'tour_name',
  'totalPrice',
  'schedule_date',
  'schedule_startTime'
];

export function DataTableBooking({ data }: { data: BookingTable[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      schedule_startTime: false
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(), //depends on getFacetedRowModel
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
      <DataTableSearch
        table={table}
        searchPlaceholder="Buscar por nombre, email, telefono, tour..."
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <DataTableToolbar table={table} />

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

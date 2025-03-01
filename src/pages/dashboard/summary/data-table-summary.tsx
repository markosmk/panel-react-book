import * as React from 'react';
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { cn, formatPrice } from '@/lib/utils';
import { ScheduleSummary } from '@/types/summary.types';
import { BadgeStatus } from '@/components/badge-status';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

// import { DataTableActions } from './data-table-actions';

const columns: ColumnDef<ScheduleSummary>[] = [
  {
    accessorKey: 'schedule_start_time',
    header: ({ column }) => {
      return (
        <div className="flex max-w-20 items-center gap-x-2">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            size={'sm'}
            className="h-6 py-0 pl-0 hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <div className="text-xs font-semibold uppercase">Horario</div>
            <ArrowUpDownIcon className="ml-2 h-3.5 w-3.5" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex max-w-20 select-none flex-col gap-x-2">
        {row.getValue('schedule_start_time')?.toString().slice(0, 5)}hs
        <span className="truncate text-xs text-muted-foreground">
          {row.original.schedule_end_time || ''}
        </span>
      </div>
    )
  },

  {
    accessorKey: 'tour_name',
    header: ({ column }) => (
      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size={'sm'}
          className="h-6 py-0 pl-0 hover:bg-transparent focus:bg-transparent active:bg-transparent"
        >
          <div className="truncate text-xs font-semibold uppercase">Tour</div>
          <ArrowUpDownIcon className="ml-2 h-3.5 w-3.5" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex select-none flex-col gap-x-2 md:min-w-44">
          {row.getValue('tour_name')}
          <span className="text-xs text-muted-foreground">
            Precio/Persona:{' '}
            {formatPrice(Number(row.original.tour_price)) ?? 'N/A'} | Duracion:{' '}
            {row.original.tour_duration ?? ''} | Capadidad:{' '}
            {row.original.tour_capacity}
            {`${Number(row.original.tour_capacity) > 1 ? ' personas' : ' persona'}`}
          </span>
        </div>
      );
    }
  },

  {
    accessorKey: 'reservations_count',
    header: () => (
      <div className="hidden max-w-32 text-xs font-semibold uppercase md:flex">
        Cant. de Reservas
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden max-w-32 select-none flex-col gap-x-2 text-center md:flex">
          {row.getValue('reservations_count')}
        </div>
      );
    }
  },
  {
    accessorKey: 'total_reserved',
    header: () => (
      <div className="hidden max-w-32 text-xs font-semibold uppercase md:flex">
        Cant. de Personas
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden max-w-32 select-none flex-col gap-x-2 text-center md:flex">
          {row.getValue('total_reserved')}
        </div>
      );
    }
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <Button
          size={'icon'}
          variant="outline"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <EyeClosedIcon className="h-4 w-4" />
          ) : (
            <EyeOpenIcon className="h-4 w-4" />
          )}
        </Button>
      ) : null
  }
];

const renderSubComponent = ({ row }: { row: Row<ScheduleSummary> }) => {
  return (
    <div className="space-y-4 divide-y bg-background p-2 lg:p-4">
      {row.original.reservations?.map((reservation) => (
        <div
          key={reservation.booking_id}
          className="flex flex-wrap items-start justify-between gap-4 py-2 first:pt-0 last:pb-0 last:pt-2"
        >
          <div className="flex flex-col items-start">
            <p className="mb-1 text-xs font-light uppercase text-muted-foreground">
              Cliente
            </p>
            <span className="text-sm font-semibold">
              {reservation.customer_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {reservation.customer_email} | {reservation.customer_phone}
            </span>
            <span className="text-xs text-muted-foreground">
              Notas: {reservation.booking_notes || 'ninguno'}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <p className="mb-1 text-xs font-light uppercase text-muted-foreground">
              Cantidad Reservada
            </p>
            <span className="text-sm font-semibold">
              {reservation.booking_quantity} persona
              {Number(reservation.booking_quantity) > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <p className="mb-1 text-xs font-light uppercase text-muted-foreground">
              Precio Total
            </p>
            <span className="text-sm font-semibold">
              {formatPrice(Number(reservation.booking_total_price))}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <p className="mb-1 text-xs font-light uppercase text-muted-foreground">
              Estado Actual
            </p>
            <BadgeStatus status={reservation.booking_status} />
          </div>
        </div>
      ))}
    </div>
  );
};

export function DataTableSummary({ data }: { data: ScheduleSummary[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      expanded
    },
    onExpandedChange: setExpanded,
    // onExpandedChange: (newExpanded) => {
    //   const expandedKeys = Object.keys(newExpanded);
    //   if (expandedKeys.length > 0) {
    //     setExpanded({ [expandedKeys[0]]: true });
    //   } else {
    //     setExpanded({});
    //   }
    // },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel()
  });

  return (
    <div className="w-full">
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
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && 'selected'}
                      className={cn(
                        'hover:bg-primary/20',
                        row.getIsExpanded() &&
                          'bg-primary/20 hover:bg-primary/20'
                      )}
                      // onClick={row.getToggleExpandedHandler()}
                      // onClick={() => {
                      //   setExpanded((prevExpanded) => {
                      //     if (prevExpanded[row.id]) return {};
                      //     return { [row.id]: true };
                      //   });
                      // }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-2 lg:p-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>
                          {renderSubComponent({ row })}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

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
import { ArrowUpDownIcon, CopyIcon } from 'lucide-react';

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

import { cn, formatId, formatPrice } from '@/lib/utils';
import { ScheduleSummary } from '@/types/summary.types';
import { BadgeStatus } from '@/components/badge-status';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { LanguageFlag } from '@/components/language-flag';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/notifications';
import { SectionInfo } from '@/components/section-info';

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
    accessorKey: 'booking_count',
    header: () => (
      <div className="hidden max-w-32 text-xs font-semibold uppercase md:flex">
        Cant. de Reservas
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden max-w-32 select-none flex-col gap-x-2 text-center md:flex">
          {row.getValue('booking_count')}
        </div>
      );
    }
  },
  {
    accessorKey: 'booking_total_reserved',
    header: () => (
      <div className="hidden max-w-32 text-xs font-semibold uppercase md:flex">
        Cant. de Personas
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden max-w-32 select-none flex-col gap-x-2 text-center md:flex">
          {row.getValue('booking_total_reserved')}
        </div>
      );
    }
  },
  {
    accessorKey: 'booking_language',
    header: () => (
      <div className="hidden max-w-32 text-xs font-semibold uppercase md:flex">
        Idioma
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden max-w-32 select-none text-center md:flex">
          <LanguageFlag language={row.getValue('booking_language')} />
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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Numero de reserva copiado al portapapeles');
  };

  return (
    <ul className="flex flex-wrap gap-4 bg-black p-4">
      {row.original.bookings?.map((book) => (
        <li
          key={book.booking_id}
          className="relative flex w-full max-w-80 flex-col rounded-md border bg-card"
        >
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold">
                Reserva {formatId(book.booking_id)}
              </h3>
              <button
                onClick={() =>
                  copyToClipboard(formatId(book.booking_id).toString())
                }
                className="text-muted-foreground hover:text-foreground"
                title="Copiar número de reserva"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>
            <BadgeStatus status={book.booking_status} />
          </div>

          <SectionInfo
            items={[
              {
                label: 'Nombre',
                value: book.customer_name || '-',
                colSpan: 3
              },
              {
                label: 'Email',
                value: book.customer_email || '-',
                colSpan: 3
              },
              {
                label: 'Telefono',
                value: book.customer_phone || '-',
                colSpan: 3
              }
            ]}
          />
          <Separator className="my-1" />
          <SectionInfo
            items={[
              {
                label: 'Cantidad de Personas',

                value: `${book.booking_quantity} persona${Number(book.booking_quantity) > 1 ? 's' : ''}`,
                colSpan: 3
              },
              {
                label: 'Precio Total',
                value: formatPrice(Number(book.booking_total_price)) || '-',
                colSpan: 3
              },
              {
                label: 'Notas / Observaciones',
                value: book.booking_notes || '-',
                colSpan: 3
              }
            ]}
          />
        </li>
      ))}
    </ul>
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

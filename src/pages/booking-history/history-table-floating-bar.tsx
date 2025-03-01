import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { CheckCircle2, Download, Loader, Trash2 } from 'lucide-react';
import { SelectTrigger } from '@radix-ui/react-select';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from '@/components/notifications';

import { useMutation } from '@tanstack/react-query';
import { BookingTable } from '@/types/booking.types';

async function updateStatus({
  ids,
  status
}: {
  ids: string[];
  status: string;
}) {
  console.log({
    ids,
    status
  });
  return new Promise((resolve) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve({});
    }, 2000);

    // reject({
    //   error: 'Error updating tasks'
    // });
  });
}

interface HistoryTableFloatingBarProps {
  table: Table<BookingTable>;
  children?: React.ReactNode;
}

export function HistoryTableFloatingBar({
  table
}: HistoryTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const { mutate: updateStatusMutation, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: updateStatus,
      onSuccess: () => toast.success('Items Actualizados'),
      onError: (error) => toast.error(error?.message || 'Algo pasó')
    });

  const [isPending] = React.useTransition();
  const [action] = React.useState<
    'update-status' | 'update-priority' | 'export' | 'delete'
  >();

  return (
    <>
      <Select
        onValueChange={(value: BookingTable['status']) => {
          updateStatusMutation({
            ids: rows.map((row) => row.original.id),
            status: value
          });
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                disabled={isPending}
              >
                {isUpdatingStatus ? (
                  <Loader
                    className="size-3.5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                )}
              </Button>
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
            <p>Actualizar Estado</p>
          </TooltipContent>
        </Tooltip>
        <SelectContent align="center">
          <SelectGroup>
            {['CONFIRMED', 'PENDING', 'CANCELED'].map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="size-7 border"
            onClick={() => {
              //   startTransition(() => {
              //     exportTableToCSV(table, {
              //       excludeColumns: ["select", "actions"],
              //       onlySelected: true,
              //     });
              //   });
            }}
            disabled={isPending}
          >
            {isPending && action === 'export' ? (
              <Loader className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-3.5" aria-hidden="true" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
          <p>Exportar Items</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="size-7 border"
            onClick={() => {}}
            disabled={isPending}
          >
            {isPending && action === 'delete' ? (
              <Loader className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="size-3.5" aria-hidden="true" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
          <p>Eliminar Items</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}

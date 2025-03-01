import type { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { BookingTable } from '@/types/booking.types';

interface HistoryTableActionsProps {
  table: Table<BookingTable>;
}

export function HistoryTableActions({ table }: HistoryTableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button
          variant="outline"
          onClick={() => {
            // console.log({
            //   rows: table
            //     .getFilteredSelectedRowModel()
            //     .rows.map((row) => row.original)
            // });
            // on success
            // table.toggleAllRowsSelected(false)
          }}
          className="gap-2"
        >
          <Download className="size-4" aria-hidden="true" />
          Eliminar
        </Button>
      ) : null}
      <Button
        variant="outline"
        onClick={
          () => {}
          //  action()
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Exportar
      </Button>
    </div>
  );
}

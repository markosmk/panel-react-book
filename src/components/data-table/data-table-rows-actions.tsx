import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type RowActions<TData> = {
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  handleAction: (props: {
    rows: TData[];
    closeDropdownMenu: () => void;
    deSelectAllRows: () => void;
  }) => void;
};

interface DataTableRowsActionsProps<TData> {
  table: Table<TData>;
  rowActions?: RowActions<TData>[];
  children?: React.ReactNode;
}

export function DataTableRowsActions<TData>({
  table,
  rowActions,
  children
}: DataTableRowsActionsProps<TData>) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 &&
        rowActions &&
        rowActions?.length > 0 && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
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
              {rowActions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  disabled={action.disabled}
                  onClick={() => {
                    setOpen(false);
                    // TODO: checking test this
                    action.handleAction({
                      rows: table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original),
                      closeDropdownMenu: () => setOpen(false),
                      deSelectAllRows: () => table.toggleAllRowsSelected(false)
                    });
                  }}
                >
                  {action.icon && action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      {children}
    </div>
  );
}

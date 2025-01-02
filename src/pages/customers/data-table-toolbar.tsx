import { Table } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { saveAs } from 'file-saver';

import { cn, sleep } from '@/lib/utils';
import { CustomerTable } from '@/types/customer.types';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { toast } from 'sonner';

const formatedData = (data: CustomerTable[]) => {
  return [...data].map((item) => ({
    Creado: item.created_at,
    Nombre: item.name,
    'Nro Telefono': item.phone,
    Email: item.email,
    'Desea Noticias?': item.wantNewsletter === '1' ? 'Si' : 'No'
  }));
};

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
};

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter
}: DataTableToolbarProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const downloadLinkRef = React.useRef<HTMLAnchorElement | null>(null);

  const exportToExcel = async ({
    directDownload = true
  }: {
    directDownload?: boolean;
  }) => {
    try {
      setIsPending(true);

      const selectedRows = table.getSelectedRowModel()?.flatRows || [];
      const selectedData = selectedRows.map(
        (row) => row.original
      ) as CustomerTable[];
      const dataFormated = formatedData(selectedData);

      await sleep(1500);

      // import dinamically
      const { utils, write } = await import('xlsx');

      // create workbook
      const worksheet = utils.json_to_sheet(dataFormated);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // generate buffer of excel
      const excelBuffer = write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      // create and download file
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream'
      });

      if (directDownload) {
        const url = URL.createObjectURL(blob);
        if (downloadLinkRef.current) {
          downloadLinkRef.current.href = url;
          downloadLinkRef.current.download = `clientes-zw-${Date.now()}.xlsx`;
          downloadLinkRef.current.click();
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        }

        toast.success('Archivo generado correctamente. Descarga en progreso.');
      } else {
        saveAs(blob, `clientes-zw-${Date.now()}.xlsx`);
        toast.success('Archivo generado correctamente.');
      }
    } catch (error) {
      console.error('Error al exportar el archivo:', error);
      toast.error('Ocurrió un error al exportar el archivo.');
    } finally {
      setIsPending(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };

  return (
    <div className="flex items-center gap-x-2 py-4">
      <Input
        placeholder="Buscar por nombre, email o teléfono..."
        value={globalFilter}
        disabled={table.getFilteredSelectedRowModel().rows.length > 0}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full sm:max-w-lg"
      />
      <div
        className={cn(
          'ml-auto hidden',
          table.getFilteredSelectedRowModel().rows.length > 0 && 'flex'
        )}
      >
        <DropdownMenu
          open={isOpen}
          onOpenChange={(prev) => {
            if (isPending) return;
            setIsOpen(prev);
          }}
        >
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
            <a ref={downloadLinkRef} style={{ display: 'none' }} />
            <DropdownMenuItem
              onClick={() => exportToExcel({ directDownload: true })}
              disabled={isPending}
            >
              {isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.archive className="mr-2 h-4 w-4" />
              )}
              {isPending ? 'Procesando...' : 'Exportar Excel'}
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => {}} disabled>
            <Icons.remove className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

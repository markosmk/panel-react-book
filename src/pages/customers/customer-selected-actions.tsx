import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { saveAs } from 'file-saver';

import { Button } from '@/components/ui/button';
import { CustomerTable } from '@/types/customer.types';
import { toast } from '@/components/notifications';
import { Icons } from '@/components/icons';

const formatedData = (data: CustomerTable[]) => {
  return [...data].map((item) => ({
    Creado: item.created_at,
    Nombre: item.name,
    'Nro Telefono': item.phone,
    Email: item.email,
    'Desea Noticias?': item.wantNewsletter === '1' ? 'Si' : 'No'
  }));
};

interface CustomerSelectedActionsProps {
  table: Table<CustomerTable>;
}

export function CustomerSelectedActions({
  table
}: CustomerSelectedActionsProps) {
  const [isPending, setIsPending] = React.useState(false);
  const downloadLinkRef = React.useRef<HTMLAnchorElement | null>(null);
  const count = table.getFilteredSelectedRowModel().rows.length;

  const exportToExcel = async ({
    directDownload = true
  }: {
    directDownload?: boolean;
  }) => {
    toast.dismiss();
    try {
      setIsPending(true);
      const rows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      //   const selectedRows = table.getSelectedRowModel()?.flatRows || [];
      //   const selectedData = selectedRows.map(
      //     (row) => row.original
      //   ) as CustomerTable[];

      const dataFormated = formatedData(rows);

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
          }, 150);
        }

        toast.success('Archivo generado correctamente. Descarga en progreso.');
      } else {
        saveAs(blob, `clientes-zw-${Date.now()}.xlsx`);
        toast.success('Archivo generado correctamente.');
      }
    } catch (error) {
      toast.error('Ocurrió un error al exportar el archivo.');
    } finally {
      setIsPending(false);
    }
  };

  if (table.getFilteredSelectedRowModel().rows.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <a ref={downloadLinkRef} style={{ display: 'none' }} />
      <Button
        variant="outline"
        onClick={() => exportToExcel({ directDownload: true })}
        disabled={isPending}
      >
        {isPending ? (
          <Icons.spinner className="mr-2 size-4" />
        ) : (
          <Icons.archive className="mr-2 size-4" />
        )}
        {isPending ? 'Procesando...' : `Exportar Excel (${count})`}
      </Button>
    </div>
  );
}

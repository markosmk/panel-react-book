import * as React from 'react';

import { useDataTable } from '@/components/data-table/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';

import { getColumns } from './customer-columns';
import type { CustomerTable as CustomerType } from '@/types/customer.types';
import { CustomerSelectedActions } from './customer-selected-actions';
import { DataTableFilters } from '@/components/data-table/data-table-filters';
import { DataTableFilterField } from '@/components/data-table/data-table.types';

export function CustomerTable({ data }: { data: CustomerType[] }) {
  const columns = React.useMemo(() => getColumns(), []);
  const columnsToSearch: (keyof CustomerType)[] = ['name', 'email', 'phone'];

  const filterFields: DataTableFilterField<CustomerType>[] = [
    {
      id: 'about',
      label: 'Como Conocio ZW'
    },
    {
      id: 'wantNewsletter',
      label: 'Newsletter',
      options: [
        { label: 'Si', value: '1' },
        { label: 'No', value: '0' }
      ]
    }
  ];

  const columnsNamesVisibility: { value: keyof CustomerType; label: string }[] =
    React.useMemo(
      () => [
        {
          value: 'name',
          label: 'Nombre'
        },
        {
          value: 'phone',
          label: 'Telefono'
        },
        {
          value: 'about',
          label: 'Como Conocio ZW'
        },
        {
          value: 'total_bookings',
          label: 'Cant. Reservas'
        },
        {
          value: 'hotel',
          label: 'Hospedaje'
        },
        {
          value: 'origen',
          label: 'Residencia'
        },
        {
          value: 'created_at',
          label: 'Fecha Creado'
        },
        {
          value: 'wantNewsletter',
          label: 'Recibe Noticias'
        }
      ],
      []
    );

  const { table } = useDataTable<CustomerType>({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] },
      columnVisibility: {
        about: false,
        hotel: false,
        origen: false,
        wantNewsletter: false
      }
    },
    columnsToSearch
  });

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          searchPlaceholder="Buscar por Cliente por Nombre, Email o Telefono..."
          //   useSelectorVisibility={false}
          columnsNamesVisibility={columnsNamesVisibility}
        >
          <CustomerSelectedActions table={table} />
        </DataTableToolbar>
        <DataTableFilters table={table} filterFields={filterFields}>
          {/* <p className="block text-xs text-muted-foreground/70 sm:ml-auto">
            Los horarios están en formato de 24 horas. Los filtros funcionan
            para el periodo seleccionado.
          </p> */}
        </DataTableFilters>
      </DataTable>
    </>
  );
}

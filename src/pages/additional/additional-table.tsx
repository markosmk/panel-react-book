import * as React from 'react';

import { useDataTable } from '@/components/data-table/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableRowAction } from '@/components/data-table/data-table.types';

import { Additional } from '@/types/app.types';
import { useAdditionalDelete } from '@/services/hooks/additional.mutation';

import { getColumns } from './additional-columns';
import { SelectedActions } from './selected-actions';
import { AdditionalDetail } from './additional-detail';
import { AdditionalForm } from './additional-form';

import { useModalStore } from '@/utils/modal/use-modal-store';
import { useConfirmStore } from '@/utils/confirm-modal/use-confirm-store';
import { formatDateOnly } from '@/lib/utils';

export function AdditionalTable({ data }: { data: Additional[] }) {
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Additional> | null>(null);

  const columns = React.useMemo(() => getColumns({ setRowAction }), []);

  const columnsToSearch: (keyof Additional)[] = ['name'];

  const { table } = useDataTable<Additional>({
    data,
    columns,
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    columnsToSearch
  });

  const { openModal, closeModal } = useModalStore();
  const { openConfirm } = useConfirmStore();
  const { mutateAsync } = useAdditionalDelete();

  const handleOpenDetails = React.useCallback(
    (data: Additional) => {
      openModal({
        title: 'Detalles Item',
        description: 'registro creado el ' + formatDateOnly(data.created_at),
        content: <AdditionalDetail detail={data} />,
        onClose: () => setRowAction(null)
      });
    },
    [openModal]
  );

  const handleOpenEdit = React.useCallback(
    (data: Additional) => {
      openModal({
        title: 'Editar Item',
        description:
          'ultima actualizacion el ' + formatDateOnly(data.updated_at),
        content: <AdditionalForm data={data} closeModal={closeModal} />,
        onClose: () => setRowAction(null)
      });
    },
    [openModal, closeModal]
  );

  const handleDelete = React.useCallback(
    async (data: Additional) => {
      openConfirm({
        description:
          'Esta accion no puede deshacerse. Al Confirmar, eliminaras completamente el item.',
        onConfirm: async () => {
          await mutateAsync(data.id, {
            onSettled: () => setRowAction(null)
          });
        },
        onCancel: () => setRowAction(null)
      });
    },
    [openConfirm, mutateAsync]
  );

  React.useEffect(() => {
    if (rowAction?.type === 'show') {
      handleOpenDetails(rowAction.row.original);
    } else if (rowAction?.type === 'edit') {
      handleOpenEdit(rowAction.row.original);
    } else if (rowAction?.type === 'delete') {
      handleDelete(rowAction.row.original);
    }
  }, [handleDelete, handleOpenDetails, handleOpenEdit, rowAction]);

  return (
    <>
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          searchPlaceholder="Buscar por Nombre..."
          useSelectorVisibility={false}
        >
          <SelectedActions table={table} />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}

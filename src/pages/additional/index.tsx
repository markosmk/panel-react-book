import { useAdditionals } from '@/services/hooks/additional.query';
import { useModalStore } from '@/utils/modal/use-modal-store';

import { Button } from '@/components/ui/button';
import { HeadingMain } from '@/components/heading-main';
import { WrapperQueryTable } from '@/components/wrapper-query-table';

import { AdditionalForm } from './additional-form';
import { AdditionalTable } from './additional-table';

export default function AdditionalPage() {
  const { data, isLoading, isError, isFetching } = useAdditionals();
  const { openModal, closeModal } = useModalStore();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Adicionales"
        description="Corresponde a los Extras Opcionales que pueden agregar los
  clientes al total de la reserva. Se agrega a todos los tours
  creados, puedes eliminar o marcar como no activo si deseas
  ocultarlos."
      >
        <Button
          type="button"
          onClick={() => {
            openModal({
              title: 'Crear Nuevo',
              content: <AdditionalForm closeModal={closeModal} />
            });
          }}
        >
          Crear Nuevo
        </Button>
      </HeadingMain>

      <WrapperQueryTable
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
      >
        <AdditionalTable data={data || []} />
      </WrapperQueryTable>
    </div>
  );
}

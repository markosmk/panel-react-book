import { useCustomers } from '@/services/hooks/customer.query';
import { useModalStore } from '@/utils/modal/use-modal-store';

import { Button } from '@/components/ui/button';
import { HeadingMain } from '@/components/heading-main';
import { WrapperQueryTable } from '@/components/wrapper-query-table';

import { CustomerForm } from './customer-form';
import { CustomerTable } from './customer-table';

export default function CustomersPage() {
  // const [searchParams] = useSearchParams();
  // const page = Number(searchParams.get('page') || 1);
  // const perPage = Number(searchParams.get('perPage') || 10);
  const { data, isLoading, isFetching, isError } = useCustomers(1, 10);
  const { openModal, closeModal } = useModalStore();

  const handleCreate = () => {
    openModal({
      title: 'Crear Cliente',
      content: <CustomerForm closeModal={closeModal} />
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Clientes"
        description="Administra tus clientes desde esta seccion, puedes crear, editar y eliminar clientes."
      >
        <Button type="button" onClick={handleCreate}>
          Crear Cliente
        </Button>
      </HeadingMain>

      <WrapperQueryTable
        data={data?.results}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
      >
        <CustomerTable data={data?.results || []} />
      </WrapperQueryTable>
    </div>
  );
}

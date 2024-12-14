import { useSearchParams } from 'react-router-dom';
import { CustomerDataTable } from './customer-data-table';
import { useCustomers } from '@/services/hooks/customer.query';
import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';

export default function CustomersPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const { data, isLoading, isError } = useCustomers(page, perPage);

  if (isLoading) return <PendingContent />;

  // TODO: show better errors
  if (isError) return <div>Error</div>;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Clientes"
        description="Administra tus clientes desde esta seccion, puedes agregar, editar y eliminar clientes."
      />
      <CustomerDataTable data={data?.results || []} />
    </div>
  );
}

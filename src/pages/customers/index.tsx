import { CustomerDataTable } from './customer-data-table';
import { useCustomers } from '@/services/hooks/customer.query';
import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';

export default function CustomersPage() {
  const { data, isLoading } = useCustomers(1, 10);

  if (isLoading) return <PendingContent />;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Clientes"
        description="Administra tus clientes desde esta seccion, puedes agregar, editar y eliminar clientes."
      />
      <CustomerDataTable data={data?.results || []} />
    </div>
  );
}

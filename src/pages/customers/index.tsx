import { useSearchParams } from 'react-router-dom';

import { useCustomers } from '@/services/hooks/customer.query';

import { HeadingMain } from '@/components/heading-main';
import { PendingContent } from '@/components/pending-content';
import { DataTableCustomers } from './data-table-customers';
import { ErrorContent } from '@/components/error-content';

export default function CustomersPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  const { data, isLoading, isError } = useCustomers(page, perPage);

  if (isLoading) return <PendingContent withOutText className="h-40" />;
  if (isError) return <ErrorContent />;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Clientes"
        description="Administra tus clientes desde esta seccion, puedes ver la reserva de un cliente en particular o exportar clientes una lista de excel (seleccionando)."
      />
      <DataTableCustomers data={data?.results || []} />
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ToursTable } from './tours-table';
import { useTours } from '@/services/hooks/tour.query';

import { HeadingMain } from '@/components/heading-main';
import { Button } from '@/components/ui/button';
import { WrapperQueryTable } from '@/components/wrapper-query-table';

export default function ToursPage() {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const page = Number(searchParams.get('page') || 1);
  // const perPage = Number(searchParams.get('perPage') || 10);
  // query
  const { data, isLoading, isFetching, isError } = useTours();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Tours"
        description="Administra tus tours desde esta seccion, puedes agregar, editar y eliminar tours."
      >
        <Button type="button" onClick={() => navigate('/tours/create')}>
          Crear tour
        </Button>
      </HeadingMain>

      <WrapperQueryTable
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
      >
        <ToursTable data={data || []} />
      </WrapperQueryTable>
    </div>
  );
}

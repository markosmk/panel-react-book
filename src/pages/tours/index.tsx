import { HeadingMain } from '@/components/heading-main';
import { PendingContent } from '@/components/pending-content';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToursDataTable } from './tours-data-table';
import { useTours } from '@/services/hooks/tour.query';
import { Button } from '@/components/ui/button';
import { ErrorContent } from '@/components/error-content';

export default function ToursPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 10);
  // query
  const { data, isLoading, isError } = useTours(page, perPage);

  if (isLoading) return <PendingContent withOutText className="h-40" />;
  if (isError) return <ErrorContent />;

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

      <ToursDataTable data={data ?? []} />
    </div>
  );
}

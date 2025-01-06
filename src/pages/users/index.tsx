import { DataTableUsers } from './data-table-users';
import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';

import { useUsers } from '@/services/hooks/user.query';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal';
import { FormUser } from './form-edit-user';
import { ErrorContent } from '@/components/error-content';

export default function UsersPage() {
  const { openModal, closeModal } = useModal();
  const { data, isLoading, isError } = useUsers();

  if (isLoading) return <PendingContent withOutText className="h-40" />;
  if (isError) return <ErrorContent />;

  const handleNewUser = () => {
    openModal({
      title: 'Crear Usuario',
      component: <FormUser data={null} closeModal={closeModal} />
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Usuarios"
        description="Administra todos los usuarios que pueden iniciar sesion en la aplicacion."
      >
        <Button type="button" onClick={handleNewUser}>
          Crear Usuario
        </Button>
      </HeadingMain>
      <DataTableUsers data={data || []} />
    </div>
  );
}

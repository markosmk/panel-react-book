// import { useNavigate } from 'react-router-dom';

import { UserForm } from './user-form';
import { useUsers } from '@/services/hooks/user.query';

import { Button } from '@/components/ui/button';
import { HeadingMain } from '@/components/heading-main';
import { useModalStore } from '@/utils/modal/use-modal-store';
import { WrapperQueryTable } from '@/components/wrapper-query-table';
import { UserTable } from './user-table';

export default function UsersPage() {
  // const navigate = useNavigate();
  const { openModal, closeModal } = useModalStore();
  const { data, isLoading, isFetching, isError } = useUsers();

  const handleNewUser = () => {
    openModal({
      title: 'Crear Usuario',
      content: <UserForm data={null} closeModal={closeModal} />
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
      <HeadingMain
        title="Lista de Usuarios"
        description="Administra todos los usuarios que pueden iniciar sesion en la aplicacion."
      >
        {/* <Button type="button" onClick={() => navigate('/users/roles')}>
          Roles
        </Button> */}
        <Button type="button" onClick={handleNewUser}>
          Crear Usuario
        </Button>
      </HeadingMain>

      <WrapperQueryTable
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
      >
        <UserTable data={data || []} />
      </WrapperQueryTable>
    </div>
  );
}

// import { PendingContent } from '@/components/pending-content';
import { HeadingMain } from '@/components/heading-main';

// import { useUsers } from '@/services/hooks/user.query';
// import { Button } from '@/components/ui/button';
// import { useModal } from '@/hooks/use-modal';
// import { ErrorContent } from '@/components/error-content';

// import { useRoleStore } from './use-role-store';
import { PermissionsTable } from './permissions-table';
import { Card, CardContent } from '@/components/ui/card';

export default function RolesPage() {
  // const { roles, fetchRoles, fetchPermissions } = useRoleStore();
  // const { openModal, closeModal } = useModal();
  //   const { data, isLoading, isError } = useUsers();
  //   if (isLoading) return <PendingContent withOutText className="h-40" />;
  //   if (isError) return <ErrorContent />;

  // const handleNewRole = () => {
  //   // openModal({
  //   //   title: 'Crear Usuario',
  //   //   component: <FormUser data={null} closeModal={closeModal} />
  //   // });
  // };

  // const openEditModal = (role: any) => {
  //   // openModal({
  //   //   title: 'Editar Rol',
  //   //   description: 'ultima actualizacion el ' + formatDateOnly(role.updated_at),
  //   //   component: <RoleForm data={role} closeModal={closeModal} />
  //   // });
  // };

  // const handleDelete = (roleId: number) => {
  //   if (window.confirm('¿Estás seguro de eliminar este rol?')) {
  //     deleteRole(roleId);
  //   }
  // };

  return (
    <div className="relative mx-auto w-full max-w-2xl space-y-8 px-4 pb-4 md:px-6 md:pb-6">
      <HeadingMain
        title="Gestión de Roles"
        description="Gestiona tus roles desde esta seccion, puedes agregar, editar y eliminar roles."
        hasBackNavigation
      />
      <Card>
        {/* className={cn(isFetching && 'cursor-wait')}> */}
        <CardContent>
          <PermissionsTable />
        </CardContent>
      </Card>
    </div>

    // <div className="mx-auto w-full max-w-6xl space-y-8 px-6">
    //   <HeadingMain
    //     title="Gestión de Roles"
    //     description="Gestiona tus roles desde esta seccion, puedes agregar, editar y eliminar roles."
    //   ></HeadingMain>

    //   <PermissionsTable />
    // </div>
  );
}

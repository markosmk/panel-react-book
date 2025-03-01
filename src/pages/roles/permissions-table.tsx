import { Checkbox } from '@/components/ui/checkbox';
import { PermissionGroup, useRoleStore } from './use-role-store';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RolesForm } from './roles-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useModalStore } from '@/utils/modal/use-modal-store';

export function PermissionsTable() {
  const { openModal, closeModal } = useModalStore();
  const {
    roles,
    permissions: rolePermissions,
    fetchRoles,
    fetchPermissions
  } = useRoleStore();
  const [isEditing, setIsEditing] = useState(false);
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  useEffect(() => {
    setPermissions(rolePermissions);
  }, [rolePermissions]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const currentRoleNames = roles.map((role) => role.name);
    console.log({ permissions });
    const dataToSend = {
      roles,
      permissions: permissions.flatMap((group) =>
        group.permissions.map((permission) => {
          // Filtrar solo los roles existentes
          const filteredRoles = Object.fromEntries(
            Object.entries(permission.roles).filter(([roleName]) =>
              currentRoleNames.includes(roleName)
            )
          );

          return {
            id: permission.id,
            name: permission.name,
            key: permission.key,
            category_id: permission.category_id,
            roles: filteredRoles
          };
        })
      )
    };
    // Simular envío a la API
    console.log('Datos actualizados:', {
      dataToSend
    });

    // Aquí enviarías los datos a la API
  };

  const handleCheckboxChange = (
    groupIndex: number,
    permissionIndex: number,
    roleName: string,
    checked: boolean
  ) => {
    console.log(
      'Checkbox changed:',
      groupIndex,
      permissionIndex,
      roleName,
      checked
    );
    const updatedPermissions = [...permissions];
    updatedPermissions[groupIndex].permissions[permissionIndex].roles[
      roleName as keyof (typeof updatedPermissions)[number]['permissions'][number]['roles']
    ] = checked;
    console.log(updatedPermissions);
    setPermissions(updatedPermissions);
  };

  const openRolesModal = () => {
    openModal({
      title: 'Gestionar Roles',
      content: <RolesForm onClose={closeModal} />
    });
  };

  return (
    <>
      <div className="w-full max-w-4xl">
        {permissions.map((group, groupIndex) => (
          <div key={group.category} className={groupIndex !== 0 ? 'mt-8' : ''}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {group.category}
              </h3>
              {groupIndex === 0 && (
                <Button variant="outline" size="sm" onClick={openRolesModal}>
                  Gestionar Roles
                </Button>
              )}
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <Table className="w-full text-sm">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="px-4 py-4 text-left">
                      Acciones
                    </TableHead>
                    {roles.map((role) => (
                      <TableHead
                        className="w-[20%] min-w-32 px-4 py-4 text-center lowercase first-letter:uppercase"
                        key={role.id}
                      >
                        {role.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.permissions.map((permission, permissionIndex) => (
                    <TableRow key={permission.id + permissionIndex}>
                      <TableCell className="truncate px-4 py-4">
                        {permission.name}
                      </TableCell>
                      {roles.map((role) => (
                        <TableCell
                          key={role.id}
                          className="py-4 !pr-2 text-center"
                        >
                          <Checkbox
                            checked={
                              permission.roles[
                                role.name as keyof typeof permission.roles
                              ]
                            }
                            disabled={!isEditing}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                groupIndex,
                                permissionIndex,
                                role.name,
                                !!checked
                              )
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleEdit} disabled={isEditing}>
            Editar Roles
          </Button>
          <Button onClick={handleSave} className="ml-2" disabled={!isEditing}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </>
  );
}

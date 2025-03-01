import { Role, PermissionGroup } from './use-role-store';

export const mockRoles: Role[] = [
  { id: 1, name: 'USER' },
  { id: 2, name: 'ADMIN' },
  { id: 3, name: 'SUPERADMIN' }
];

export const mockPermissions: PermissionGroup[] = [
  {
    id: 1,
    category: 'Gestión de Reservas',
    permissions: [
      {
        id: 1,
        name: 'Crear reserva',
        key: 'create_reservation',
        category_id: 1,
        roles: { USER: false, ADMIN: true, SUPERADMIN: true }
      },
      {
        id: 2,
        name: 'Editar reserva',
        key: 'edit_reservation',
        category_id: 1,
        roles: { USER: false, ADMIN: true, SUPERADMIN: true }
      },
      {
        id: 3,
        name: 'Eliminar reserva',
        key: 'delete_reservation',
        category_id: 1,
        roles: { USER: false, ADMIN: false, SUPERADMIN: true }
      }
    ]
  },
  {
    id: 2,
    category: 'Panel de Administración',
    permissions: [
      {
        id: 4,
        name: 'Ver dashboard',
        key: 'view_dashboard',
        category_id: 2,
        roles: { USER: false, ADMIN: true, SUPERADMIN: true }
      },
      {
        id: 5,
        name: 'Gestionar usuarios',
        key: 'manage_users',
        category_id: 2,
        roles: { USER: false, ADMIN: false, SUPERADMIN: true }
      }
    ]
  }
];

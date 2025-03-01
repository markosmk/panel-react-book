// import axiosApp from '@/lib/axios';
import { create } from 'zustand';
import { mockPermissions, mockRoles } from './mock-data';

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
  key: string;
  category_id: number;
  roles: Record<string, boolean>;
}

export interface PermissionGroup {
  id: number;
  category: string;
  permissions: Permission[];
}

interface RoleState {
  roles: Role[];
  permissions: PermissionGroup[];
  fetchRoles: () => void;
  fetchPermissions: () => void;
  updateRoles: (updatedRoles: Role[]) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  permissions: [],
  fetchRoles: () => set({ roles: mockRoles }), // Mock: Simula una llamada API
  fetchPermissions: () => set({ permissions: mockPermissions }), // Mock: Simula una llamada API
  //   fetchRoles: async () => {
  //     const response = await axiosApp.get('/api/roles');
  //     set({ roles: response.data });
  //   },
  //   fetchPermissions: async () => {
  //     const response = await axiosApp.get('/api/permissions');
  //     set({ permissions: response.data });
  //   },
  updateRoles: (updatedRoles) =>
    set((state) => {
      // Actualizar los permisos para incluir nuevos roles y eliminar roles obsoletos
      const updatedPermissions = state.permissions.map((group) => ({
        ...group,
        permissions: group.permissions.map((permission) => ({
          ...permission,
          roles: Object.fromEntries(
            updatedRoles.map((role) => [
              role.name,
              permission.roles[role.name] ?? false // Mantener el valor existente o usar `false`
            ])
          )
        }))
      }));
      // console.log({
      //   roles: updatedRoles,
      //   permissions: updatedPermissions
      // });
      return {
        roles: updatedRoles,
        permissions: updatedPermissions
      };
    })
}));

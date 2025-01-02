export enum Role {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export interface UserTable {
  id: string;
  name: string;
  email: string;
  password?: string;
  username: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

import * as React from 'react';
import { Navigate } from 'react-router-dom';

import { toast } from '@/components/notifications';
import { usePathname } from '@/routes/hooks/use-pathname';
import { useAuthStore } from '@/stores/use-auth-store';
import { Role } from '@/types/user.types';

type Props = {
  children: React.ReactNode;
  allowedRoles: Role[];
};

export function RoleRoute({ children, allowedRoles }: Props) {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role as Role)) {
    toast.error('No tienes permiso para acceder a esta sección: ' + pathname);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

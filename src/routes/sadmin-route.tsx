import * as React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/providers/auth-provider';
import { toast } from '@/components/notifications';
import { usePathname } from './hooks';

export function SAdminRoute({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const {
    user,
    isAuthenticated
    // logoutAction
  } = useAuth();

  if (!isAuthenticated || !user || user?.role !== 'SUPERADMIN') {
    toast.error('No tienes permiso para acceder a esta sección: ' + pathname);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

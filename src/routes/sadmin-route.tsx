import * as React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/providers/auth-provider';
import { createNotification } from '@/components/notifications';
import { usePathname } from './hooks';

export function SAdminRoute({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const {
    user,
    isAuthenticated
    // logoutAction
  } = useAuth();

  if (!isAuthenticated || !user || user?.role !== 'SUPERADMIN') {
    createNotification({
      type: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permiso para acceder a esta sección: ' + pathname
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

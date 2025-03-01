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
  const hasShownToast = React.useRef(false);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role as Role)) {
    if (!hasShownToast.current) {
      toast.error('No tienes permiso para acceder a esta sección: ' + pathname);
      hasShownToast.current = true;
    }
    return <Navigate to="/" replace />;
  }

  hasShownToast.current = false;
  return <>{children}</>;
}

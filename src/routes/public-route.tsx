import * as React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/use-auth-store';

export function PublicRoute({ children }: React.PropsWithChildren) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

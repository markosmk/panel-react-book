import * as React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/providers/auth-provider';

export function PublicRoute({ children }: React.PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

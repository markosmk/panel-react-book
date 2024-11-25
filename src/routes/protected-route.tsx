import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/providers/auth-provider';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        Loading Protected Route...
      </div>
    );

  if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

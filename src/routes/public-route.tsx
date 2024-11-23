import { Navigate } from 'react-router-dom';
import { useCurrentUser } from './hooks/use-auth';
import * as React from 'react';
import { useAuth } from '@/providers/auth-provider';

export function PublicRoute({ children }: React.PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useCurrentUser();

  if (isAuthenticated) return <Navigate to="/" replace />;

  if (isLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        Loading public page...
      </div>
    );

  if (!data || !isAuthenticated) return <>{children}</>;

  return <Navigate to="/" replace />;
}

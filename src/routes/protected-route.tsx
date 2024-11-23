import { Navigate } from 'react-router-dom';
import { useCurrentUser } from './hooks/use-auth';
import { PropsWithChildren } from 'react';
import { useAuth } from '@/providers/auth-provider';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        Loading Protected Route...
      </div>
    );

  if (isError || !data) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

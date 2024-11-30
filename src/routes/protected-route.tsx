import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '@/providers/auth-provider';
import { PendingContent } from '@/components/pending-content';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PendingContent className="min-h-screen" />;

  if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

import * as React from 'react';
import { Navigate } from 'react-router-dom';

import { PendingContent } from '@/components/pending-content';
import { useAuthStore } from '@/stores/use-auth-store';

export function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { isAuthenticated, isLoading, isClosing } = useAuthStore();

  // const location = useLocation();
  // React.useEffect(() => {
  //   const checkinginCookie = Cookies.get('app_user');
  // if (!checkinginCookie) {
  //   const action = async () => await logoutAction();
  //   action();
  // }
  // }, [location]);

  if (isLoading || isClosing)
    return <PendingContent className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

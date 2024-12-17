import * as React from 'react';
import {
  Navigate
  // useLocation
} from 'react-router-dom';

import { useAuth } from '@/providers/auth-provider';
import { PendingContent } from '@/components/pending-content';
// import Cookies from 'js-cookie';

export function ProtectedRoute({ children }: React.PropsWithChildren) {
  const {
    isAuthenticated,
    isLoading,
    isClosing
    // logoutAction
  } = useAuth();
  // const location = useLocation();

  // const checkinginCookie = Cookies.get('app_user');

  // React.useEffect(() => {
  //   console.log('protected...', location);
  //   const checkinginCookie = Cookies.get('app_user');
  //   console.log('checkinginCookie...', checkinginCookie);
  // if (!checkinginCookie) {
  //   console.log('desaparecio la cookie');
  //   const action = async () => await logoutAction();
  //   action();
  // }
  // }, [location]);

  if (isLoading || isClosing)
    return <PendingContent className="min-h-screen" />;

  if (!isAuthenticated && !isLoading) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

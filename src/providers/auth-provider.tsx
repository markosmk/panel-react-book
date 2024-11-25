/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { tokenClient } from '@/services/token';
import { User } from '@/types/app.types';
import { queryClient } from '.';
import { authClient } from '@/services/auth';

interface AuthContextType {
  user: { id: string; role: string; email: string; name?: string } | null;
  isAuthenticated: boolean;
  loginAction: (user: User, token?: string) => void;
  logoutAction: () => void;
  // errors: string[];
  isLoading: boolean;
  isClosing: boolean;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<AuthContextType['user']>(null);
  // const [errors, setErrors] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    const checkLogin = async () => {
      const token = tokenClient.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await authClient.getUser();
        // console.log('res', response);
        setIsAuthenticated(response ? true : false);
        setUser(response ? response.user : null);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  // action to ejecute login
  const loginAction = React.useCallback((user: User, token?: string) => {
    queryClient.clear();

    if (token) {
      tokenClient.setToken(token);
    }

    setUser(user);
    setIsAuthenticated(true);
  }, []);

  // action available to logout
  const logoutAction = React.useCallback(async () => {
    setIsClosing(true);
    await authClient.logout();
    tokenClient.removeToken();
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
    setIsClosing(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loginAction,
        logoutAction,
        // errors,
        isLoading,
        isClosing
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

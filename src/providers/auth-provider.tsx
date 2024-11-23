/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { tokenClient } from '@/services/token';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const token = tokenClient.getToken();
    // if (token) setIsAuthenticated(true);
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

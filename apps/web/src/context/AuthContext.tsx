import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { loginUser } from '../services/auth.service';
import { showError, showSuccess } from '../utils/toast';
import type { LoginCredentials, AuthContextType, RegisterCredentials } from '../types/auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      await loginUser(credentials);
      setIsAuthenticated(true);
    } catch (error: any) {
      showError(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    showSuccess('Logged out successfully');
  };

  const register = async (credentials: RegisterCredentials) => {
    
  };

  return (
    <AuthContext.Provider value={{ login, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

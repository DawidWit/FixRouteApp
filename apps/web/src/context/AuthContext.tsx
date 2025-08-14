import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { loginUser, registerUser } from '../services/auth.service';
import { showError, showSuccess } from '../utils/toast';
import type { LoginCredentials, AuthContextType, RegisterCredentials, RegisterResponse, RegisterResult } from '../../../shared_types/auth.types';
import { useTranslation } from 'react-i18next';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      await loginUser(credentials);
      setIsAuthenticated(true);
    } catch (error: any) {
      showError(t(error.message ?? "login-unexpected-error"));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    showSuccess('Logged out successfully');
  };

 const register = async (credentials: RegisterCredentials): Promise<RegisterResult> => {
  try {
    const data: RegisterResponse = await registerUser(credentials);
    if (data.accessToken) {
      showSuccess(t("register-success"));
      return { success: true, data };
    } else {
      showError(t("register-no-token"));
      return { success: false, error: "No access token received" };
    }
  } catch (error: any) {
    showError(t(error.message ?? "register-unexpected-error"));
    return { success: false, error: error.message ?? "register-unexpected-error" };
  }
};

  return (
    <AuthContext.Provider value={{ login, logout, register, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

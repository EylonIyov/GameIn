import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/types';
import { authService } from '../services/gameApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const initializeAuth = async () => {
      const savedToken = authService.getToken();
      const savedUser = authService.getUser();

      if (savedToken && savedUser) {
        try {
          // Verify token is still valid
          const response = await authService.verifyToken(savedToken);
          if (response.valid) {
            setToken(savedToken);
            setUser(response.user);
          } else {
            // Token is invalid, clear stored data
            authService.removeToken();
            authService.removeUser();
          }
        } catch (error) {
          // Token verification failed, clear stored data
          authService.removeToken();
          authService.removeUser();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(username, password);
      
      if (response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        
        // Save to localStorage
        authService.saveToken(response.token);
        authService.saveUser(response.user);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authService.removeToken();
    authService.removeUser();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
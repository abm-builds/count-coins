import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService, LoginData, SignupData, User } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Derive isAuthenticated from user state
  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth-token');
      const savedUser = localStorage.getItem('auth-user');

      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching profile
          const user = await authService.getProfile();
          setUser(user);
          localStorage.setItem('auth-user', JSON.stringify(user));
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth-user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      const result = await authService.login(data);
      setUser(result.user);
      localStorage.setItem('auth-token', result.token);
      localStorage.setItem('auth-user', JSON.stringify(result.user));
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const result = await authService.signup(data);
      setUser(result.user);
      localStorage.setItem('auth-token', result.token);
      localStorage.setItem('auth-user', JSON.stringify(result.user));
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    
    // Clear all cached data
    queryClient.clear();
    
    toast.success('Logged out successfully');
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      setUser(null);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      
      // Clear all cached data
      queryClient.clear();
      
      toast.success('Account deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, SignupData, LoginData } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<SignupData>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on mount
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
      const response = await authService.login(data);
      localStorage.setItem('auth-token', response.token);
      localStorage.setItem('auth-user', JSON.stringify(response.user));
      setUser(response.user);
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await authService.signup(data);
      localStorage.setItem('auth-token', response.token);
      localStorage.setItem('auth-user', JSON.stringify(response.user));
      setUser(response.user);
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
  };

  const updateUser = async (data: Partial<SignupData>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('auth-user', JSON.stringify(updatedUser));
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Could not update profile',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      setUser(null);
      toast({
        title: 'Account Deleted',
        description: 'Your account has been deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Could not delete account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
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


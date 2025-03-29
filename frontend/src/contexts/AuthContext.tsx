import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';

interface AuthResponse {
  token: string;
  refresh: string;
  user: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    has_completed_onboarding: boolean;
  };
}

interface RegistrationResponse {
  message: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<RegistrationResponse>;
  completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user data
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<AuthResponse['user']>('/api/accounts/me/');
      setUser(response.data);
      setHasCompletedOnboarding(response.data.has_completed_onboarding);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If we can't fetch user data, user is probably not authenticated
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await axios.post<AuthResponse>('/api/accounts/login/', {
        login: email,
        password,
      });
      
      console.log('Login response:', response.data);
      
      if (!response.data.token || !response.data.refresh || !response.data.user) {
        throw new Error('Invalid response from server');
      }
      
      // Set tokens
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Update state
      setIsAuthenticated(true);
      setUser(response.data.user);
      setHasCompletedOnboarding(response.data.user.has_completed_onboarding);
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      
      if (error.response?.status === 401) {
        if (error.response.data?.requires_verification) {
          throw new Error('Please verify your email before signing in.');
        } else if (error.response.data?.error) {
          throw new Error(error.response.data.error);
        }
      }
      
      throw new Error('Invalid email or password.');
    }
  };

  const register = async (email: string, password: string, name: string): Promise<RegistrationResponse> => {
    try {
      const [firstName, ...lastNameParts] = name.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      if (!firstName) {
        throw new Error('Please enter your name');
      }

      console.log('Sending registration request with:', {
        email,
        first_name: firstName,
        last_name: lastName || firstName
      });

      // Register the user
      const response = await axios.post<RegistrationResponse>('/api/accounts/register/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName || firstName,
      });

      console.log('Registration API response:', response.data);

      // Validate response data
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response from server');
      }

      // Return the response data with default message if not provided
      return {
        message: response.data.message || 'Registration successful. Please verify your email.',
        email: response.data.email || email
      };
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);
      
      // Handle specific validation errors
      if (error.response?.data) {
        const data = error.response.data;
        if (data.email?.[0]) {
          throw new Error(data.email[0]);
        } else if (data.password?.[0]) {
          throw new Error(data.password[0]);
        } else if (data.first_name?.[0]) {
          throw new Error(data.first_name[0]);
        } else if (data.last_name?.[0]) {
          throw new Error(data.last_name[0]);
        } else if (data.error) {
          throw new Error(data.error);
        } else if (data.detail) {
          throw new Error(data.detail);
        } else if (typeof data === 'string') {
          throw new Error(data);
        }
      }
      
      // If it's a network error or other axios error
      if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  };

  const completeOnboarding = async () => {
    try {
      await axios.post('/api/accounts/complete-onboarding/');
      setHasCompletedOnboarding(true);
      if (user) {
        setUser({ ...user, has_completed_onboarding: true });
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    setUser(null);
    setHasCompletedOnboarding(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        hasCompletedOnboarding,
        login,
        logout,
        register,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
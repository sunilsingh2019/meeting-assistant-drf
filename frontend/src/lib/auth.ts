import Cookies from 'js-cookie';
import axiosInstance from './axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AuthResponse {
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

export const setAuthTokens = (token: string, refresh: string) => {
  // Set in localStorage for axios interceptor
  localStorage.setItem('access_token', token);
  localStorage.setItem('refresh_token', refresh);
  
  // Set in cookies for middleware
  Cookies.set('token', token, { path: '/' });
};

export const removeAuthTokens = () => {
  // Remove from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  // Remove from cookies
  Cookies.remove('token', { path: '/' });
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with:', { email });
    const response = await axiosInstance.post<AuthResponse>('/api/accounts/login/', {
      login: email,
      password,
    });
    
    console.log('Login response:', response.data);
    
    if (!response.data.token) {
      throw new Error('No token received from server');
    }
    
    // Set tokens
    setAuthTokens(response.data.token, response.data.refresh);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      if (error.response.data?.requires_verification) {
        throw new Error('Please verify your email before signing in.');
      }
      throw new Error('Invalid email or password.');
    }
    throw error;
  }
};

export const register = async (email: string, password: string, name: string): Promise<void> => {
  try {
    const [firstName, ...lastNameParts] = name.trim().split(' ');
    const lastName = lastNameParts.join(' ');

    // Register the user
    const response = await axiosInstance.post('/api/accounts/register/', {
      email,
      password,
      first_name: firstName,
      last_name: lastName || firstName,
    });

    // Send verification email immediately after registration
    await axiosInstance.post('/api/accounts/resend-verification-email/', {
      email,
    });

    // Don't set auth tokens since email verification is required
    return;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = () => {
  removeAuthTokens();
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token') && !!Cookies.get('token');
};

export const resendVerification = async (email: string): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>('/api/accounts/resend-verification-email/', {
    email,
  });
  return response.data;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
}; 
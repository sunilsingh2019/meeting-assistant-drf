'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      name: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup' && !formData.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      console.log('Google login clicked');
      router.push('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement Microsoft OAuth
      console.log('Microsoft login clicked');
      router.push('/dashboard');
    } catch (error) {
      console.error('Microsoft login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {mode === 'signin' 
            ? 'Welcome back! Please enter your details.'
            : 'Get started with your free account.'}
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="relative flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-base font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Image
            src="/images/logos/google-logo.svg"
            alt="Google"
            width={20}
            height={20}
            className="absolute left-4"
          />
          <span>Continue with Google</span>
          <span className="absolute right-4">→</span>
        </button>

        <button
          type="button"
          onClick={handleMicrosoftLogin}
          disabled={isLoading}
          className="relative flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-gray-800 px-4 py-3 text-base font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Image
            src="/images/logos/microsoft-logo.svg"
            alt="Microsoft"
            width={20}
            height={20}
            className="absolute left-4"
          />
          <span>Continue with Microsoft</span>
          <span className="absolute right-4">→</span>
        </button>
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-900 px-4 text-gray-500 dark:text-gray-400">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`block w-full rounded-lg border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                  errors.name ? 'ring-red-300 dark:ring-red-500' : 'ring-gray-300 dark:ring-gray-700'
                } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`block w-full rounded-lg border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                errors.email ? 'ring-red-300 dark:ring-red-500' : 'ring-gray-300 dark:ring-gray-700'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              className={`block w-full rounded-lg border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ${
                errors.password ? 'ring-red-300 dark:ring-red-500' : 'ring-gray-300 dark:ring-gray-700'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>
        </div>

        {mode === 'signin' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link 
                href="/auth/forgot-password" 
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              mode === 'signin' ? 'Sign in' : 'Create account'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secured by 256-bit AES and 256-bit SSL/TLS encryption
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <Link
          href={mode === 'signin' ? '/auth/signup' : '/auth/signin'}
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {mode === 'signin' ? 'Create an account' : 'Sign in'}
        </Link>
      </p>
    </div>
  );
} 
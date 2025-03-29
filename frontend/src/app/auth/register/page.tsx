'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate password
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Validate name
      if (!name.trim()) {
        throw new Error('Please enter your name');
      }

      // Validate email
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Call the register function from AuthContext
      const response = await register(email, password, name);
      console.log('Registration successful:', response);
      
      // Set the registered email and show verification message
      setRegisteredEmail(email);
      setIsRegistered(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.message) {
        setError(err.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.email?.[0]) {
        setError(err.response.data.email[0]);
      } else if (err.response?.data?.password?.[0]) {
        setError(err.response.data.password[0]);
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    
    try {
      await axios.post('/api/accounts/resend-verification-email/', { email: registeredEmail });
      alert('Verification email has been resent. Please check your inbox.');
    } catch (error: any) {
      console.error('Failed to resend verification email:', error);
      alert(error.response?.data?.error || 'Failed to resend verification email. Please try again.');
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/logo.svg"
                alt="Meeting Assistant"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verify Your Email Address
            </h2>
            <div className="text-gray-600 space-y-4">
              <p>
                We've sent a verification email to <span className="font-medium">{registeredEmail}</span>.
                Please check your inbox and click the verification link to activate your account.
              </p>
              <p className="text-sm">
                If you don't receive the email within a few minutes, please check your spam folder or{' '}
                <button
                  onClick={handleResendVerification}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  click here to resend it
                </button>.
              </p>
              <div className="border-t border-gray-200 my-6 pt-6">
                <p className="text-sm text-gray-500">
                  Already verified?{' '}
                  <Link
                    href="/auth/signin"
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Sign in to your account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <Image
          src="/images/logo.svg"
          alt="Meeting Assistant"
          width={48}
          height={48}
          className="h-12 w-auto"
        />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
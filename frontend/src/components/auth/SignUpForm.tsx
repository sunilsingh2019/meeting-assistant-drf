'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { register } from '../../lib/auth';

export default function SignUpForm() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      // TODO: Implement Google sign up
      console.log('Google sign up clicked');
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign up error:', error);
    }
  };

  const handleMicrosoftSignUp = async () => {
    try {
      // TODO: Implement Microsoft sign up
      console.log('Microsoft sign up clicked');
      router.push('/dashboard');
    } catch (error) {
      console.error('Microsoft sign up error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if already loading
    if (isLoading) return;
    
    // Reset errors
    setErrors({
      email: '',
      password: '',
      name: ''
    });

    // Validate inputs
    let hasErrors = false;
    const newErrors = {
      email: '',
      password: '',
      name: ''
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      hasErrors = true;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting registration with:', { email: formData.email, name: formData.name });
      const response = await register(formData.email, formData.password, formData.name);
      console.log('Registration successful:', response);
      
      // Show success message and redirect
      router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      if (error.response?.data) {
        const serverErrors = error.response.data;
        setErrors({
          email: serverErrors.email?.[0] || '',
          password: serverErrors.password?.[0] || '',
          name: serverErrors.first_name?.[0] || serverErrors.last_name?.[0] || ''
        });
      } else if (error.message) {
        // If it's a custom error message from our register function
        const errorLower = error.message.toLowerCase();
        if (errorLower.includes('email')) {
          setErrors(prev => ({ ...prev, email: error.message }));
        } else if (errorLower.includes('password')) {
          setErrors(prev => ({ ...prev, password: error.message }));
        } else if (errorLower.includes('name')) {
          setErrors(prev => ({ ...prev, name: error.message }));
        } else {
          // Generic error
          setErrors(prev => ({ ...prev, email: error.message }));
        }
      } else {
        // Fallback error
        setErrors(prev => ({ ...prev, email: 'An error occurred during registration. Please try again.' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  return (
    <div className="mt-8 space-y-6">
      {!showEmailForm ? (
        <>
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignUp}
              className="group relative w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Image
                src="/images/logos/google-logo.svg"
                alt="Google"
                width={20}
                height={20}
                className="absolute left-4 group-hover:scale-110 transition-transform duration-200"
                sizes="20px"
              />
              <span className="ml-2">Continue with Google</span>
            </button>

            <button
              onClick={handleMicrosoftSignUp}
              className="group relative w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Image
                src="/images/logos/microsoft-logo.svg"
                alt="Microsoft"
                width={20}
                height={20}
                className="absolute left-4 group-hover:scale-110 transition-transform duration-200"
                sizes="20px"
              />
              <span className="ml-2">Continue with Microsoft</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div className="text-center">
            <button
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-150"
              onClick={() => setShowEmailForm(true)}
            >
              Other ways to sign up
            </button>
          </div>

          <div className="mt-1 text-center">
            <Link
              href="#"
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-150"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Show calendar access info
                console.log('Why calendar access clicked');
              }}
            >
              Why does Meeting Assistant need calendar access?
            </Link>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative mt-1 rounded-xl shadow-sm">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm shadow-sm"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="relative mt-1 rounded-xl shadow-sm">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm shadow-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1 rounded-xl shadow-sm">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 text-sm shadow-sm pr-10"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
            <PasswordStrengthIndicator password={formData.password} />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
              onClick={() => setShowEmailForm(false)}
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to other options
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 
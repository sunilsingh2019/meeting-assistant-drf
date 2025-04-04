'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/axios';

interface VerificationResponse {
  message: string;
  error?: string;
}

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL and ensure it's properly formatted
        const rawToken = typeof params.token === 'string' ? params.token : params.token[0];
        console.log('Raw token from params:', rawToken); // Debug log
        
        // Clean the token - remove any URL encoding and trailing slashes
        const token = decodeURIComponent(rawToken).replace(/\/$/, '');
        console.log('Cleaned token:', token); // Debug log
        console.log('Token length:', token.length); // Debug log
        
        // Ensure token is not undefined or empty
        if (!token) {
          throw new Error('No verification token provided');
        }

        // Validate token format
        if (token.length !== 64) {
          throw new Error(`Invalid verification token format (length: ${token.length}, expected: 64)`);
        }

        console.log('Making verification request with token:', token); // Debug log
        
        // Make the verification request - ensure no trailing slash
        const response = await axios.get<VerificationResponse>(`/api/accounts/verify-email/${token}`);
        console.log('Verification API response:', response.data); // Debug log
        
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully! You can now sign in.');
        
        // Redirect to sign in after success
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } catch (error: any) {
        console.error('Verification error details:', {
          error,
          response: error.response?.data,
          status: error.response?.status,
          token: params.token
        });
        
        setStatus('error');
        const errorMessage = error.response?.data?.error || 
                           error.message || 
                           'Failed to verify email. Please try again or contact support.';
        setMessage(errorMessage);
        
        // Set detailed error message for debugging
        setErrorDetails(
          error.response?.data?.error || 
          'If this error persists, please try registering again or contact support.'
        );
      }
    };

    if (params.token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
      setErrorDetails('Please ensure you clicked the correct link from your email.');
    }
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verification
          </h2>
          <div className="mt-4">
            {status === 'verifying' && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">{message}</p>
              </div>
            )}
            {status === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="mt-4 text-lg text-green-600">{message}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Redirecting you to sign in...
                </p>
                <Link
                  href="/auth/signin"
                  className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Click here if you're not redirected
                </Link>
              </div>
            )}
            {status === 'error' && (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="mt-4 text-lg text-red-600">{message}</p>
                <p className="mt-2 text-sm text-gray-500">{errorDetails}</p>
                <div className="mt-6 space-y-4">
                  <Link
                    href="/auth/register"
                    className="block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Register with a Different Email
                  </Link>
                  <Link
                    href="/auth/verify"
                    className="block text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Resend Verification Email
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useEffect, useState, useRef } from 'react';
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

  // Prevent multiple API calls
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasFetched.current) return; // Prevent duplicate API calls
      hasFetched.current = true; // Mark request as initiated

      try {
        const rawToken = typeof params.token === 'string' ? params.token : params.token[0];
        const token = decodeURIComponent(rawToken).replace(/\/$/, '');

        if (!token || token.length !== 64) {
          throw new Error('Invalid verification token.');
        }

        const response = await axios.get<VerificationResponse>(`/api/accounts/verify-email/${token}`);

        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');

        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Failed to verify email.');
        setErrorDetails('Please try again or contact support.');
      }
    };

    if (params.token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
      setErrorDetails('Please Ensure you clicked the correct link from your email.');
    }
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h2>
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
                <p className="mt-2 text-sm text-gray-500">Redirecting you to sign in...</p>
                <Link href="/auth/signin" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">
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
                  <Link href="/auth/register" className="block text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Register with a Different Email
                  </Link>
                  <Link href="/auth/verify" className="block text-sm font-medium text-indigo-600 hover:text-indigo-500">
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

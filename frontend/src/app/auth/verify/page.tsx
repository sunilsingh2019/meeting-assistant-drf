'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // Redirect to register if no email is provided
  useEffect(() => {
    if (!email) {
      router.replace('/auth/register');
    }
  }, [email, router]);

  const handleResendVerification = async () => {
    if (!email) return;
    
    setResendStatus('sending');
    setError('');
    
    try {
      await axiosInstance.post('/api/accounts/resend-verification-email/', { email });
      setResendStatus('success');
      setTimeout(() => setResendStatus('idle'), 5000);
    } catch (err: any) {
      setResendStatus('error');
      setError(err.response?.data?.error || 'Failed to resend verification email. Please try again.');
      setTimeout(() => setResendStatus('idle'), 5000);
    }
  };

  if (!email) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verify Your Email Address
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              Before continuing, we need to verify your email address. Please check your inbox for a confirmation link.
            </p>
            <p className="text-sm">
              If you do not receive the email at <span className="font-medium">{email}</span> within an hour, we can{' '}
              <button
                onClick={handleResendVerification}
                disabled={resendStatus === 'sending'}
                className="text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendStatus === 'sending' ? 'Sending...' : 'resend it to you'}
              </button>
            </p>
            {resendStatus === 'success' && (
              <p className="text-sm text-green-600">
                Verification email has been resent. Please check your inbox.
              </p>
            )}
            {(resendStatus === 'error' || error) && (
              <p className="text-sm text-red-600">
                {error || 'Failed to resend verification email. Please try again.'}
              </p>
            )}
            <div className="border-t border-gray-200 my-6 pt-6">
              <p className="text-sm text-gray-500">
                Want to use a different email? {' '}
                <Link
                  href="/auth/register"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Register with another account
                </Link>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Already verified? {' '}
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
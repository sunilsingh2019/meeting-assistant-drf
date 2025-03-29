import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/verify-email/', { token });
        setStatus('success');
        setMessage('Email verified successfully! You can now sign in.');
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify email. Please try again or contact support.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <div className="mt-4">
            {status === 'verifying' && (
              <div className="animate-pulse">
                <div className="w-12 h-12 mx-auto border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-gray-600">{message}</p>
              </div>
            )}
            {status === 'success' && (
              <div>
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="mt-4 text-lg text-green-600">{message}</p>
              </div>
            )}
            {status === 'error' && (
              <div>
                <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p className="mt-4 text-lg text-red-600">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 
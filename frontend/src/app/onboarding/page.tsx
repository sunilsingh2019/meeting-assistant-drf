'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';

interface MicrosoftConnectResponse {
  authorization_url: string;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Meeting Assistant',
    description: 'Let\'s set up your account in just a few steps to help you manage meetings more efficiently.'
  },
  {
    id: 'calendar',
    title: 'Connect Your Calendar',
    description: 'Connect your Microsoft calendar to start managing your meetings.'
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    description: 'Tell us about your working hours and meeting preferences.'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Your Meeting Assistant is ready to help you manage meetings more effectively.'
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    preferredMeetingDuration: 30
  });

  const handleMicrosoftConnect = async () => {
    try {
      const response = await axios.get<MicrosoftConnectResponse>('/api/accounts/microsoft/connect/');
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error('Error connecting to Microsoft:', error);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/accounts/preferences/', preferences);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding();
      router.replace('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <Image
              src="/images/welcome-illustration.svg"
              alt="Welcome"
              width={300}
              height={300}
              className="mx-auto mb-8"
            />
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Get Started
            </button>
          </div>
        );

      case 1:
        return (
          <div className="text-center">
            <button
              onClick={handleMicrosoftConnect}
              className="group relative w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Image
                src="/images/logos/microsoft-logo.svg"
                alt="Microsoft"
                width={20}
                height={20}
                className="absolute left-4"
              />
              <span className="ml-2">Connect Microsoft Calendar</span>
            </button>
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="mt-4 w-full flex justify-center py-2 px-4 text-sm text-gray-600 hover:text-gray-900"
            >
              Skip for now
            </button>
          </div>
        );

      case 2:
        return (
          <form onSubmit={handlePreferencesSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Working Hours</label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500">Start Time</label>
                  <input
                    type="time"
                    value={preferences.workingHours.start}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      workingHours: { ...preferences.workingHours, start: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">End Time</label>
                  <input
                    type="time"
                    value={preferences.workingHours.end}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      workingHours: { ...preferences.workingHours, end: e.target.value }
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Default Meeting Duration</label>
              <select
                value={preferences.preferredMeetingDuration}
                onChange={(e) => setPreferences({
                  ...preferences,
                  preferredMeetingDuration: parseInt(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Continue
            </button>
          </form>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <button
              onClick={handleComplete}
              className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Go to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {steps[currentStep].title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              {steps[currentStep].description}
            </p>
          </div>
          {renderStep()}
        </div>
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  currentStep === index
                    ? 'bg-indigo-600'
                    : currentStep > index
                    ? 'bg-indigo-200'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
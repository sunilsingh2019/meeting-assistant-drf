import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600">
              This is your personal dashboard where you can manage your meetings and settings.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample action cards */}
              <div className="bg-primary-50 rounded-lg p-6 hover:bg-primary-100 transition-colors duration-200">
                <h3 className="text-lg font-medium text-primary-900 mb-2">Schedule Meeting</h3>
                <p className="text-primary-600">Create a new meeting and invite participants.</p>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-6 hover:bg-primary-100 transition-colors duration-200">
                <h3 className="text-lg font-medium text-primary-900 mb-2">View Calendar</h3>
                <p className="text-primary-600">Check your upcoming meetings and events.</p>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-6 hover:bg-primary-100 transition-colors duration-200">
                <h3 className="text-lg font-medium text-primary-900 mb-2">Meeting History</h3>
                <p className="text-primary-600">Review past meetings and their summaries.</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {/* Sample activity items */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Meeting scheduled with Team Alpha</p>
                  <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Meeting notes updated</p>
                  <p className="text-sm text-gray-500">Project kickoff meeting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
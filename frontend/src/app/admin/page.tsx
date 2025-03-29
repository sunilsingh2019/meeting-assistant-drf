'use client';

import GmailSetup from '@/components/admin/GmailSetup';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Settings</h1>
                
                <div className="grid grid-cols-1 gap-6">
                    <GmailSetup />
                </div>
            </div>
        </div>
    );
} 
'use client';

import RequestWizard from '@/components/dashboard/RequestWizard';

export default function NewRequestPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            New Deletion Request
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Create a new data deletion request to protect your privacy
          </p>
        </div>
      </div>

      {/* Request Wizard */}
      <RequestWizard />
    </div>
  );
}

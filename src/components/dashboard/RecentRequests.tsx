import Link from 'next/link';

export default function RecentRequests() {
  const requests = [
    {
      id: 1,
      company: 'Acxiom Corporation',
      type: 'CCPA',
      status: 'completed',
      date: '2024-01-15',
      daysAgo: 5,
    },
    {
      id: 2,
      company: 'Epsilon Data Management',
      type: 'GDPR',
      status: 'in_progress',
      date: '2024-01-10',
      daysAgo: 10,
    },
    {
      id: 3,
      company: 'LexisNexis Risk Solutions',
      type: 'CCPA',
      status: 'pending',
      date: '2024-01-08',
      daysAgo: 12,
    },
    {
      id: 4,
      company: 'Experian Information Solutions',
      type: 'GDPR',
      status: 'completed',
      date: '2024-01-05',
      daysAgo: 15,
    },
    {
      id: 5,
      company: 'TransUnion LLC',
      type: 'CCPA',
      status: 'failed',
      date: '2024-01-03',
      daysAgo: 17,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white">
          Recent Requests
        </h2>
        <Link
          href="/dashboard/requests"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {request.company}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {getStatusText(request.status)}
                </span>
              </div>
              <div className="flex items-center mt-1 space-x-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {request.type}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {request.daysAgo} days ago
                </span>
              </div>
            </div>
            <div className="ml-4">
              <Link
                href={`/dashboard/requests/${request.id}`}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
            No requests yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Get started by creating your first deletion request.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/new-request"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Request
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

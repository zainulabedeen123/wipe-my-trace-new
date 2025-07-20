'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DeletionRequest {
  id: string;
  company: string;
  type: 'GDPR' | 'CCPA' | 'PIPEDA' | 'LGPD';
  status: 'pending' | 'sent' | 'in_progress' | 'completed' | 'failed' | 'rejected';
  createdDate: string;
  sentDate?: string;
  responseDate?: string;
  completedDate?: string;
  estimatedCompletion: string;
  cost: number;
  notes?: string;
}

const mockRequests: DeletionRequest[] = [
  {
    id: '1',
    company: 'Acxiom Corporation',
    type: 'CCPA',
    status: 'completed',
    createdDate: '2024-01-15',
    sentDate: '2024-01-15',
    responseDate: '2024-01-18',
    completedDate: '2024-02-05',
    estimatedCompletion: '2024-02-15',
    cost: 3.50,
    notes: 'Request completed successfully. Data confirmed deleted.'
  },
  {
    id: '2',
    company: 'Epsilon Data Management',
    type: 'GDPR',
    status: 'in_progress',
    createdDate: '2024-01-10',
    sentDate: '2024-01-10',
    responseDate: '2024-01-12',
    estimatedCompletion: '2024-02-10',
    cost: 3.50,
    notes: 'Company acknowledged request. Processing in progress.'
  },
  {
    id: '3',
    company: 'LexisNexis Risk Solutions',
    type: 'CCPA',
    status: 'pending',
    createdDate: '2024-01-08',
    estimatedCompletion: '2024-02-08',
    cost: 3.50
  },
  {
    id: '4',
    company: 'Experian Information Solutions',
    type: 'GDPR',
    status: 'completed',
    createdDate: '2024-01-05',
    sentDate: '2024-01-05',
    responseDate: '2024-01-08',
    completedDate: '2024-01-28',
    estimatedCompletion: '2024-02-05',
    cost: 3.50,
    notes: 'Data deletion confirmed via email.'
  },
  {
    id: '5',
    company: 'TransUnion LLC',
    type: 'CCPA',
    status: 'failed',
    createdDate: '2024-01-03',
    sentDate: '2024-01-03',
    responseDate: '2024-01-10',
    estimatedCompletion: '2024-02-03',
    cost: 3.50,
    notes: 'Company requires additional verification. Manual follow-up needed.'
  },
  {
    id: '6',
    company: 'Spokeo Inc.',
    type: 'CCPA',
    status: 'sent',
    createdDate: '2024-01-20',
    sentDate: '2024-01-20',
    estimatedCompletion: '2024-02-03',
    cost: 3.50
  }
];

export default function RequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('createdDate');

  const statuses = ['All', 'pending', 'sent', 'in_progress', 'completed', 'failed', 'rejected'];
  const types = ['All', 'GDPR', 'CCPA', 'PIPEDA', 'LGPD'];

  const filteredRequests = mockRequests
    .filter(request => {
      const matchesStatus = selectedStatus === 'All' || request.status === selectedStatus;
      const matchesType = selectedType === 'All' || request.type === selectedType;
      return matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'createdDate':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case 'company':
          return a.company.localeCompare(b.company);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'sent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'sent':
        return 'Sent';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'in_progress':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'failed':
      case 'rejected':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const totalCost = filteredRequests.reduce((sum, request) => sum + request.cost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Deletion Requests
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Track and manage your data deletion requests
            </p>
          </div>
          <Link
            href="/dashboard/new-request"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            New Request
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{filteredRequests.length}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Total Requests</div>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {filteredRequests.filter(r => r.status === 'completed').length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Completed</div>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {filteredRequests.filter(r => ['sent', 'in_progress'].includes(r.status)).length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">In Progress</div>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">${totalCost.toFixed(2)}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Total Cost</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status === 'All' ? 'All Statuses' : getStatusText(status)}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Type
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {types.map(type => (
                <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="createdDate">Date Created</option>
              <option value="company">Company</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            Deletion Requests ({filteredRequests.length})
          </h3>
        </div>
        
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(request.status)}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                      {request.company}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {request.type}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Created: {new Date(request.createdDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ${request.cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                  <Link
                    href={`/dashboard/requests/${request.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              {request.notes && (
                <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {request.notes}
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div>
                  Est. completion: {new Date(request.estimatedCompletion).toLocaleDateString()}
                </div>
                {request.completedDate && (
                  <div>
                    Completed: {new Date(request.completedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No requests found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Get started by creating your first deletion request.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/new-request"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              New Request
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

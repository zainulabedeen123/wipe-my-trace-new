'use client';

import { useState } from 'react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRequests: 42,
      completedRequests: 28,
      successRate: 67,
      avgResponseTime: 23,
      totalSavings: 147.00,
      companiesTargeted: 15
    },
    monthlyData: [
      { month: 'Jan', requests: 8, completed: 6, failed: 1, pending: 1 },
      { month: 'Feb', requests: 12, completed: 9, failed: 2, pending: 1 },
      { month: 'Mar', requests: 15, completed: 10, failed: 3, pending: 2 },
      { month: 'Apr', requests: 7, completed: 3, failed: 1, pending: 3 },
    ],
    categoryBreakdown: [
      { category: 'Data Brokers', count: 18, percentage: 43 },
      { category: 'Credit Bureaus', count: 12, percentage: 29 },
      { category: 'People Search', count: 8, percentage: 19 },
      { category: 'Marketing', count: 4, percentage: 9 },
    ],
    jurisdictionBreakdown: [
      { jurisdiction: 'CCPA', count: 24, percentage: 57 },
      { jurisdiction: 'GDPR', count: 15, percentage: 36 },
      { jurisdiction: 'PIPEDA', count: 3, percentage: 7 },
    ],
    topCompanies: [
      { name: 'Acxiom Corporation', requests: 3, successRate: 100 },
      { name: 'Epsilon Data Management', requests: 2, successRate: 100 },
      { name: 'LexisNexis Risk Solutions', requests: 2, successRate: 50 },
      { name: 'Experian Information Solutions', requests: 2, successRate: 100 },
      { name: 'TransUnion LLC', requests: 1, successRate: 0 },
    ]
  };

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Analytics & Reports
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Track your privacy protection progress and success metrics
            </p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  Total Requests
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {analyticsData.overview.totalRequests}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  Success Rate
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {analyticsData.overview.successRate}%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  Avg Response Time
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {analyticsData.overview.avgResponseTime} days
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  Total Spent
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  ${analyticsData.overview.totalSavings.toFixed(2)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  Companies Targeted
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {analyticsData.overview.companiesTargeted}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  Completed Requests
                </dt>
                <dd className="text-lg font-medium text-slate-900 dark:text-white">
                  {analyticsData.overview.completedRequests}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Monthly Request Trends
          </h3>
          <div className="space-y-4">
            {analyticsData.monthlyData.map((data) => (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-slate-600 dark:text-slate-300">
                  {data.month}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-4 relative">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${(data.requests / 15) * 100}%` }}
                      ></div>
                      <div
                        className="bg-green-500 h-4 rounded-full absolute top-0"
                        style={{ width: `${(data.completed / 15) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 w-16">
                      {data.completed}/{data.requests}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">Total Requests</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">Completed</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Requests by Category
          </h3>
          <div className="space-y-4">
            {analyticsData.categoryBreakdown.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-yellow-500'
                    }`}
                  ></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {category.count}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ({category.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jurisdiction Breakdown */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Requests by Jurisdiction
          </h3>
          <div className="space-y-4">
            {analyticsData.jurisdictionBreakdown.map((jurisdiction, index) => (
              <div key={jurisdiction.jurisdiction} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                  ></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {jurisdiction.jurisdiction}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {jurisdiction.count}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ({jurisdiction.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Top Targeted Companies
          </h3>
          <div className="space-y-4">
            {analyticsData.topCompanies.map((company) => (
              <div key={company.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {company.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {company.requests} request{company.requests !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    company.successRate >= 80 ? 'text-green-600 dark:text-green-400' :
                    company.successRate >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {company.successRate}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    success rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
          Export Reports
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Export as PDF
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Export as CSV
          </button>
          <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
}

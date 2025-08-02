'use client';

import { useState } from 'react';
import { useCompanies, CompanyFilters } from '@/hooks/useCompanies';
import { CompanyCategory, Difficulty, Jurisdiction } from '@prisma/client';



export default function DataBrokersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CompanyCategory | 'All'>('All');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction | 'All'>('All');
  const [sortBy, setSortBy] = useState('name');
  const [page] = useState(1);

  // Prepare filters for API
  const filters: CompanyFilters = {
    search: searchTerm || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    jurisdiction: selectedJurisdiction !== 'All' ? selectedJurisdiction : undefined,
    isActive: true
  };

  const { data, loading, error } = useCompanies(filters, page, 50);

  const categories = ['All', ...Object.values(CompanyCategory)];
  const jurisdictions = ['All', ...Object.values(Jurisdiction)];

  const companies = data?.companies || [];
  const totalCompanies = data?.total || 0;

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case Difficulty.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case Difficulty.HARD:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const formatCategory = (category: CompanyCategory) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-900 dark:text-red-200">Error Loading Companies</h3>
          <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Data Brokers Database
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Browse and manage data brokers and companies for deletion requests
            </p>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {companies.length} of {totalCompanies} companies
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Search companies..."
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Jurisdiction Filter */}
          <div>
            <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Jurisdiction
            </label>
            <select
              id="jurisdiction"
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {jurisdictions.map(jurisdiction => (
                <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
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
              <option value="name">Name</option>
              <option value="successRate">Success Rate</option>
              <option value="responseTime">Response Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Brokers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {company.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {company.description}
                </p>
                {company.website && (
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                  >
                    {company.website}
                  </a>
                )}
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(company.difficulty)}`}>
                {company.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{formatCategory(company.category)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Success Rate</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{company.successRate}%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Response</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{company.avgResponseTime} days</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Requests</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{company._count?.deletionRequests || 0}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Supported Jurisdictions</div>
              <div className="flex flex-wrap gap-2">
                {company.supportedJurisdictions.map((j) => (
                  <span key={j} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {j}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
              Send Deletion Request
            </button>
          </div>
        ))}
      </div>

      {companies.length === 0 && !loading && (
        <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No companies found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}

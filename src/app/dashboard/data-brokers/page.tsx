'use client';

import { useState } from 'react';

interface DataBroker {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  jurisdiction: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  avgResponseTime: string;
  successRate: number;
  lastUpdated: string;
}

const dataBrokers: DataBroker[] = [
  {
    id: '1',
    name: 'Acxiom Corporation',
    category: 'Data Broker',
    description: 'Consumer data and analytics company that collects and sells personal information',
    website: 'acxiom.com',
    jurisdiction: ['CCPA', 'GDPR'],
    difficulty: 'Medium',
    avgResponseTime: '21 days',
    successRate: 85,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Epsilon Data Management',
    category: 'Marketing',
    description: 'Email marketing and data services company',
    website: 'epsilon.com',
    jurisdiction: ['CCPA', 'GDPR'],
    difficulty: 'Easy',
    avgResponseTime: '14 days',
    successRate: 92,
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    name: 'LexisNexis Risk Solutions',
    category: 'Data Broker',
    description: 'Background checks and data aggregation services',
    website: 'risk.lexisnexis.com',
    jurisdiction: ['CCPA', 'GDPR', 'PIPEDA'],
    difficulty: 'Hard',
    avgResponseTime: '35 days',
    successRate: 68,
    lastUpdated: '2024-01-08'
  },
  {
    id: '4',
    name: 'Experian Information Solutions',
    category: 'Credit Bureau',
    description: 'Credit reporting and data services',
    website: 'experian.com',
    jurisdiction: ['CCPA', 'GDPR'],
    difficulty: 'Medium',
    avgResponseTime: '28 days',
    successRate: 78,
    lastUpdated: '2024-01-12'
  },
  {
    id: '5',
    name: 'TransUnion LLC',
    category: 'Credit Bureau',
    description: 'Credit reporting and risk management',
    website: 'transunion.com',
    jurisdiction: ['CCPA', 'GDPR'],
    difficulty: 'Medium',
    avgResponseTime: '25 days',
    successRate: 82,
    lastUpdated: '2024-01-14'
  },
  {
    id: '6',
    name: 'Spokeo Inc.',
    category: 'People Search',
    description: 'People search and background information',
    website: 'spokeo.com',
    jurisdiction: ['CCPA'],
    difficulty: 'Easy',
    avgResponseTime: '12 days',
    successRate: 95,
    lastUpdated: '2024-01-16'
  },
  {
    id: '7',
    name: 'BeenVerified LLC',
    category: 'People Search',
    description: 'Background checks and people search',
    website: 'beenverified.com',
    jurisdiction: ['CCPA'],
    difficulty: 'Easy',
    avgResponseTime: '10 days',
    successRate: 88,
    lastUpdated: '2024-01-18'
  },
  {
    id: '8',
    name: 'Intelius Inc.',
    category: 'People Search',
    description: 'Public records and background reports',
    website: 'intelius.com',
    jurisdiction: ['CCPA'],
    difficulty: 'Medium',
    avgResponseTime: '18 days',
    successRate: 76,
    lastUpdated: '2024-01-11'
  }
];

export default function DataBrokersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['All', 'Data Broker', 'Credit Bureau', 'People Search', 'Marketing'];
  const jurisdictions = ['All', 'CCPA', 'GDPR', 'PIPEDA'];

  const filteredBrokers = dataBrokers
    .filter(broker => {
      const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           broker.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || broker.category === selectedCategory;
      const matchesJurisdiction = selectedJurisdiction === 'All' || 
                                 broker.jurisdiction.includes(selectedJurisdiction);
      return matchesSearch && matchesCategory && matchesJurisdiction;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'successRate':
          return b.successRate - a.successRate;
        case 'responseTime':
          return parseInt(a.avgResponseTime) - parseInt(b.avgResponseTime);
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

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
            {filteredBrokers.length} of {dataBrokers.length} companies
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
        {filteredBrokers.map((broker) => (
          <div key={broker.id} className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {broker.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {broker.description}
                </p>
                <a 
                  href={`https://${broker.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                >
                  {broker.website}
                </a>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(broker.difficulty)}`}>
                {broker.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{broker.category}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Success Rate</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{broker.successRate}%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Response</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{broker.avgResponseTime}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Updated</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{broker.lastUpdated}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Supported Jurisdictions</div>
              <div className="flex flex-wrap gap-2">
                {broker.jurisdiction.map((j) => (
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

      {filteredBrokers.length === 0 && (
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

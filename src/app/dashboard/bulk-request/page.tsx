'use client';

import { useState } from 'react';

export default function BulkRequestPage() {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [jurisdiction, setJurisdiction] = useState('CCPA');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock company data
  const companies = [
    { id: '1', name: 'Acxiom Corporation', category: 'Data Broker', difficulty: 'Medium' },
    { id: '2', name: 'Epsilon Data Management', category: 'Marketing', difficulty: 'Easy' },
    { id: '3', name: 'LexisNexis Risk Solutions', category: 'Data Broker', difficulty: 'Hard' },
    { id: '4', name: 'Experian Information Solutions', category: 'Credit Bureau', difficulty: 'Medium' },
    { id: '5', name: 'TransUnion LLC', category: 'Credit Bureau', difficulty: 'Medium' },
    { id: '6', name: 'Equifax Inc.', category: 'Credit Bureau', difficulty: 'Medium' },
    { id: '7', name: 'Spokeo Inc.', category: 'People Search', difficulty: 'Easy' },
    { id: '8', name: 'BeenVerified LLC', category: 'People Search', difficulty: 'Easy' },
    { id: '9', name: 'Intelius Inc.', category: 'People Search', difficulty: 'Medium' },
    { id: '10', name: 'PeopleFinders.com', category: 'People Search', difficulty: 'Easy' },
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCompany = (companyId: string) => {
    if (selectedCompanies.includes(companyId)) {
      setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
    } else {
      setSelectedCompanies([...selectedCompanies, companyId]);
    }
  };

  const selectAllByCategory = (category: string) => {
    const categoryCompanies = companies
      .filter(c => c.category === category)
      .map(c => c.id);
    
    const newSelected = [...new Set([...selectedCompanies, ...categoryCompanies])];
    setSelectedCompanies(newSelected);
  };

  const selectTopDataBrokers = () => {
    const topBrokers = companies
      .filter(c => c.category === 'Data Broker')
      .slice(0, 5)
      .map(c => c.id);
    
    const newSelected = [...new Set([...selectedCompanies, ...topBrokers])];
    setSelectedCompanies(newSelected);
  };

  const calculateCost = () => {
    return 16.99; // Bulk request price
  };

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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bulk Deletion Request
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Send deletion requests to multiple companies at once for $16.99
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search Companies
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Search by name or category..."
                />
              </div>
              <div>
                <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Jurisdiction
                </label>
                <select
                  id="jurisdiction"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="CCPA">CCPA</option>
                  <option value="GDPR">GDPR</option>
                  <option value="PIPEDA">PIPEDA</option>
                  <option value="LGPD">LGPD</option>
                </select>
              </div>
            </div>

            {/* Quick Selection */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={selectTopDataBrokers}
                className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
              >
                Select Top Data Brokers
              </button>
              <button
                onClick={() => selectAllByCategory('Credit Bureau')}
                className="px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                Select All Credit Bureaus
              </button>
              <button
                onClick={() => selectAllByCategory('People Search')}
                className="px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                Select All People Search
              </button>
              <button
                onClick={() => setSelectedCompanies([])}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Company List */}
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              Select Companies ({selectedCompanies.length} selected)
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedCompanies.includes(company.id)
                      ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  onClick={() => toggleCompany(company.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => toggleCompany(company.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-900 dark:text-white">
                          {company.name}
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {company.category}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(company.difficulty)}`}>
                            {company.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCompanies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No companies found matching your search.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
              Request Summary
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Request Type:</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">Bulk Request</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Jurisdiction:</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{jurisdiction}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Companies Selected:</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedCompanies.length}</span>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-slate-900 dark:text-white">Total Cost:</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">${calculateCost().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Selected Companies List */}
            {selectedCompanies.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Selected Companies:
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedCompanies.map((companyId) => {
                    const company = companies.find(c => c.id === companyId);
                    return company ? (
                      <div key={companyId} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-300 truncate">
                          {company.name}
                        </span>
                        <button
                          onClick={() => toggleCompany(companyId)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6">
              <button
                disabled={selectedCompanies.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {selectedCompanies.length === 0 
                  ? 'Select Companies to Continue'
                  : `Submit ${selectedCompanies.length} Requests - $${calculateCost().toFixed(2)}`
                }
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Bulk Request Benefits:</p>
                <ul className="space-y-1">
                  <li>• Fixed price regardless of company count</li>
                  <li>• Automated follow-ups included</li>
                  <li>• Priority processing</li>
                  <li>• Detailed progress tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

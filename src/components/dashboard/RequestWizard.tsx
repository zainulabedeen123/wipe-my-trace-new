'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createDeletionRequest, createBulkDeletionRequests } from '@/hooks/useDeletionRequests';
import { useCompanies } from '@/hooks/useCompanies';
import { Jurisdiction, RequestType } from '@prisma/client';

interface RequestData {
  requestType: 'single' | 'bulk';
  jurisdiction: Jurisdiction;
  companies: string[];
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  additionalInfo: string;
}

const steps = [
  { id: 1, name: 'Request Type', description: 'Choose single or bulk request' },
  { id: 2, name: 'Jurisdiction', description: 'Select applicable privacy law' },
  { id: 3, name: 'Companies', description: 'Select target companies' },
  { id: 4, name: 'Personal Info', description: 'Verify your information' },
  { id: 5, name: 'Review', description: 'Review and submit' },
];

export default function RequestWizard() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [requestData, setRequestData] = useState<RequestData>({
    requestType: 'single',
    jurisdiction: Jurisdiction.CCPA,
    companies: [],
    personalInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.primaryEmailAddress?.emailAddress || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    additionalInfo: '',
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateRequestData = (field: string, value: string | string[]) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setRequestData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('You must be logged in to submit a request');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const requestorName = `${requestData.personalInfo.firstName} ${requestData.personalInfo.lastName}`.trim();
      const requestorAddress = [
        requestData.personalInfo.address,
        requestData.personalInfo.city,
        requestData.personalInfo.state,
        requestData.personalInfo.zipCode
      ].filter(Boolean).join(', ');

      if (requestData.requestType === 'bulk') {
        // Create bulk deletion requests
        const result = await createBulkDeletionRequests({
          companyIds: requestData.companies,
          jurisdiction: requestData.jurisdiction,
          requestorName,
          requestorEmail: requestData.personalInfo.email,
          requestorPhone: requestData.personalInfo.phone || undefined,
          requestorAddress: requestorAddress || undefined
        });

        // Redirect to success page with results
        router.push(`/dashboard/requests?success=bulk&count=${result.successCount}`);
      } else {
        // Create single deletion request
        if (requestData.companies.length === 0) {
          setSubmitError('Please select at least one company');
          return;
        }

        const result = await createDeletionRequest({
          companyId: requestData.companies[0],
          jurisdiction: requestData.jurisdiction,
          requestorName,
          requestorEmail: requestData.personalInfo.email,
          requestorPhone: requestData.personalInfo.phone || undefined,
          requestorAddress: requestorAddress || undefined
        });

        // Redirect to success page
        router.push(`/dashboard/requests?success=single&id=${result.id}`);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.id}
                className={`${
                  stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                } relative`}
              >
                {step.id < currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-blue-600" />
                    </div>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-900">
                      <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </>
                ) : step.id === currentStep ? (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-600" />
                    </div>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:bg-slate-800">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-600" />
                    </div>
                    <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-slate-500" />
                    </div>
                  </>
                )}
                <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {step.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="px-6 py-8">
        {currentStep === 1 && (
          <RequestTypeStep
            requestType={requestData.requestType}
            onUpdate={(value) => updateRequestData('requestType', value)}
          />
        )}
        
        {currentStep === 2 && (
          <JurisdictionStep
            jurisdiction={requestData.jurisdiction}
            onUpdate={(value) => updateRequestData('jurisdiction', value)}
          />
        )}
        
        {currentStep === 3 && (
          <CompaniesStep
            companies={requestData.companies}
            requestType={requestData.requestType}
            onUpdate={(value) => updateRequestData('companies', value)}
          />
        )}
        
        {currentStep === 4 && (
          <PersonalInfoStep
            personalInfo={requestData.personalInfo}
            onUpdate={updatePersonalInfo}
          />
        )}
        
        {currentStep === 5 && (
          <ReviewStep requestData={requestData} />
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-md disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        )}
      </div>

      {/* Error Display */}
      {submitError && (
        <div className="px-6 pb-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error submitting request
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// Step Components
function RequestTypeStep({ requestType, onUpdate }: { requestType: string; onUpdate: (value: 'single' | 'bulk') => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Choose Request Type
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select whether you want to send a request to a single company or multiple companies at once.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className={`relative rounded-lg border p-4 cursor-pointer ${
            requestType === 'single'
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'border-slate-300 dark:border-slate-600'
          }`}
          onClick={() => onUpdate('single')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="requestType"
              value="single"
              checked={requestType === 'single'}
              onChange={() => onUpdate('single')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div className="ml-3">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Single Request
              </label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Send a deletion request to one specific company ($3.50)
              </p>
            </div>
          </div>
        </div>

        <div
          className={`relative rounded-lg border p-4 cursor-pointer ${
            requestType === 'bulk'
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'border-slate-300 dark:border-slate-600'
          }`}
          onClick={() => onUpdate('bulk')}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="requestType"
              value="bulk"
              checked={requestType === 'bulk'}
              onChange={() => onUpdate('bulk')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div className="ml-3">
              <label className="block text-sm font-medium text-slate-900 dark:text-white">
                Bulk Request
              </label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Send deletion requests to multiple companies ($16.99)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JurisdictionStep({ jurisdiction, onUpdate }: { jurisdiction: Jurisdiction; onUpdate: (value: Jurisdiction) => void }) {
  const jurisdictions = [
    {
      value: Jurisdiction.GDPR,
      name: 'GDPR (EU/UK)',
      description: 'General Data Protection Regulation - European Union and United Kingdom',
      regions: 'EU, UK, EEA',
    },
    {
      value: Jurisdiction.CCPA,
      name: 'CCPA (California)',
      description: 'California Consumer Privacy Act - United States (California)',
      regions: 'California, USA',
    },
    {
      value: Jurisdiction.PIPEDA,
      name: 'PIPEDA (Canada)',
      description: 'Personal Information Protection and Electronic Documents Act - Canada',
      regions: 'Canada',
    },
    {
      value: Jurisdiction.LGPD,
      name: 'LGPD (Brazil)',
      description: 'Lei Geral de Proteção de Dados - Brazil',
      regions: 'Brazil',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Select Privacy Law Jurisdiction
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Choose the privacy regulation that applies to your situation based on your location or the company&apos;s jurisdiction.
        </p>
      </div>

      <div className="space-y-4">
        {jurisdictions.map((item) => (
          <div
            key={item.value}
            className={`relative rounded-lg border p-4 cursor-pointer ${
              jurisdiction === item.value
                ? 'border-blue-500 ring-2 ring-blue-500'
                : 'border-slate-300 dark:border-slate-600'
            }`}
            onClick={() => onUpdate(item.value as 'GDPR' | 'CCPA' | 'PIPEDA' | 'LGPD')}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="jurisdiction"
                value={item.value}
                checked={jurisdiction === item.value}
                onChange={() => onUpdate(item.value as 'GDPR' | 'CCPA' | 'PIPEDA' | 'LGPD')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 mt-1"
              />
              <div className="ml-3">
                <label className="block text-sm font-medium text-slate-900 dark:text-white">
                  {item.name}
                </label>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {item.description}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Applicable regions: {item.regions}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompaniesStep({ companies, requestType, onUpdate }: {
  companies: string[];
  requestType: string;
  onUpdate: (value: string[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Use real companies from API
  const { data: companiesData, loading } = useCompanies({
    search: searchTerm || undefined,
    isActive: true
  }, 1, 100);

  const availableCompanies = companiesData?.companies || [];
  const filteredCompanies = availableCompanies;

  const toggleCompany = (companyId: string) => {
    if (requestType === 'single') {
      onUpdate([companyId]);
    } else {
      if (companies.includes(companyId)) {
        onUpdate(companies.filter(id => id !== companyId));
      } else {
        onUpdate([...companies, companyId]);
      }
    }
  };

  const selectAllPopular = () => {
    const popularCompanies = availableCompanies.slice(0, 5).map(c => c.id);
    onUpdate(popularCompanies);
  };

  const formatCategory = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Select Target Companies
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {requestType === 'single'
            ? 'Choose one company to send a deletion request to.'
            : 'Select multiple companies to send deletion requests to. You can select up to 50 companies.'
          }
        </p>
      </div>

      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Search Companies
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            placeholder="Search by company name or category..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {requestType === 'bulk' && (
        <div className="flex space-x-4">
          <button
            onClick={selectAllPopular}
            className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            Select Top 5 Data Brokers
          </button>
          <button
            onClick={() => onUpdate([])}
            className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Selected Count */}
      {requestType === 'bulk' && companies.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {companies.length} companies selected {requestType === 'bulk' && '(up to 50 allowed)'}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border border-slate-300 dark:border-slate-600 rounded-lg p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Companies List */}
      {!loading && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className={`relative rounded-lg border p-4 cursor-pointer ${
              companies.includes(company.id)
                ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
            onClick={() => toggleCompany(company.id)}
          >
            <div className="flex items-start">
              <input
                type={requestType === 'single' ? 'radio' : 'checkbox'}
                name="companies"
                value={company.id}
                checked={companies.includes(company.id)}
                onChange={() => toggleCompany(company.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 mt-1"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white">
                    {company.name}
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {formatCategory(company.category)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {company.description}
                </p>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No companies found matching your search.
          </p>
        </div>
      )}
    </div>
  );
}

function PersonalInfoStep({ personalInfo, onUpdate }: {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onUpdate: (field: string, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Verify Personal Information
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          This information will be used in your deletion requests. Please ensure it&apos;s accurate and complete.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => onUpdate('firstName', e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => onUpdate('lastName', e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={personalInfo.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => onUpdate('phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Street Address
          </label>
          <input
            type="text"
            id="address"
            value={personalInfo.address}
            onChange={(e) => onUpdate('address', e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            City
          </label>
          <input
            type="text"
            id="city"
            value={personalInfo.city}
            onChange={(e) => onUpdate('city', e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            State/Province
          </label>
          <input
            type="text"
            id="state"
            value={personalInfo.state}
            onChange={(e) => onUpdate('state', e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ requestData }: { requestData: RequestData }) {
  const getCompanyNames = (companyIds: string[]) => {
    const companies = [
      { id: '1', name: 'Acxiom Corporation' },
      { id: '2', name: 'Epsilon Data Management' },
      { id: '3', name: 'LexisNexis Risk Solutions' },
      { id: '4', name: 'Experian Information Solutions' },
      { id: '5', name: 'TransUnion LLC' },
      { id: '6', name: 'Equifax Inc.' },
      { id: '7', name: 'Spokeo Inc.' },
      { id: '8', name: 'BeenVerified LLC' },
      { id: '9', name: 'Intelius Inc.' },
      { id: '10', name: 'PeopleFinders.com' },
    ];

    return companyIds.map(id => companies.find(c => c.id === id)?.name || 'Unknown Company');
  };

  const calculateCost = () => {
    if (requestData.requestType === 'single') {
      return '$3.50';
    } else {
      return '$16.99';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Review Your Request
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Please review all information before submitting your deletion request.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-900 dark:text-white">Request Type</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 capitalize">
            {requestData.requestType} Request
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-900 dark:text-white">Jurisdiction</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {requestData.jurisdiction}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-900 dark:text-white">
            Target Companies ({requestData.companies.length})
          </h4>
          <div className="mt-2 space-y-1">
            {getCompanyNames(requestData.companies).map((name, index) => (
              <p key={index} className="text-sm text-slate-600 dark:text-slate-300">
                • {name}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-900 dark:text-white">Personal Information</h4>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            <p>{requestData.personalInfo.firstName} {requestData.personalInfo.lastName}</p>
            <p>{requestData.personalInfo.email}</p>
            {requestData.personalInfo.phone && <p>{requestData.personalInfo.phone}</p>}
            {requestData.personalInfo.address && (
              <p>
                {requestData.personalInfo.address}, {requestData.personalInfo.city}, {requestData.personalInfo.state}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Total Cost</h4>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {calculateCost()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                By submitting this request, you authorize us to send legally binding deletion requests
                on your behalf. Processing typically takes 15-30 days depending on the company&apos;s response time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

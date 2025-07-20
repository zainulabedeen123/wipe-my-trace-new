'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    notifications: {
      emailUpdates: true,
      requestStatusUpdates: true,
      marketingEmails: false,
      weeklyReports: true,
    },
    privacy: {
      dataRetention: '1year',
      shareAnalytics: false,
      allowTracking: false,
    },
    preferences: {
      defaultJurisdiction: 'CCPA',
      autoFollowUp: true,
      preferredLanguage: 'en',
      timezone: 'America/New_York',
    },
    billing: {
      autoRenew: true,
      invoiceEmail: user?.primaryEmailAddress?.emailAddress || '',
      paymentMethod: 'card',
    }
  });

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'security', name: 'Security', icon: '🛡️' },
  ];

  const updateSetting = (category: string, key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // TODO: Save settings to backend
    console.log('Saving settings:', settings);
    // Show success message
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Manage your account preferences and privacy settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    General Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="defaultJurisdiction" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Default Jurisdiction
                      </label>
                      <select
                        id="defaultJurisdiction"
                        value={settings.preferences.defaultJurisdiction}
                        onChange={(e) => updateSetting('preferences', 'defaultJurisdiction', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="CCPA">CCPA (California)</option>
                        <option value="GDPR">GDPR (EU/UK)</option>
                        <option value="PIPEDA">PIPEDA (Canada)</option>
                        <option value="LGPD">LGPD (Brazil)</option>
                      </select>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Default privacy law to use for new requests
                      </p>
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Language
                      </label>
                      <select
                        id="language"
                        value={settings.preferences.preferredLanguage}
                        onChange={(e) => updateSetting('preferences', 'preferredLanguage', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        value={settings.preferences.timezone}
                        onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="autoFollowUp"
                        type="checkbox"
                        checked={settings.preferences.autoFollowUp}
                        onChange={(e) => updateSetting('preferences', 'autoFollowUp', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                      <label htmlFor="autoFollowUp" className="ml-2 block text-sm text-slate-900 dark:text-white">
                        Enable automatic follow-up for pending requests
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          Email Updates
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Receive general updates about your account
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailUpdates}
                        onChange={(e) => updateSetting('notifications', 'emailUpdates', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          Request Status Updates
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Get notified when your deletion requests are updated
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.requestStatusUpdates}
                        onChange={(e) => updateSetting('notifications', 'requestStatusUpdates', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          Weekly Reports
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Receive weekly summaries of your privacy protection progress
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReports}
                        onChange={(e) => updateSetting('notifications', 'weeklyReports', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          Marketing Emails
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Receive promotional emails and product updates
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.marketingEmails}
                        onChange={(e) => updateSetting('notifications', 'marketingEmails', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Privacy Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="dataRetention" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Data Retention Period
                      </label>
                      <select
                        id="dataRetention"
                        value={settings.privacy.dataRetention}
                        onChange={(e) => updateSetting('privacy', 'dataRetention', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="6months">6 months</option>
                        <option value="1year">1 year</option>
                        <option value="2years">2 years</option>
                        <option value="indefinite">Indefinite</option>
                      </select>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        How long to keep your request history and personal data
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          Share Anonymous Analytics
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Help improve our service by sharing anonymized usage data
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.shareAnalytics}
                        onChange={(e) => updateSetting('privacy', 'shareAnalytics', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          Allow Tracking
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Allow tracking for personalized experience and analytics
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.privacy.allowTracking}
                        onChange={(e) => updateSetting('privacy', 'allowTracking', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Billing Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="invoiceEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Invoice Email
                      </label>
                      <input
                        type="email"
                        id="invoiceEmail"
                        value={settings.billing.invoiceEmail}
                        onChange={(e) => updateSetting('billing', 'invoiceEmail', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          Auto-renew Subscription
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Automatically renew your subscription when it expires
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.billing.autoRenew}
                        onChange={(e) => updateSetting('billing', 'autoRenew', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
                        Payment Method
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">💳</span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                •••• •••• •••• 4242
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                Expires 12/25
                              </div>
                            </div>
                          </div>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm font-medium">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
                    Security Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                            Account Security
                          </h3>
                          <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                            <p>Your account is secured with Clerk authentication. Two-factor authentication is enabled.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            Two-Factor Authentication
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Add an extra layer of security to your account
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Enabled
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            Login Notifications
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Get notified of new login attempts
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Enabled
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
                        Account Actions
                      </h4>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            Download Account Data
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Export all your account data and request history
                          </div>
                        </button>
                        
                        <button className="w-full text-left px-4 py-3 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <div className="text-sm font-medium text-red-900 dark:text-red-400">
                            Delete Account
                          </div>
                          <div className="text-sm text-red-600 dark:text-red-500">
                            Permanently delete your account and all associated data
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import BillingSection from '../account-settings/components/BillingSection';
import Icon from '../../components/AppIcon';

const BillingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbTrail />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="CreditCard" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Billing & Subscription</h1>
                <p className="text-text-secondary">
                  Manage your subscription and payment details
                </p>
              </div>
            </div>
          </div>

          <BillingSection isOpen={true} onToggle={() => {}} />

        </div>
      </main>
    </div>
  );
};

export default BillingPage;

import React from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import BillingDetails from './components/BillingDetails';

const BillingPage = () => {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <NavigationBar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
          <BillingDetails />
        </div>
      </main>
    </div>
  );
};

export default BillingPage;

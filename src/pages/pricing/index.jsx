import React, { useState } from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: { USD: 25 },
      yearlyPrice: { USD: 199 },
      contacts: 1000,
      emails: 5000,
      features: ['Basic email editor', 'Contact management', 'Basic analytics', 'Email support'],
      current: false
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: { USD: 59 },
      yearlyPrice: { USD: 499 },
      contacts: 5000,
      emails: 25000,
      features: ['Advanced email editor', 'AI subject lines', 'Advanced analytics', 'A/B testing', 'Priority support'],
      current: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: { USD: 129 },
      yearlyPrice: { USD: 999 },
      contacts: 25000,
      emails: 100000,
      features: ['All Professional features', 'Custom integrations', 'Dedicated support', 'White-label options'],
      current: false
    }
  ];

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  const handleSelectPlan = (planId) => {
    console.log(`Selected plan: ${planId}`);
    // Redirect to registration or payment page
  };

  const getCurrentPrice = (plan) => {
    const priceObj = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    return priceObj['USD'];
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">Choose the Right Plan for Your Business</h1>
            <p className="text-lg text-text-secondary">
              Flexible pricing for businesses of all sizes.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => handleBillingCycleChange('monthly')}
                className={`px-4 py-2 rounded-md border transition-micro focus:outline-none focus:ring-2 focus:ring-primary ${
                  billingCycle === 'monthly' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-text-primary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleBillingCycleChange('yearly')}
                className={`px-4 py-2 rounded-md border transition-micro focus:outline-none focus:ring-2 focus:ring-primary ${
                  billingCycle === 'yearly' ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-text-primary'
                }`}
              >
                Yearly
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div
                key={plan.id}
                className="border rounded-lg p-6 bg-surface hover:border-primary hover:shadow-elevation-2 transition-all flex flex-col"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-text-primary mb-2">{plan.name}</h3>
                  <p className="text-4xl font-bold text-primary">
                    ${getCurrentPrice(plan)}
                    <span className="text-sm font-normal text-text-secondary">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-success mt-2">
                      Save ${(plan.monthlyPrice['USD'] * 12) - plan.yearlyPrice['USD']} annually
                    </p>
                  )}
                </div>
                <div className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-text-secondary">
                        <Icon name="Check" size={16} className="text-success mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  Select {plan.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center text-text-secondary">
            <p>&copy; {new Date().getFullYear()} EmailCraft Pro. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default PricingPage;

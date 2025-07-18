import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BillingSection = ({ isOpen, onToggle }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '**** **** **** 4242',
    expiryDate: '12/25',
    cardholderName: 'John Doe',
    billingAddress: '123 Business St, Suite 100',
    city: 'New York',
    zipCode: '10001'
  });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' }
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: { USD: 25, EUR: 22, GBP: 20 },
      yearlyPrice: { USD: 19, EUR: 17, GBP: 15 },
      contacts: 1000,
      emails: 5000,
      features: ['Basic email editor', 'Contact management', 'Basic analytics', 'Email support'],
      current: true
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: { USD: 59, EUR: 52, GBP: 45 },
      yearlyPrice: { USD: 49, EUR: 43, GBP: 37 },
      contacts: 5000,
      emails: 25000,
      features: ['Advanced email editor', 'AI subject lines', 'Advanced analytics', 'A/B testing', 'Priority support'],
      current: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: { USD: 129, EUR: 115, GBP: 99 },
      yearlyPrice: { USD: 99, EUR: 88, GBP: 76 },
      contacts: 25000,
      emails: 100000,
      features: ['All Professional features', 'Custom integrations', 'Dedicated support', 'White-label options'],
      current: false
    }
  ];

  const currentPlan = plans.find(plan => plan.current);
  const usageData = {
    contacts: { used: 347, limit: currentPlan?.contacts || 1000 },
    emails: { used: 2840, limit: currentPlan?.emails || 5000 }
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  const handlePaymentEdit = () => {
    setIsEditingPayment(true);
  };

  const handlePaymentSave = () => {
    setIsEditingPayment(false);
    console.log('Payment method updated');
  };

  const handleUpgrade = async (planId) => {
    try {
      // Call API to create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId,
          billingCycle,
          currency: selectedCurrency
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Handle successful payment intent creation
        console.log('Payment intent created:', data);
        // Redirect to payment page or show payment modal
      } else {
        console.error('Payment intent creation failed:', data.error);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const getUsagePercentage = (used, limit) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 75) return 'text-warning-600';
    return 'text-success';
  };

  const getCurrentPrice = (plan) => {
    const priceObj = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    return priceObj[selectedCurrency];
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-t-lg"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <Icon name="CreditCard" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Billing & Subscription</h3>
            <p className="text-sm text-text-secondary">Manage your subscription and payment details</p>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={20} 
          className={`text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mt-6 space-y-8">
            {/* Currency Selection */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Currency Preference</h4>
              <div className="flex flex-wrap gap-2">
                {currencies.map(currency => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency.code)}
                    className={`px-4 py-2 rounded-md border transition-micro focus:outline-none focus:ring-2 focus:ring-primary ${
                      selectedCurrency === currency.code
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-text-primary'
                    }`}
                  >
                    {currency.symbol} {currency.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Billing Cycle Selection */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Billing Cycle</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBillingCycleChange('monthly')}
                  className={`px-4 py-2 rounded-md border transition-micro focus:outline-none focus:ring-2 focus:ring-primary ${
                    billingCycle === 'monthly' ?'bg-primary text-primary-foreground border-primary' :'bg-surface text-text-secondary border-border hover:border-primary hover:text-text-primary'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => handleBillingCycleChange('yearly')}
                  className={`px-4 py-2 rounded-md border transition-micro focus:outline-none focus:ring-2 focus:ring-primary ${
                    billingCycle === 'yearly' ?'bg-primary text-primary-foreground border-primary' :'bg-surface text-text-secondary border-border hover:border-primary hover:text-text-primary'
                  }`}
                >
                  Yearly
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Current Plan */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Current Plan</h4>
              <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="text-lg font-semibold text-text-primary">{currentPlan?.name}</h5>
                    <p className="text-2xl font-bold text-primary">
                      {currencies.find(c => c.code === selectedCurrency)?.symbol}
                      {getCurrentPrice(currentPlan)}
                      <span className="text-sm font-normal text-text-secondary">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    </p>
                  </div>
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Contacts</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-secondary-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            getUsagePercentage(usageData.contacts.used, usageData.contacts.limit) >= 90 
                              ? 'bg-error' 
                              : getUsagePercentage(usageData.contacts.used, usageData.contacts.limit) >= 75 
                                ? 'bg-warning-500' :'bg-success'
                          }`}
                          style={{ width: `${getUsagePercentage(usageData.contacts.used, usageData.contacts.limit)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageData.contacts.used, usageData.contacts.limit))}`}>
                        {usageData.contacts.used}/{usageData.contacts.limit}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Monthly Emails</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-secondary-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            getUsagePercentage(usageData.emails.used, usageData.emails.limit) >= 90 
                              ? 'bg-error' 
                              : getUsagePercentage(usageData.emails.used, usageData.emails.limit) >= 75 
                                ? 'bg-warning-500' :'bg-success'
                          }`}
                          style={{ width: `${getUsagePercentage(usageData.emails.used, usageData.emails.limit)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageData.emails.used, usageData.emails.limit))}`}>
                        {usageData.emails.used.toLocaleString()}/{usageData.emails.limit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Plans */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Available Plans</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map(plan => (
                  <div 
                    key={plan.id}
                    className={`border rounded-lg p-6 ${
                      plan.current 
                        ? 'border-primary bg-primary-50' :'border-border bg-surface hover:border-primary hover:shadow-elevation-2 transition-all'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <h5 className="text-lg font-semibold text-text-primary">{plan.name}</h5>
                      <p className="text-2xl font-bold text-primary">
                        {currencies.find(c => c.code === selectedCurrency)?.symbol}
                        {getCurrentPrice(plan)}
                        <span className="text-sm font-normal text-text-secondary">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                      </p>
                      {billingCycle === 'yearly' && (
                        <p className="text-sm text-success mt-1">
                          Save {currencies.find(c => c.code === selectedCurrency)?.symbol}
                          {(plan.monthlyPrice[selectedCurrency] * 12) - plan.yearlyPrice[selectedCurrency]} annually
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Contacts:</span>
                        <span className="font-medium text-text-primary">{plan.contacts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary">Monthly Emails:</span>
                        <span className="font-medium text-text-primary">{plan.emails.toLocaleString()}</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-text-secondary">
                          <Icon name="Check" size={16} className="text-success mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.current ? (
                      <div className="text-center py-2 text-sm font-medium text-primary">
                        Current Plan
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        Upgrade to {plan.name}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-text-primary">Payment Method</h4>
                {!isEditingPayment && (
                  <Button
                    variant="ghost"
                    onClick={handlePaymentEdit}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {!isEditingPayment ? (
                <div className="bg-secondary-50 border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-primary rounded flex items-center justify-center">
                      <Icon name="CreditCard" size={20} color="white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{paymentData.cardNumber}</p>
                      <p className="text-sm text-text-secondary">Expires {paymentData.expiryDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-secondary">Cardholder</p>
                      <p className="font-medium text-text-primary">{paymentData.cardholderName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Card Number</label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Expiry Date</label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Cardholder Name</label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">CVV</label>
                      <Input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Billing Address</label>
                    <Input
                      type="text"
                      placeholder="123 Main Street"
                      className="mb-4"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="City"
                      />
                      <Input
                        type="text"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditingPayment(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handlePaymentSave}
                      iconName="Save"
                      iconPosition="left"
                    >
                      Save Payment Method
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Billing History */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Recent Billing History</h4>
              <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 text-sm text-text-primary">Dec 1, 2024</td>
                        <td className="px-4 py-3 text-sm text-text-primary">Starter Plan - Monthly</td>
                        <td className="px-4 py-3 text-sm text-text-primary">
                          {currencies.find(c => c.code === selectedCurrency)?.symbol}25.00
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success">
                            Paid
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" iconName="Download">
                            Download
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-text-primary">Nov 1, 2024</td>
                        <td className="px-4 py-3 text-sm text-text-primary">Starter Plan - Monthly</td>
                        <td className="px-4 py-3 text-sm text-text-primary">
                          {currencies.find(c => c.code === selectedCurrency)?.symbol}25.00
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success">
                            Paid
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm" iconName="Download">
                            Download
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSection;
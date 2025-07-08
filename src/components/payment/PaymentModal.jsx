import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import Input from '../ui/Input';
import dodoPaymentsService from '../../services/dodoPayments';

const PaymentModal = ({ isOpen, onClose, plan, billingCycle, currency }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCardNumberChange = (value) => {
    const formatted = dodoPaymentsService.formatCardNumber(value);
    if (formatted.length <= 19) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleExpiryChange = (value) => {
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
    if (formatted.length <= 5) {
      const [month, year] = formatted.split('/');
      handleInputChange('expiryMonth', month);
      handleInputChange('expiryYear', year);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.cardNumber || !dodoPaymentsService.validateCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryMonth || !formData.expiryYear || 
        !dodoPaymentsService.validateExpiryDate(parseInt(formData.expiryMonth), parseInt(`20${formData.expiryYear}`))) {
      errors.expiry = 'Please enter a valid expiry date';
    }

    if (!formData.cvv || !dodoPaymentsService.validateCVV(formData.cvv)) {
      errors.cvv = 'Please enter a valid CVV';
    }

    if (!formData.cardholderName.trim()) {
      errors.cardholderName = 'Please enter the cardholder name';
    }

    if (!formData.billingAddress.trim()) {
      errors.billingAddress = 'Please enter the billing address';
    }

    if (!formData.city.trim()) {
      errors.city = 'Please enter the city';
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = 'Please enter the ZIP code';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create payment intent
      const paymentIntent = await dodoPaymentsService.createPaymentIntent(
        plan.id,
        billingCycle,
        currency
      );

      // Process payment
      const result = await dodoPaymentsService.handlePaymentSubmission(
        formData,
        paymentIntent.paymentIntentId
      );

      if (result.success) {
        onClose();
        // Show success message or redirect
        window.location.reload();
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPrice = () => {
    if (!plan) return 0;
    const priceObj = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    return priceObj[currency] || 0;
  };

  const getCurrencySymbol = () => {
    const symbols = { USD: '$', EUR: '€', GBP: '£' };
    return symbols[currency] || '$';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{plan?.name} Plan</span>
              <span className="text-lg font-bold text-blue-600">
                {getCurrencySymbol()}{getPrice()}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Billed {billingCycle === 'yearly' ? 'annually' : 'monthly'}
              {billingCycle === 'yearly' && (
                <span className="ml-2 text-green-600 font-medium">
                  (Save {getCurrencySymbol()}{((plan?.monthlyPrice?.[currency] || 0) * 12) - (plan?.yearlyPrice?.[currency] || 0)})
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Card Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <Input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    error={validationErrors.cardNumber}
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <Input
                      type="text"
                      value={formData.expiryMonth && formData.expiryYear ? `${formData.expiryMonth}/${formData.expiryYear}` : ''}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      placeholder="MM/YY"
                      error={validationErrors.expiry}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      error={validationErrors.cvv}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <Input
                    type="text"
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    placeholder="John Doe"
                    error={validationErrors.cardholderName}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Billing Address</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    type="text"
                    value={formData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    placeholder="123 Main Street"
                    error={validationErrors.billingAddress}
                    disabled={isProcessing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="New York"
                      error={validationErrors.city}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <Input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="10001"
                      error={validationErrors.zipCode}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isProcessing}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay ${getCurrencySymbol()}{getPrice()}`}
              </Button>
            </div>
          </form>

          {/* Security Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Icon name="Lock" size={16} />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
import { apiClient } from '../utils/api';

class DodoPaymentsService {
  constructor() {
    this.publishableKey = process.env.REACT_APP_DODO_PUBLISHABLE_KEY;
  }

  // Initialize Dodo Payments SDK
  async initializeDodo() {
    if (window.Dodo) {
      return window.Dodo;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.dodopayments.com/v1/';
      script.onload = () => {
        window.Dodo.setPublishableKey(this.publishableKey);
        resolve(window.Dodo);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Create payment intent
  async createPaymentIntent(planId, billingCycle, currency = 'USD') {
    try {
      const response = await apiClient.payments.createIntent({
        planId,
        billingCycle,
        currency
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create payment intent');
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId, paymentMethod) {
    try {
      const dodo = await this.initializeDodo();
      
      const result = await dodo.confirmPayment({
        paymentIntentId,
        paymentMethod,
        returnUrl: `${window.location.origin}/account-settings?payment=success`
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Confirm payment on server
      const response = await apiClient.payments.confirmPayment(paymentIntentId, {
        paymentMethodId: paymentMethod.id
      });

      return response.data;
    } catch (error) {
      throw new Error('Payment confirmation failed');
    }
  }

  // Create payment method
  async createPaymentMethod(cardData) {
    try {
      const dodo = await this.initializeDodo();
      
      const result = await dodo.createPaymentMethod({
        type: 'card',
        card: cardData
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.paymentMethod;
    } catch (error) {
      throw new Error('Failed to create payment method');
    }
  }

  // Get saved payment methods
  async getPaymentMethods() {
    try {
      const dodo = await this.initializeDodo();
      return await dodo.listPaymentMethods();
    } catch (error) {
      throw new Error('Failed to get payment methods');
    }
  }

  // Handle payment form submission
  async handlePaymentSubmission(formData, paymentIntentId) {
    try {
      // Create payment method from form data
      const paymentMethod = await this.createPaymentMethod({
        number: formData.cardNumber,
        exp_month: formData.expiryMonth,
        exp_year: formData.expiryYear,
        cvc: formData.cvv
      });

      // Confirm payment
      return await this.confirmPayment(paymentIntentId, paymentMethod);
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  }

  // Format card number for display
  formatCardNumber(cardNumber) {
    return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  // Validate card number
  validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^[0-9]{13,19}$/.test(cleanNumber);
  }

  // Validate expiry date
  validateExpiryDate(month, year) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return month >= 1 && month <= 12;
  }

  // Validate CVV
  validateCVV(cvv) {
    return /^[0-9]{3,4}$/.test(cvv);
  }

  // Get subscription status
  async getSubscriptionStatus() {
    try {
      const response = await apiClient.payments.getSubscription();
      return response.data.subscription;
    } catch (error) {
      throw new Error('Failed to get subscription status');
    }
  }

  // Cancel subscription
  async cancelSubscription() {
    try {
      const response = await apiClient.payments.cancelSubscription();
      return response.data;
    } catch (error) {
      throw new Error('Failed to cancel subscription');
    }
  }

  // Get payment history
  async getPaymentHistory() {
    try {
      const response = await apiClient.payments.getPaymentHistory();
      return response.data.payments;
    } catch (error) {
      throw new Error('Failed to get payment history');
    }
  }

  // Get pricing plans
  async getPricingPlans() {
    try {
      const response = await apiClient.payments.getPlans();
      return response.data.plans;
    } catch (error) {
      throw new Error('Failed to get pricing plans');
    }
  }

  // Handle webhooks (for server-side implementation)
  async handleWebhook(signature, payload) {
    try {
      const dodo = await this.initializeDodo();
      return dodo.webhooks.constructEvent(payload, signature, process.env.DODO_WEBHOOK_SECRET);
    } catch (error) {
      throw new Error('Invalid webhook signature');
    }
  }
}

export default new DodoPaymentsService();
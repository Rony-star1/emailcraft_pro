import axios from 'axios';

export class DodoPaymentsClient {
  constructor() {
    this.apiKey = process.env.DODO_API_KEY;
    this.apiUrl = process.env.DODO_API_URL || 'https://api.dodopayments.com/v1';
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createPaymentIntent({ amount, currency, userId, planId, billingCycle, metadata }) {
    try {
      const response = await this.client.post('/payment-intents', {
        amount,
        currency,
        customer_id: userId,
        metadata: {
          plan_id: planId,
          billing_cycle: billingCycle,
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('Dodo payment intent creation error:', error.response?.data || error.message);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPayment({ paymentIntentId, paymentMethodId }) {
    try {
      const response = await this.client.post(`/payment-intents/${paymentIntentId}/confirm`, {
        payment_method: paymentMethodId
      });

      return response.data;
    } catch (error) {
      console.error('Dodo payment confirmation error:', error.response?.data || error.message);
      throw new Error('Failed to confirm payment');
    }
  }

  async createCustomer({ email, name, metadata }) {
    try {
      const response = await this.client.post('/customers', {
        email,
        name,
        metadata
      });

      return response.data;
    } catch (error) {
      console.error('Dodo customer creation error:', error.response?.data || error.message);
      throw new Error('Failed to create customer');
    }
  }

  async getPaymentMethods({ customerId }) {
    try {
      const response = await this.client.get(`/customers/${customerId}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Dodo get payment methods error:', error.response?.data || error.message);
      throw new Error('Failed to get payment methods');
    }
  }

  async createPaymentMethod({ customerId, type, card }) {
    try {
      const response = await this.client.post('/payment-methods', {
        customer_id: customerId,
        type,
        card
      });

      return response.data;
    } catch (error) {
      console.error('Dodo payment method creation error:', error.response?.data || error.message);
      throw new Error('Failed to create payment method');
    }
  }

  async attachPaymentMethod({ paymentMethodId, customerId }) {
    try {
      const response = await this.client.post(`/payment-methods/${paymentMethodId}/attach`, {
        customer_id: customerId
      });

      return response.data;
    } catch (error) {
      console.error('Dodo payment method attachment error:', error.response?.data || error.message);
      throw new Error('Failed to attach payment method');
    }
  }

  async detachPaymentMethod({ paymentMethodId }) {
    try {
      const response = await this.client.post(`/payment-methods/${paymentMethodId}/detach`);
      return response.data;
    } catch (error) {
      console.error('Dodo payment method detachment error:', error.response?.data || error.message);
      throw new Error('Failed to detach payment method');
    }
  }

  async createSubscription({ customerId, planId, paymentMethodId, billingCycle }) {
    try {
      const response = await this.client.post('/subscriptions', {
        customer_id: customerId,
        plan_id: planId,
        payment_method_id: paymentMethodId,
        billing_cycle,
        collection_method: 'charge_automatically'
      });

      return response.data;
    } catch (error) {
      console.error('Dodo subscription creation error:', error.response?.data || error.message);
      throw new Error('Failed to create subscription');
    }
  }

  async cancelSubscription({ subscriptionId }) {
    try {
      const response = await this.client.delete(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Dodo subscription cancellation error:', error.response?.data || error.message);
      throw new Error('Failed to cancel subscription');
    }
  }

  async getInvoices({ customerId, limit = 10 }) {
    try {
      const response = await this.client.get(`/customers/${customerId}/invoices`, {
        params: { limit }
      });

      return response.data;
    } catch (error) {
      console.error('Dodo get invoices error:', error.response?.data || error.message);
      throw new Error('Failed to get invoices');
    }
  }

  async handleWebhook(signature, payload) {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(signature, payload);
      
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      return JSON.parse(payload);
    } catch (error) {
      console.error('Dodo webhook handling error:', error.message);
      throw new Error('Failed to handle webhook');
    }
  }

  verifyWebhookSignature(signature, payload) {
    // Implementation depends on Dodo's webhook signature verification method
    // This is a placeholder implementation
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('DODO_WEBHOOK_SECRET not configured');
      return false;
    }

    // Implement actual signature verification logic here
    // This would typically involve HMAC verification
    return true;
  }
}

export default DodoPaymentsClient;
import express from 'express';
import { DodoPaymentsClient } from '../services/dodoPayments.js';
import { databases } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';
import { ID } from 'node-appwrite';
import { validatePaymentRequest } from '../middleware/validation.js';

const router = express.Router();
const dodoClient = new DodoPaymentsClient();

// Get pricing plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 25,
      yearlyPrice: 19,
      contacts: 1000,
      emails: 5000,
      features: ['Basic email editor', 'Contact management', 'Basic analytics', 'Email support']
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 59,
      yearlyPrice: 49,
      contacts: 5000,
      emails: 25000,
      features: ['Advanced email editor', 'AI subject lines', 'Advanced analytics', 'A/B testing', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 129,
      yearlyPrice: 99,
      contacts: 25000,
      emails: 100000,
      features: ['All Professional features', 'Custom integrations', 'Dedicated support', 'White-label options']
    }
  ];

  res.json({ plans });
});

// Create payment intent
router.post('/create-intent', authenticateToken, validatePaymentRequest, async (req, res) => {
  try {
    const { planId, billingCycle, currency = 'USD' } = req.body;
    const userId = req.user.id;

    // Get plan details
    const plans = await getPlans();
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const amount = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    // Create payment intent with Dodo
    const paymentIntent = await dodoClient.createPaymentIntent({
      amount: amount * 100, // Convert to cents
      currency,
      userId,
      planId,
      billingCycle,
      metadata: {
        customerEmail: req.user.email,
        planName: plan.name
      }
    });

    // Store payment intent in database
    const data = await databases.createDocument(
      'db',
      'payment_intents',
      ID.unique(),
      {
        id: paymentIntent.id,
        userId,
        amount,
        currency,
        planId,
        billingCycle,
        status: 'pending',
      }
    );

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm/:paymentIntentId', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const { paymentMethodId } = req.body;
    const userId = req.user.id;

    // Confirm payment with Dodo
    const confirmedPayment = await dodoClient.confirmPayment({
      paymentIntentId,
      paymentMethodId
    });

    if (confirmedPayment.status === 'succeeded') {
      // Get payment intent details
      const { documents: [paymentIntent] } = await databases.listDocuments(
        'db',
        'payment_intents',
        [`id=${paymentIntentId}`]
      );

      // Update payment intent status
      await databases.updateDocument(
        'db',
        'payment_intents',
        paymentIntent.$id,
        {
          status: 'succeeded',
          paymentMethodId,
        }
      );

      // Update user subscription
      const subscriptionEndDate = new Date();
      if (paymentIntent.billingCycle === 'yearly') {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }

      const { documents: [subscription] } = await databases.listDocuments(
        'db',
        'subscriptions',
        [`userId=${userId}`]
      );

      if (subscription) {
        await databases.updateDocument(
          'db',
          'subscriptions',
          subscription.$id,
          {
            planId: paymentIntent.planId,
            billingCycle: paymentIntent.billingCycle,
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: subscriptionEndDate.toISOString(),
          }
        );
      } else {
        await databases.createDocument(
          'db',
          'subscriptions',
          ID.unique(),
          {
            userId,
            planId: paymentIntent.planId,
            billingCycle: paymentIntent.billingCycle,
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: subscriptionEndDate.toISOString(),
          }
        );
      }

      res.json({ 
        success: true, 
        subscription: {
          planId: paymentIntent.plan_id,
          billingCycle: paymentIntent.billing_cycle,
          status: 'active',
          currentPeriodEnd: subscriptionEndDate.toISOString()
        }
      });

    } else {
      res.status(400).json({ error: 'Payment confirmation failed' });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Get user subscription
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { documents: [subscription] } = await databases.listDocuments(
        'db',
        'subscriptions',
        [`userId=${userId}`]
    );

    res.json({ subscription: subscription || null });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { documents: [subscription] } = await databases.listDocuments(
        'db',
        'subscriptions',
        [`userId=${userId}`]
    );

    if (subscription) {
      await databases.updateDocument(
        'db',
        'subscriptions',
        subscription.$id,
        {
          status: 'cancelled',
        }
      );
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { documents: payments } = await databases.listDocuments(
        'db',
        'payment_intents',
        [`userId=${userId}`, `status=succeeded`]
    );

    res.json({ payments });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

async function getPlans() {
  return [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 25,
      yearlyPrice: 19,
      contacts: 1000,
      emails: 5000,
      features: ['Basic email editor', 'Contact management', 'Basic analytics', 'Email support']
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 59,
      yearlyPrice: 49,
      contacts: 5000,
      emails: 25000,
      features: ['Advanced email editor', 'AI subject lines', 'Advanced analytics', 'A/B testing', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 129,
      yearlyPrice: 99,
      contacts: 25000,
      emails: 100000,
      features: ['All Professional features', 'Custom integrations', 'Dedicated support', 'White-label options']
    }
  ];
}

export default router;
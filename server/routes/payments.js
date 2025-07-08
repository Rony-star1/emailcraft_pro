import express from 'express';
import { DodoPaymentsClient } from '../services/dodoPayments.js';
import { supabase } from '../server.js';
import { authenticateToken } from '../middleware/auth.js';
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
    const { data, error } = await supabase
      .from('payment_intents')
      .insert({
        id: paymentIntent.id,
        user_id: userId,
        amount,
        currency,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

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
      // Update payment intent status
      const { error: updateError } = await supabase
        .from('payment_intents')
        .update({ 
          status: 'succeeded',
          payment_method_id: paymentMethodId,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', paymentIntentId)
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      // Get payment intent details
      const { data: paymentIntent, error: fetchError } = await supabase
        .from('payment_intents')
        .select('*')
        .eq('id', paymentIntentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Update user subscription
      const subscriptionEndDate = new Date();
      if (paymentIntent.billing_cycle === 'yearly') {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }

      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_id: paymentIntent.plan_id,
          billing_cycle: paymentIntent.billing_cycle,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: subscriptionEndDate.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (subError) {
        throw subError;
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

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

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

    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
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

    const { data: payments, error } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

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
import jwt from 'jsonwebtoken';
import { supabase } from '../server.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error || !subscription) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    // Check if subscription is not expired
    const currentDate = new Date();
    const endDate = new Date(subscription.current_period_end);

    if (currentDate > endDate) {
      return res.status(403).json({ error: 'Subscription expired' });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to check subscription' });
  }
};
export function authRoutes(...args) {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: authRoutes is not implemented yet.', args);
  return null;
}

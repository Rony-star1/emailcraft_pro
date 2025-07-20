import jwt from 'jsonwebtoken';
import { users } from '../server.js';
import { databases } from '../server.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from Appwrite
    const user = await users.get(decoded.userId);

    if (!user) {
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

    const { documents: [subscription] } = await databases.listDocuments(
      'db',
      'subscriptions',
      [
        `userId=${userId}`,
        `status=active`
      ]
    );

    if (!subscription) {
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
import express from 'express';
import bcrypt from 'bcryptjs';
import { account, users } from '../server.js';
import { ID } from 'node-appwrite';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Create user in Appwrite
    const user = await users.create(ID.unique(), email, null, password, name);

    res.status(201).json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create email session
    const session = await account.createEmailPasswordSession(email, password);

    // Create JWT
    const token = jwt.sign({ userId: session.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export { router as authRoutes };

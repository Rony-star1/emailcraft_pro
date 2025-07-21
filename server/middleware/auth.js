import express from 'express';
import jwt from 'jsonwebtoken';
import { account, users } from '../server.js';
import { ID } from 'node-appwrite';

const router = express.Router();

// Middleware to authenticate JWT token
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
    console.error('Token authentication error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Create user in Appwrite
    const user = await users.create(ID.unique(), email, null, password, name);

    // Generate JWT token for the new user
    const token = jwt.sign({ userId: user.$id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      user: {
        id: user.$id,
        email: user.email,
        name: user.name
      }, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 409) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Create email session in Appwrite
    const session = await account.createEmailPasswordSession(email, password);

    // Get user details
    const user = await users.get(session.userId);

    // Create JWT token
    const token = jwt.sign({ userId: session.userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token,
      user: {
        id: user.$id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.code === 401) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.$id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success as the token will expire
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export { router as authRoutes };

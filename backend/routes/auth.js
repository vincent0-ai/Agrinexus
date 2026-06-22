const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/clerk-sync
// @desc    Sync Clerk user to MongoDB
// @access  Public
router.post('/clerk-sync', async (req, res) => {
  try {
    const { clerkId, email, name, role, phone, location } = req.body;

    // Check if user already exists with this clerkId
    let user = await User.findOne({ clerkId });
    
    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.phone = phone || user.phone;
      user.location = location || user.location;
      await user.save();
      
      return res.json({
        message: 'User updated successfully',
        user: user.toJSON(),
        token: generateToken(user._id)
      });
    }

    // Check if user exists with this email (legacy user or duplicate)
    user = await User.findOne({ email });
    if (user) {
      // Link Clerk ID to existing user
      user.clerkId = clerkId;
      user.name = name || user.name;
      user.role = role || user.role;
      user.phone = phone || user.phone;
      user.location = location || user.location;
      user.approved = true; // Auto-approve Clerk users
      await user.save();
      
      return res.json({
        message: 'User linked successfully',
        user: user.toJSON(),
        token: generateToken(user._id)
      });
    }

    // Create new user
    user = await User.create({
      clerkId,
      name,
      email,
      role,
      phone,
      location,
      approved: true // Auto-approve Clerk users
    });

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON(),
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Clerk sync error:', error);
    res.status(500).json({ 
      message: 'Error syncing user', 
      error: error.message 
    });
  }
});

// @route   GET /api/auth/clerk-user/:clerkId
// @desc    Get user by Clerk ID
// @access  Public
router.get('/clerk-user/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (legacy route for backward compatibility)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      location
    });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully',
        user: user.toJSON(),
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (legacy route for backward compatibility)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is approved (for farmers mainly)
    if (!user.approved) {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

module.exports = router;
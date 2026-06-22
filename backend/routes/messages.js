const express = require('express');
const Message = require('../models/Message');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message to a farmer
// @access  Private (Buyer only)
router.post('/', protect, authorize('buyer'), async (req, res) => {
  try {
    const { farmerId, productId, message } = req.body;

    const newMessage = await Message.create({
      buyer: req.user.id,
      farmer: farmerId,
      product: productId,
      message
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('buyer', 'name email phone')
      .populate('farmer', 'name email')
      .populate('product', 'name');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      message: 'Error sending message',
      error: error.message
    });
  }
});

// @route   GET /api/messages/farmer
// @desc    Get all messages for logged in farmer
// @access  Private (Farmer only)
router.get('/farmer', protect, authorize('farmer'), async (req, res) => {
  try {
    const messages = await Message.find({ farmer: req.user.id })
      .populate('buyer', 'name email phone')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    // Transform data to match frontend expectations
    const transformedMessages = messages.map(msg => ({
      _id: msg._id,
      buyerName: msg.buyer?.name || 'Unknown Buyer',
      buyerEmail: msg.buyer?.email || '',
      buyerPhone: msg.buyer?.phone || '',
      productName: msg.product?.name || 'Unknown Product',
      message: msg.message,
      read: msg.read,
      createdAt: msg.createdAt
    }));

    res.json(transformedMessages);
  } catch (error) {
    console.error('Error fetching farmer messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// @route   GET /api/messages/buyer
// @desc    Get all messages for logged in buyer
// @access  Private (Buyer only)
router.get('/buyer', protect, authorize('buyer'), async (req, res) => {
  try {
    const messages = await Message.find({ buyer: req.user.id })
      .populate('farmer', 'name email phone')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching buyer messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// @route   PATCH /api/messages/:id/read
// @desc    Mark message as read
// @access  Private (Farmer only)
router.patch('/:id/read', protect, authorize('farmer'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.read = true;
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Error updating message' });
  }
});

module.exports = router;

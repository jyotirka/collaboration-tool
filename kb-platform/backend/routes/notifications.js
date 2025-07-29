const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const User = require('../models/User');

// Get user notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('notifications.documentId', 'title')
      .select('notifications');
    
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const notification = user.notifications.id(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notification.read = true;
    await user.save();
    
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
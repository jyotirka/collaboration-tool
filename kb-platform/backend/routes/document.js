const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { createDocument, getAllDocuments } = require('../controllers/documentController');
const Document = require('../models/Document');
const User = require('../models/User');
const authMiddleware = require("../middleware/auth");

// Function to extract mentions from content (handles HTML from ReactQuill)
const extractMentions = (content) => {
  const textContent = content.replace(/<[^>]*>/g, ' ');
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = [];
  let match;
  while ((match = mentionRegex.exec(textContent)) !== null) {
    mentions.push(match[1]);
  }
  return [...new Set(mentions)];
};

// Function to process mentions
const processMentions = async (content, documentId, authorId, documentTitle) => {
  const mentionedUsernames = extractMentions(content);
  console.log('Processing mentions:', mentionedUsernames);
  
  if (mentionedUsernames.length === 0) return [];

  try {
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
    
    for (const user of mentionedUsers) {
      if (user._id.toString() !== authorId) {
        const existingNotif = user.notifications.find(n => 
          n.documentId && n.documentId.toString() === documentId.toString() && n.type === 'mention'
        );
        
        if (!existingNotif) {
          user.notifications.push({
            type: 'mention',
            documentId: documentId,
            message: `You were mentioned in "${documentTitle || 'a document'}"`,
            read: false
          });
          await user.save();
        }
      }
    }
    
    return mentionedUsers.map(user => user._id);
  } catch (err) {
    console.error('Error processing mentions:', err);
    return [];
  }
};


// Create and Get (Protected routes)
router.post('/', verifyToken,(req, res, next) => {
  console.log("Received POST /api/documents");
  next();
}, createDocument);

 

// Search users for mentions - must be first
router.get('/users/search', verifyToken, async (req, res) => {
  const { q } = req.query;
  console.log('User search query:', q);
  
  if (!q) return res.json([]);
  
  try {
    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    }).select('username email').limit(10);
    console.log('Found users:', users);
    res.json(users);
  } catch (err) {
    console.error('User search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search documents - must be before generic GET route
router.get('/search', verifyToken, async (req, res) => {
  const { q } = req.query;
  console.log('Document search query:', q);
  
  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  
  try {
    const documents = await Document.find({
      $and: [
        {
          $or: [
            { author: req.user.id },
            { isPublic: true },
            { mentions: req.user.id },
            { collaborators: req.user.id }
          ]
        },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).populate('author', 'email username').sort({ updatedAt: -1 });
    
    console.log('Search results:', documents.length);
    res.json(documents);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/documents - Get documents for logged-in user
router.get('/', verifyToken, getAllDocuments);

// GET single document by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    if (doc.author.toString() !== req.user.id && !doc.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(doc);
  } catch (err) {
    console.error('Get document error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a document
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, isPublic } = req.body;

  try {
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (doc.author.toString() !== req.user.id && !doc.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    doc.title = title || doc.title;
    doc.content = content || doc.content;
    doc.isPublic = isPublic !== undefined ? isPublic : doc.isPublic;

    // Process mentions
    const mentionedUserIds = await processMentions(content, doc._id, req.user.id, title);
    if (mentionedUserIds.length > 0) {
      doc.mentions = [...new Set([...doc.mentions, ...mentionedUserIds])];
      doc.collaborators = [...new Set([...doc.collaborators, ...mentionedUserIds])];
    }

    const updated = await doc.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete a document
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (doc.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Document.findByIdAndDelete(id);
    res.status(200).json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

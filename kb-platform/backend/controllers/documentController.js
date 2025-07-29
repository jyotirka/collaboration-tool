const Document = require('../models/Document');
const User = require('../models/User');

// Function to extract mentions from content
const extractMentions = (content) => {
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = [];
  let match;
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  return [...new Set(mentions)]; // Remove duplicates
};

// Function to process mentions and notify users
const processMentions = async (content, documentId, authorId) => {
  const mentionedUsernames = extractMentions(content);
  if (mentionedUsernames.length === 0) return [];

  try {
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
    
    // Add notifications to mentioned users
    for (const user of mentionedUsers) {
      if (user._id.toString() !== authorId) {
        user.notifications.push({
          type: 'mention',
          documentId: documentId,
          message: `You were mentioned in a document`,
          read: false
        });
        await user.save();
      }
    }
    
    return mentionedUsers.map(user => user._id);
  } catch (err) {
    console.error('Error processing mentions:', err);
    return [];
  }
};

// Create a new document
const createDocument = async (req, res) => {
  const { title, content, isPublic } = req.body;
  const userId = req.user.id;

  try {
    const newDoc = await Document.create({
      title,
      content,
      isPublic,
      author: userId,
    });

    // Process mentions
    const mentionedUserIds = await processMentions(content, newDoc._id, userId);
    if (mentionedUserIds.length > 0) {
      newDoc.mentions = mentionedUserIds;
      newDoc.collaborators = mentionedUserIds;
      await newDoc.save();
    }

    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ message: 'Error creating document', error: err.message });
  }
};

// Get all accessible documents (own + public + collaborator)
const getAllDocuments = async (req, res) => {
  const userId = req.user.id;
  console.log("🔑 User ID:", req.user.id);

  try {
    const docs = await Document.find({
      $or: [
        { author: userId },
        { isPublic: true },
        { mentions: userId },
        { collaborators: userId }
      ]
    }).populate('author', 'email username');

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents', error: err.message });
  }

};

module.exports = {
  createDocument,
  getAllDocuments
};

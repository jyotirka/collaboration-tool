const Document = require('../models/Document');
const User = require('../models/User');

// Function to extract mentions from content (handles HTML from ReactQuill)
const extractMentions = (content) => {
  // Remove HTML tags first, then extract mentions
  const textContent = content.replace(/<[^>]*>/g, ' ');
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentions = [];
  let match;
  while ((match = mentionRegex.exec(textContent)) !== null) {
    mentions.push(match[1]);
  }
  return [...new Set(mentions)]; // Remove duplicates
};

// Function to process mentions and notify users
const processMentions = async (content, documentId, authorId, documentTitle) => {
  const mentionedUsernames = extractMentions(content);
  console.log('Extracted mentions:', mentionedUsernames);
  
  if (mentionedUsernames.length === 0) return [];

  try {
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });
    console.log('Found mentioned users:', mentionedUsers.map(u => u.username));
    
    // Add notifications to mentioned users
    for (const user of mentionedUsers) {
      if (user._id.toString() !== authorId) {
        // Check if notification already exists to avoid duplicates
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
          console.log(`Notification sent to ${user.username}`);
        }
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

    // Process mentions - grant view access to mentioned users
    const mentionedUserIds = await processMentions(content, newDoc._id, userId, title);
    if (mentionedUserIds.length > 0) {
      newDoc.mentions = mentionedUserIds;
      
      // For private documents, automatically add mentioned users as viewers
      if (!newDoc.isPublic) {
        newDoc.viewers = [...new Set([...newDoc.viewers, ...mentionedUserIds])];
      }
      
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
        // For private docs: only shared users (viewers + editors)
        { $and: [{ isPublic: false }, { $or: [{ viewers: userId }, { editors: userId }] }] }
      ]
    }).populate('author', 'email username').populate('editors', '_id username email').populate('viewers', '_id username email');

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents', error: err.message });
  }

};

module.exports = {
  createDocument,
  getAllDocuments
};

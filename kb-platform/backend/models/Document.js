const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  viewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  editors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  shareLink: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);

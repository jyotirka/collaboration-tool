const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Number,
  },
  notifications: [{
    type: {
      type: String,
      enum: ['mention'],
      required: true
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password (handles both old double-hashed and new single-hashed)
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // First try normal comparison (for new users)
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    if (isMatch) return true;
    
    // If that fails, try comparing with double-hashed password (for old users)
    const hashedCandidate = await bcrypt.hash(candidatePassword, 10);
    return await bcrypt.compare(hashedCandidate, this.password);
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  preferences: {
    defaultStyle: String,
    defaultMaterial: String,
    defaultSize: String,
    preferredProduction: String
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    expiresAt: Date,
    features: [String]
  },
  usage: {
    imagesGenerated: { type: Number, default: 0 },
    modelsGenerated: { type: Number, default: 0 },
    lastUsed: Date
  }
}, {
  timestamps: true
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ id: 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    
    // Set passwordChangedAt to current time
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is valid
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

export default mongoose.model('User', userSchema);

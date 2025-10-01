import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import { createSendToken, signToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Sign up a new user
export const signup = async (req, res, next) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
      return next(new AppError('Email, username, and password are required', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return next(new AppError('User with this email already exists', 409));
      }
      if (existingUser.username === username) {
        return next(new AppError('Username already taken', 409));
      }
    }

    // Create new user (password will be hashed by the model middleware)
    const newUser = new User({
      id: uuidv4(),
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password: password, // Will be hashed by pre-save middleware
      profile: {
        firstName: firstName?.trim() || '',
        lastName: lastName?.trim() || ''
      }
    });

    await newUser.save();

    logger.info(`New user registered: ${newUser.email} (${newUser.id})`);

    // Send token and user data
    createSendToken(newUser, 201, res);
  } catch (error) {
    logger.error('Signup Error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(new AppError(`${field} already exists`, 409));
    }
    
    next(new AppError('Failed to create user account', 500));
  }
};

// Sign in existing user
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check password using the model method
    const isPasswordValid = await user.correctPassword(password, user.password);

    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Update last login
    user.usage.lastUsed = new Date();
    await user.save();

    logger.info(`User signed in: ${user.email} (${user.id})`);

    // Send token and user data
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Signin Error:', error);
    next(new AppError('Failed to sign in', 500));
  }
};

// Sign out user (optional - mainly for logging)
export const signout = async (req, res, next) => {
  try {
    // In a stateless JWT system, signout is handled client-side
    // But we can log it for analytics
    if (req.user) {
      logger.info(`User signed out: ${req.user.email} (${req.user.id})`);
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully signed out'
    });
  } catch (error) {
    logger.error('Signout Error:', error);
    next(new AppError('Failed to sign out', 500));
  }
};

// Get current user profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('Get Me Error:', error);
    next(new AppError('Failed to get user profile', 500));
  }
};

// Update user profile
export const updateMe = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body;
    const userId = req.user._id;

    const updateData = {};
    
    if (firstName !== undefined) updateData['profile.firstName'] = firstName;
    if (lastName !== undefined) updateData['profile.lastName'] = lastName;
    if (bio !== undefined) updateData['profile.bio'] = bio;
    if (avatar !== undefined) updateData['profile.avatar'] = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    logger.info(`User profile updated: ${user.email} (${user.id})`);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    logger.error('Update Me Error:', error);
    next(new AppError('Failed to update profile', 500));
  }
};

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return next(new AppError('Current password and new password are required', 400));
    }

    if (newPassword.length < 6) {
      return next(new AppError('New password must be at least 6 characters', 400));
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check current password using the model method
    const isCurrentPasswordValid = await user.correctPassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email} (${user.id})`);

    // Send new token
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Change Password Error:', error);
    next(new AppError('Failed to change password', 500));
  }
};

// Delete user account
export const deleteMe = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Soft delete - mark as deleted but keep data for analytics
    await User.findByIdAndUpdate(userId, {
      email: `deleted_${Date.now()}_${userId}@deleted.com`,
      username: `deleted_${Date.now()}_${userId}`,
      'profile.firstName': 'Deleted',
      'profile.lastName': 'User',
      isDeleted: true,
      deletedAt: new Date()
    });

    logger.info(`User account deleted: ${req.user.email} (${req.user.id})`);

    res.status(204).json({
      status: 'success',
      message: 'Account successfully deleted'
    });
  } catch (error) {
    logger.error('Delete Me Error:', error);
    next(new AppError('Failed to delete account', 500));
  }
};

// Forgot password (placeholder for future implementation)
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // TODO: Implement email service for password reset
    logger.info(`Password reset requested for: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error) {
    logger.error('Forgot Password Error:', error);
    next(new AppError('Failed to process password reset request', 500));
  }
};

// Reset password (placeholder for future implementation)
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(new AppError('Token and new password are required', 400));
    }

    // TODO: Implement token verification and password reset
    logger.info(`Password reset attempted with token: ${token}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset functionality not yet implemented'
    });
  } catch (error) {
    logger.error('Reset Password Error:', error);
    next(new AppError('Failed to reset password', 500));
  }
};

// Google OAuth sign-in
export const signInWithGoogle = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return next(new AppError('Google ID token is required', 400));
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, given_name, family_name } = payload;

    if (!email) {
      return next(new AppError('Google account email not found', 400));
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user from Google account
      const username = email.split('@')[0] + '_' + Date.now().toString().slice(-4);
      
      user = new User({
        id: uuidv4(),
        email: email.toLowerCase(),
        username: username,
        password: 'google_oauth_' + uuidv4(), // Placeholder password for OAuth users
        profile: {
          firstName: given_name || name?.split(' ')[0] || '',
          lastName: family_name || name?.split(' ').slice(1).join(' ') || '',
          avatar: picture
        }
      });

      await user.save();
      logger.info(`New Google user registered: ${user.email} (${user.id})`);
    } else {
      // Update last login
      user.usage.lastUsed = new Date();
      await user.save();
      logger.info(`Google user signed in: ${user.email} (${user.id})`);
    }

    // Send token and user data
    createSendToken(user, 200, res);
  } catch (error) {
    logger.error('Google Sign-in Error:', error);
    next(new AppError('Failed to authenticate with Google', 500));
  }
};

// Apple OAuth sign-in (placeholder)
export const signInWithApple = async (req, res, next) => {
  try {
    // TODO: Implement Apple OAuth
    logger.info('Apple sign-in requested but not yet implemented');

    res.status(501).json({
      status: 'error',
      message: 'Apple sign-in not yet implemented'
    });
  } catch (error) {
    logger.error('Apple Sign-in Error:', error);
    next(new AppError('Apple sign-in not yet implemented', 501));
  }
};

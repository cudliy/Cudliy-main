import express from 'express';
import {
  signup,
  signin,
  signout,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  forgotPassword,
  resetPassword,
  signInWithGoogle,
  signInWithApple
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  signupSchema,
  signinSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/validation.js';
import { validateRequest } from '../utils/validation.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/signin', validateRequest(signinSchema), signin);
router.post('/google', signInWithGoogle);
router.post('/apple', signInWithApple);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

// Protected routes (authentication required)
router.use(protect); // All routes below this line require authentication

router.post('/signout', signout);
router.get('/me', getMe);
router.patch('/me', validateRequest(updateProfileSchema), updateMe);
router.patch('/change-password', validateRequest(changePasswordSchema), changePassword);
router.delete('/me', deleteMe);

export default router;

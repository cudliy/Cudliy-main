import express from 'express';
import multer from 'multer';
import { 
  generateImages, 
  generate3DModel, 
  getDesign, 
  getUserDesigns, 
  deleteDesign, 
  updateDesign 
} from '../controllers/designController.js';
import { protect } from '../middleware/auth.js';
import { AppError } from '../utils/errorHandler.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
    files: 5
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only JPEG, PNG, and WebP are allowed.', 400), false);
    }
  }
});

// Validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
};

// Public routes - No authentication required for guest access
router.post('/generate-images', generateImages);
router.post('/generate-3d-model', generate3DModel);
router.get('/:designId', getDesign);

// Protected routes - Authentication required
router.get('/user/designs', protect, getUserDesigns);
router.delete('/:designId', protect, deleteDesign);
router.patch('/:designId', protect, updateDesign);

export default router;

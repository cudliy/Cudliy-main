import Joi from 'joi';
import { AppError } from './errorHandler.js';

// Authentication Validation Schemas
export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  username: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9_-]+$/).required().messages({
    'string.pattern.base': 'Username can only contain letters, numbers, underscores, and hyphens',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must be no more than 30 characters long',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().max(50).optional().allow(''),
  lastName: Joi.string().max(50).optional().allow('')
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().optional()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Current password is required'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  })
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  })
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  })
});

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }
    
    next();
  };
};

export const generateImagesSchema = Joi.object({
  text: Joi.string().required().min(3).max(500),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i),
  size: Joi.string().valid('S', 'M', 'L', 'custom'),
  style: Joi.string().valid('sci-fi', 'low-poly', 'realistic', 'playful', 'retro'),
  material: Joi.string(),
  production: Joi.string().valid('handmade', 'digital'),
  details: Joi.array().items(Joi.string()),
  //user_id: Joi.string().required(),
  creation_id: Joi.string().required(),
  customWidth: Joi.when('size', {
    is: 'custom',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),
  customHeight: Joi.when('size', {
    is: 'custom',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  })
});

export const generate3DSchema = Joi.object({
  image_url: Joi.string().uri().required(),
  session_id: Joi.string(),
  //user_id: Joi.string().required(),
  creation_id: Joi.string().required(),
  options: Joi.object({
    seed: Joi.number().integer(),
    texture_size: Joi.number().valid(512, 1024, 2048, 4096),
    mesh_simplify: Joi.number().min(0).max(1),
    generate_color: Joi.boolean(),
    generate_model: Joi.boolean(),
    randomize_seed: Joi.boolean(),
    generate_normal: Joi.boolean(),
    save_gaussian_ply: Joi.boolean(),
    ss_sampling_steps: Joi.number().integer().min(1).max(100),
    slat_sampling_steps: Joi.number().integer().min(1).max(50),
    return_no_background: Joi.boolean(),
    ss_guidance_strength: Joi.number().min(0).max(20),
    slat_guidance_strength: Joi.number().min(0).max(10)
  }).optional()
});

export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9_-]+$/).required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().max(50).optional().allow(''),
  lastName: Joi.string().max(50).optional().allow('')
});

// Stripe Payment Validation Schemas
export const createCustomerSchema = Joi.object({
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().max(100),
  metadata: Joi.object().optional()
});

export const createPaymentIntentSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).uppercase().default('USD'),
  metadata: Joi.object().optional()
});

export const createSubscriptionSchema = Joi.object({
  userId: Joi.string().required(),
  priceId: Joi.string().required(),
  metadata: Joi.object().optional()
});

export const trackUsageSchema = Joi.object({
  type: Joi.string().valid('image', 'model').required(),
  amount: Joi.number().integer().min(1).default(1)
});

export const createRefundSchema = Joi.object({
  paymentIntentId: Joi.string().required(),
  amount: Joi.number().positive().optional(),
  reason: Joi.string().valid('duplicate', 'fraudulent', 'requested_by_customer').default('requested_by_customer')
});

// Checkout Validation Schemas
export const createCheckoutSchema = Joi.object({
  designId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1)
});

export const updateShippingSchema = Joi.object({
  firstName: Joi.string().required().max(50),
  lastName: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  phone: Joi.string().required().max(20),
  address: Joi.object({
    line1: Joi.string().required().max(100),
    line2: Joi.string().max(100).optional(),
    city: Joi.string().required().max(50),
    state: Joi.string().required().max(50),
    postalCode: Joi.string().required().max(20),
    country: Joi.string().required().max(50)
  }).required(),
  method: Joi.string().valid('standard', 'express', 'overnight').default('standard')
});

export const updateBillingSchema = Joi.object({
  firstName: Joi.string().required().max(50),
  lastName: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  address: Joi.object({
    line1: Joi.string().required().max(100),
    line2: Joi.string().max(100).optional(),
    city: Joi.string().required().max(50),
    state: Joi.string().required().max(50),
    postalCode: Joi.string().required().max(20),
    country: Joi.string().required().max(50)
  }).required(),
  sameAsShipping: Joi.boolean().default(true)
});

export const completeCheckoutSchema = Joi.object({
  paymentIntentId: Joi.string().required()
});
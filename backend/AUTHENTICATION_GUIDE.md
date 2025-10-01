# MongoDB Authentication System

This document describes the complete MongoDB-based authentication system implemented for the Cudliy backend.

## Overview

The authentication system has been completely rebuilt to use MongoDB with proper user management, JWT tokens, and secure password handling. The system replaces the previous Supabase-based authentication.

## Key Features

- **MongoDB-based user storage** with proper indexing
- **JWT token authentication** with secure token handling
- **Password hashing** using bcrypt with salt rounds of 12
- **User profile management** with update capabilities
- **Password change functionality** with current password verification
- **Account deletion** with soft delete support
- **Consistent userId handling** throughout the system

## User Model

The User model includes:
- Custom UUID-based `id` field (primary identifier)
- Email and username with uniqueness constraints
- Password with automatic hashing via pre-save middleware
- Profile information (firstName, lastName, bio, avatar)
- Subscription and usage tracking
- Timestamps and password change tracking

## Authentication Endpoints

### Public Endpoints (No Authentication Required)

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "username": "username",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
}
```

#### POST `/api/auth/signin`
Sign in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "username": "username"
    }
  }
}
```

#### POST `/api/auth/forgot-password`
Request password reset (placeholder for future implementation).

#### POST `/api/auth/reset-password`
Reset password with token (placeholder for future implementation).

### Protected Endpoints (Authentication Required)

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

#### GET `/api/auth/me`
Get current user profile.

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "user@example.com",
      "username": "username",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "bio": "User bio",
        "avatar": "avatar_url"
      }
    }
  }
}
```

#### PATCH `/api/auth/me`
Update user profile.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Updated bio"
}
```

#### PATCH `/api/auth/change-password`
Change user password.

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### POST `/api/auth/signout`
Sign out user (mainly for logging purposes).

#### DELETE `/api/auth/me`
Delete user account (soft delete).

## Updated API Endpoints

### Design Endpoints

- `GET /api/designs/user/designs` - Get user's designs (now uses authenticated user ID)
- `DELETE /api/designs/:designId` - Delete design (requires authentication)
- `PATCH /api/designs/:designId` - Update design (requires authentication)

### Checkout Endpoints

- `POST /api/checkout/stripe` - Create Stripe checkout (requires authentication)
- `POST /api/checkout/` - Create checkout session (requires authentication)
- `GET /api/checkout/user/orders` - Get user's orders (now uses authenticated user ID)

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Password hashing is handled automatically by the User model middleware
- Password change requires current password verification

### Token Security
- JWT tokens use the user's custom UUID (`id` field) instead of MongoDB ObjectId
- Tokens are signed with a secret key from environment variables
- Token expiration is configurable via environment variables
- Tokens are validated on every protected route

### User ID Consistency
- All user references use the custom UUID (`id` field) consistently
- No more mock userId creation - all users must be properly authenticated
- User ID is extracted from JWT token for all protected operations

## Environment Variables

Required environment variables for authentication:

```env
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
MONGODB_URI=your_mongodb_connection_string
```

## Migration from Supabase

The system has been completely migrated from Supabase to MongoDB:

1. **User Storage**: Users are now stored in MongoDB with proper schema validation
2. **Authentication**: JWT-based authentication replaces Supabase auth
3. **User ID Handling**: Consistent UUID-based user identification
4. **Password Management**: Secure password hashing and validation
5. **Profile Management**: Complete user profile CRUD operations

## Error Handling

The authentication system includes comprehensive error handling:

- **Validation Errors**: Input validation with detailed error messages
- **Authentication Errors**: Proper HTTP status codes for auth failures
- **Database Errors**: Graceful handling of MongoDB errors
- **Security Errors**: Protection against common security vulnerabilities

## Usage Examples

### Frontend Integration

```javascript
// Sign up
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'username',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
});

// Sign in
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Protected request
const response = await fetch('/api/designs/user/designs', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Database Indexes

The User model includes optimized indexes for performance:
- Email index for fast email lookups
- Username index for fast username lookups
- ID index for fast user ID lookups

## Future Enhancements

Planned features for future implementation:
- Email verification for new accounts
- Password reset via email
- Two-factor authentication
- Social login integration
- User role management
- Account recovery options

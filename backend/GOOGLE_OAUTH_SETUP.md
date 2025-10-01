# Google OAuth Integration Setup

This document describes how to set up Google OAuth authentication for the Cudliy backend.

## Overview

The backend now supports Google OAuth authentication alongside the existing email/password authentication. Users can sign in with their Google accounts, and the system will automatically create user accounts or sign in existing users.

## Backend Implementation

### 1. Dependencies Added

The following dependency has been added to `package.json`:
```json
"google-auth-library": "^9.4.1"
```

### 2. Environment Variables Required

Add the following environment variable to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. New Authentication Endpoints

#### POST `/api/auth/google`
Sign in with Google OAuth.

**Request Body:**
```json
{
  "idToken": "google_id_token_here"
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
      "email": "user@gmail.com",
      "username": "user_1234",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://lh3.googleusercontent.com/..."
      }
    }
  }
}
```

#### POST `/api/auth/apple`
Sign in with Apple OAuth (placeholder for future implementation).

**Response:**
```json
{
  "status": "error",
  "message": "Apple sign-in not yet implemented"
}
```

### 4. User Creation Process

When a user signs in with Google for the first time:

1. **Google ID Token Verification**: The backend verifies the Google ID token using the Google Auth Library
2. **User Data Extraction**: Extracts email, name, profile picture, and other information from the Google payload
3. **User Creation**: Creates a new user account with:
   - Custom UUID as the primary identifier
   - Email from Google account
   - Auto-generated username (email prefix + timestamp)
   - Profile information from Google (name, avatar)
   - Placeholder password for OAuth users
4. **JWT Token Generation**: Returns a JWT token for authentication

### 5. Existing User Sign-in

If a user with the same email already exists:
1. **User Lookup**: Finds the existing user by email
2. **Last Login Update**: Updates the `lastUsed` timestamp
3. **JWT Token Generation**: Returns a JWT token for authentication

## Frontend Integration

### 1. Google Identity Services

To implement Google sign-in on the frontend, you'll need to:

1. **Add Google Identity Services script** to your HTML:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

2. **Initialize Google Identity Services**:
```javascript
google.accounts.id.initialize({
  client_id: 'YOUR_GOOGLE_CLIENT_ID',
  callback: handleGoogleSignIn
});
```

3. **Handle the callback**:
```javascript
function handleGoogleSignIn(response) {
  const { credential } = response;
  
  // Send the credential to your backend
  fetch('/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken: credential })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      // Store the token and user data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.data.user));
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  });
}
```

### 2. Updated AuthContext

The AuthContext now includes Google OAuth methods:
- `signInWithGoogle()` - Placeholder for Google OAuth integration
- `signInWithApple()` - Placeholder for Apple OAuth integration

## Google Cloud Console Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Cudliy"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)

### 4. Get Client ID

Copy the Client ID from the credentials page and add it to your backend environment variables:

```env
GOOGLE_CLIENT_ID=your_client_id_here
```

## Security Considerations

### 1. Token Verification

The backend verifies Google ID tokens using the official Google Auth Library, ensuring:
- Token authenticity
- Token expiration
- Audience validation
- Issuer validation

### 2. User Data Protection

- Email addresses are normalized (lowercase)
- Usernames are auto-generated to prevent conflicts
- Profile pictures are stored as provided by Google
- No sensitive Google data is stored beyond what's necessary

### 3. JWT Token Security

- JWT tokens are signed with your secret key
- Tokens include user ID for authentication
- Tokens have configurable expiration times
- Tokens are validated on every protected request

## Testing

### 1. Backend Testing

Test the Google OAuth endpoint:

```bash
curl -X POST http://localhost:3001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken": "your_google_id_token_here"}'
```

### 2. Frontend Testing

1. Set up Google Identity Services on your frontend
2. Configure the Google Client ID
3. Test the sign-in flow
4. Verify that users are created in the database
5. Test that existing users can sign in

## Error Handling

The Google OAuth implementation includes comprehensive error handling:

- **Invalid ID Token**: Returns 400 error with descriptive message
- **Missing Email**: Returns 400 error if Google account has no email
- **Token Verification Failure**: Returns 500 error for verification issues
- **Database Errors**: Handles user creation and lookup errors gracefully

## Future Enhancements

Planned improvements:

1. **Apple OAuth Integration**: Complete Apple sign-in implementation
2. **Social Profile Sync**: Sync profile changes from Google
3. **Account Linking**: Link Google accounts to existing email accounts
4. **Advanced Permissions**: Request additional Google API permissions
5. **Multi-Provider Support**: Support for multiple OAuth providers

## Troubleshooting

### Common Issues

1. **"Google Client ID not configured"**
   - Ensure `GOOGLE_CLIENT_ID` is set in environment variables
   - Restart the backend server

2. **"Invalid Google ID token"**
   - Verify the frontend is sending the correct token format
   - Check that the Google Client ID matches between frontend and backend

3. **"Google account email not found"**
   - Ensure the Google account has a verified email address
   - Check OAuth consent screen configuration

4. **"User creation failed"**
   - Check database connection
   - Verify MongoDB is running
   - Check for duplicate email addresses

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed logs for OAuth token verification and user creation processes.

## Production Deployment

### 1. Environment Variables

Ensure all required environment variables are set:
```env
GOOGLE_CLIENT_ID=your_production_client_id
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

### 2. Google Cloud Console

Update the OAuth consent screen and credentials for production:
- Add production domain to authorized origins
- Update app information for production
- Configure proper scopes and permissions

### 3. Security

- Use HTTPS in production
- Set secure JWT secrets
- Configure proper CORS settings
- Monitor for suspicious OAuth activity

The Google OAuth integration is now ready for use with proper setup and configuration.

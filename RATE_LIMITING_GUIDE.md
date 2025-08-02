# Supabase Rate Limiting Guide

## Understanding the 429 Error

The `429 Too Many Requests` error occurs when you exceed Supabase's rate limits for authentication endpoints. This is common during development when testing sign-up/sign-in flows.

## Supabase Rate Limits

### Free Tier Limits:
- **Sign-ups**: 10 per hour per IP address
- **Sign-ins**: 100 per hour per IP address
- **Password resets**: 10 per hour per IP address
- **OAuth requests**: 100 per hour per IP address

### Pro Tier Limits:
- **Sign-ups**: 100 per hour per IP address
- **Sign-ins**: 1000 per hour per IP address
- **Password resets**: 100 per hour per IP address
- **OAuth requests**: 1000 per hour per IP address

## Immediate Solutions

### 1. Wait for Rate Limit Reset
- Rate limits reset every hour
- Wait approximately 1 hour before trying again
- Check your current time and try again after the hour mark

### 2. Use Different Email Addresses
- Each unique email counts as a separate request
- Use test emails like:
  - `test1@example.com`
  - `test2@example.com`
  - `user+1@gmail.com` (Gmail allows + aliases)

### 3. Clear Browser Data
- Clear cookies and local storage
- This removes any cached authentication attempts
- Helps with session-related rate limiting

## Development Best Practices

### 1. Use Test Users
```javascript
// Create test users with different emails
const testUsers = [
  'test1@example.com',
  'test2@example.com',
  'test3@example.com',
  'user+1@gmail.com',
  'user+2@gmail.com'
];
```

### 2. Implement Error Handling
```javascript
const handleSignUp = async (email, password) => {
  try {
    const { error } = await signUp(email, password);
    if (error) {
      if (error.message.includes('429')) {
        setError('Too many requests. Please wait an hour before trying again.');
      } else {
        setError(error.message);
      }
    }
  } catch (err) {
    setError('An unexpected error occurred');
  }
};
```

### 3. Add Rate Limit Detection
```javascript
const isRateLimited = (error) => {
  return error?.message?.includes('429') || 
         error?.status === 429 ||
         error?.message?.includes('Too Many Requests');
};
```

## Testing Strategies

### 1. Use OAuth for Testing
- Google OAuth doesn't count towards email/password rate limits
- Perfect for testing authentication flows
- Set up Google OAuth following the `GOOGLE_OAUTH_SETUP.md` guide

### 2. Mock Authentication for Development
```javascript
// In development, you can mock successful authentication
if (process.env.NODE_ENV === 'development') {
  // Mock user for testing
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
    user_metadata: { first_name: 'Test' }
  };
  // Use mock user for development
}
```

### 3. Use Different Browsers/Incognito
- Each browser session has separate rate limits
- Use incognito/private browsing for testing
- Use different browsers (Chrome, Firefox, Safari)

## Production Considerations

### 1. Upgrade to Pro Plan
- Higher rate limits for production applications
- Better support and monitoring
- More generous limits for OAuth providers

### 2. Implement Proper Error Handling
```javascript
const handleAuthError = (error) => {
  switch (error.status) {
    case 429:
      return 'Too many requests. Please try again later.';
    case 400:
      return 'Invalid credentials. Please check your input.';
    case 401:
      return 'Authentication failed. Please try again.';
    default:
      return 'An error occurred. Please try again.';
  }
};
```

### 3. Add User Feedback
- Show clear error messages for rate limiting
- Provide alternative authentication methods (OAuth)
- Guide users to wait or try different methods

## Monitoring Rate Limits

### 1. Check Supabase Dashboard
- Go to your Supabase project dashboard
- Check the "Logs" section for rate limit errors
- Monitor authentication attempts

### 2. Implement Logging
```javascript
const logAuthAttempt = (type, success, error = null) => {
  console.log(`Auth ${type}: ${success ? 'SUCCESS' : 'FAILED'}`, {
    timestamp: new Date().toISOString(),
    error: error?.message,
    status: error?.status
  });
};
```

## Quick Fix for Current Issue

1. **Wait 1 hour** before trying to sign up again
2. **Use Google OAuth** instead of email/password for testing
3. **Clear browser data** and try again
4. **Use a different email address** if you need to test immediately

## Alternative Testing Methods

### 1. Use Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Start local development
supabase start

# This gives you unlimited local testing
```

### 2. Use Test Environment
- Create a separate Supabase project for testing
- Use different API keys for development vs production
- Reset test data regularly

## Next Steps

1. **Set up Google OAuth** following the `GOOGLE_OAUTH_SETUP.md` guide
2. **Wait for rate limit reset** (1 hour)
3. **Use different test emails** for future testing
4. **Consider upgrading** to Pro plan for higher limits

## Support

If you continue to experience issues:
- Check Supabase status page
- Review your project's usage in the dashboard
- Contact Supabase support if needed 
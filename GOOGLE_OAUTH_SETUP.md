# Google OAuth Setup for Cudliy

This guide will help you set up Google OAuth authentication for your Cudliy application using Supabase.

## Prerequisites

- A Google Cloud Console account
- A Supabase project
- Your application domain (for redirect URLs)

## Step 1: Google Cloud Console Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Cudliy"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users (your email addresses)

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://sxewgxneoiituwexywwd.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for development)
5. Copy the **Client ID** and **Client Secret**

## Step 2: Supabase Configuration

### 1. Enable Google Provider
1. Go to your Supabase dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" and click "Enable"

### 2. Configure Google Provider
1. Enter the Google Client ID and Client Secret from Step 1
2. Set the redirect URL to: `https://sxewgxneoiituwexywwd.supabase.co/auth/v1/callback`
3. Save the configuration

### 3. Configure Site URL
1. Go to "Authentication" > "Settings"
2. Set your site URL:
   - Production: `https://yourdomain.com`
   - Development: `http://localhost:5173`

## Step 3: Environment Variables

Add these environment variables to your `.env` file:

```env
VITE_SUPABASE_URL=https://sxewgxneoiituwexywwd.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZXdneG5lb2lpdHV3ZXh5d3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTc0MDIsImV4cCI6MjA2OTM3MzQwMn0.OmufNacRTxDMmzTAmlrp_0ln4ur60x7cFJJ2LWCMU-E
```

## Step 4: Testing

1. Start your development server: `npm run dev`
2. Go to the sign-in or sign-up page
3. Click the "Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your dashboard

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in Google Cloud Console matches exactly with Supabase
   - Check for trailing slashes or protocol mismatches

2. **"invalid_client" error**
   - Verify your Client ID and Client Secret are correct
   - Make sure you're using the web application credentials, not mobile or desktop

3. **"access_denied" error**
   - Check if your email is added as a test user in the OAuth consent screen
   - Verify the app is not in "Testing" mode if you want public access

### Development vs Production:

- For development: Use `http://localhost:5173` as your site URL
- For production: Use your actual domain
- Update redirect URIs in both Google Cloud Console and Supabase accordingly

## Security Notes

1. Never commit your Client Secret to version control
2. Use environment variables for sensitive configuration
3. Regularly rotate your OAuth credentials
4. Monitor your OAuth usage in Google Cloud Console

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers) 
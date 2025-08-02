# Vercel Deployment Guide for Cudliy

This guide will walk you through deploying your Cudliy 3D printing dashboard to Vercel.

## 🚀 Prerequisites

- GitHub account with your code pushed to a repository
- Vercel account (free tier available)
- Supabase project configured
- Google OAuth set up (optional)
- Stripe account (optional)

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your project structure is correct:
```
Cudliy/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json
│   └── env.example
├── GOOGLE_OAUTH_SETUP.md
├── RATE_LIMITING_GUIDE.md
└── supabase-schema.sql
```

### 2. Connect to Vercel

1. **Go to [Vercel](https://vercel.com)**
   - Sign up/login with your GitHub account
   - Click "New Project"

2. **Import Repository**
   - Select your Cudliy repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if your code is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3. Set Environment Variables

Before deploying, add these environment variables in Vercel:

1. **Go to Project Settings → Environment Variables**
2. **Add the following variables:**

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Optional
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_APP_NAME=Cudliy
VITE_APP_URL=https://your-app.vercel.app
```

3. **Set Environment**: Select "Production" and "Preview"
4. **Click "Save"**

### 4. Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 2-3 minutes)
3. **Check for any build errors** in the logs

### 5. Configure External Services

After successful deployment, update your external services:

#### Supabase Configuration

1. **Go to Supabase Dashboard → Authentication → Settings**
2. **Update Site URL**: `https://your-app.vercel.app`
3. **Add Redirect URLs**:
   - `https://your-app.vercel.app/dashboard`
   - `https://your-app.vercel.app/auth/callback`

#### Google OAuth (if using)

1. **Go to Google Cloud Console → OAuth 2.0 Credentials**
2. **Add Authorized Redirect URIs**:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `https://your-app.vercel.app/auth/callback`

#### Stripe (if using)

1. **Go to Stripe Dashboard → Webhooks**
2. **Add endpoint**: `https://your-app.vercel.app/api/webhooks/stripe`
3. **Select events**: `payment_intent.succeeded`, `payment_intent.payment_failed`

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

1. **Go to Vercel Project Settings → Domains**
2. **Add your custom domain**
3. **Update DNS records** as instructed
4. **Update environment variables** with new domain

### 2. Environment-Specific Variables

Set up different variables for different environments:

```bash
# Production
VITE_APP_URL=https://your-app.vercel.app

# Preview/Development
VITE_APP_URL=https://your-app-git-main-yourusername.vercel.app
```

### 3. Database Setup

1. **Run the SQL schema** in your Supabase project:
   ```sql
   -- Copy and paste the contents of supabase-schema.sql
   ```

2. **Verify tables are created**:
   - `ai_creations`
   - `print_jobs`

## 🧪 Testing Your Deployment

### 1. Basic Functionality

- [ ] **Homepage loads** without errors
- [ ] **Authentication works** (sign up/sign in)
- [ ] **Google OAuth works** (if configured)
- [ ] **Dashboard displays** correctly
- [ ] **AI Creation modal** opens
- [ ] **Voice input** works (HTTPS required)

### 2. Advanced Features

- [ ] **Speech recognition** works (check browser permissions)
- [ ] **AI creation flow** completes
- [ ] **Payment integration** works (if configured)
- [ ] **Database operations** work correctly

### 3. Mobile Testing

- [ ] **Responsive design** works on mobile
- [ ] **Touch interactions** work properly
- [ ] **Voice input** works on mobile browsers

## 🔍 Troubleshooting

### Common Issues

#### Build Errors

1. **Missing Dependencies**
   ```bash
   # Check if all dependencies are in package.json
   npm install
   ```

2. **TypeScript Errors**
   ```bash
   # Fix TypeScript issues locally first
   npm run build
   ```

3. **Environment Variables**
   - Ensure all required variables are set in Vercel
   - Check variable names match exactly

#### Runtime Errors

1. **CORS Issues**
   - Update Supabase CORS settings
   - Check redirect URLs

2. **Authentication Errors**
   - Verify Supabase configuration
   - Check OAuth redirect URLs

3. **Speech Recognition Not Working**
   - Ensure site is served over HTTPS
   - Check browser permissions
   - Test in different browsers

### Debug Steps

1. **Check Vercel Logs**
   - Go to Project → Functions → View Function Logs

2. **Browser Console**
   - Open DevTools → Console
   - Look for error messages

3. **Network Tab**
   - Check for failed API requests
   - Verify CORS headers

## 📈 Performance Optimization

### 1. Enable Caching

The `vercel.json` includes caching headers for static assets:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Image Optimization

- Use WebP format for images
- Optimize logo files in `/public`
- Consider using Vercel's Image Optimization

### 3. Bundle Analysis

```bash
# Analyze bundle size
npm run build
# Check the dist folder for large files
```

## 🔄 Continuous Deployment

### Automatic Deployments

- **Push to main branch** → Automatic production deployment
- **Create pull request** → Preview deployment
- **Merge pull request** → Production deployment

### Manual Deployments

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Click "Redeploy"**

## 📊 Monitoring

### 1. Vercel Analytics

- **Enable Vercel Analytics** in project settings
- **Monitor performance** and user behavior
- **Track errors** and issues

### 2. Supabase Monitoring

- **Check database performance** in Supabase dashboard
- **Monitor authentication** logs
- **Track API usage**

### 3. Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

## 🔒 Security Checklist

- [ ] **Environment variables** are set (not in code)
- [ ] **HTTPS** is enabled (automatic with Vercel)
- [ ] **CORS** is properly configured
- [ ] **OAuth redirect URLs** are secure
- [ ] **API keys** are not exposed in client code
- [ ] **Rate limiting** is implemented

## 🎉 Success!

Your Cudliy 3D printing dashboard is now live on Vercel! 

**Next Steps:**
1. Share your deployment URL
2. Test all features thoroughly
3. Monitor performance and errors
4. Set up custom domain (optional)
5. Configure monitoring tools

---

**Need Help?**
- Check the troubleshooting section
- Review Vercel documentation
- Open an issue on GitHub 
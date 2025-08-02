# Cudliy - 3D Printing Dashboard

A modern 3D printing management platform with AI-powered creation tools, built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **AI-Powered 3D Creation**: Text-to-image and image-to-3D conversion
- **Voice Input**: Speech-to-text for hands-free creation
- **Authentication**: Email/password and Google OAuth
- **Real-time Dashboard**: Live print status and analytics
- **Payment Integration**: Stripe webhook for purchases
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, Storage)
- **AI Integration**: N8n webhooks (Huanyuan, Trellis)
- **Payments**: Stripe
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Cudliy/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Configure authentication providers
4. Set up Row Level Security (RLS)

### Google OAuth Setup

Follow the detailed guide in `GOOGLE_OAUTH_SETUP.md`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect the Vite configuration

2. **Set Environment Variables**
   - Go to your Vercel project settings
   - Add all environment variables from `.env.local`
   - Redeploy after adding variables

3. **Configure Domain**
   - Update Supabase redirect URLs
   - Update Google OAuth redirect URLs
   - Update Stripe webhook endpoints

### Manual Deployment

```bash
# Build the project
npm run build

# The build output will be in the `dist` folder
# Deploy the contents to your hosting provider
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── SignIn.tsx       # Sign in page
│   │   └── SignUp.tsx       # Sign up page
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── services/            # API services
│   │   └── aiCreationService.ts
│   ├── lib/                 # Utilities
│   │   └── supabase.ts      # Supabase client
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── vercel.json             # Vercel configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies
```

## 🔐 Authentication

The app supports multiple authentication methods:

- **Email/Password**: Traditional sign-up/sign-in
- **Google OAuth**: One-click Google authentication
- **Session Management**: Automatic session persistence

## 🤖 AI Features

### Voice Input
- Continuous speech recognition
- Real-time transcription
- Manual start/stop controls

### AI Creation Pipeline
1. **Text Input**: User describes desired creation
2. **Text-to-Image**: Huanyuan AI generates image
3. **Image-to-3D**: Trellis AI creates 3D model
4. **Payment**: Stripe integration for purchases
5. **Print Queue**: Automatic print job creation

## 💳 Payment Integration

- Stripe payment processing
- Webhook handling for payment confirmations
- Automatic print queue management
- Secure payment flow

## 🎨 Styling

- **Tailwind CSS v4**: Modern utility-first CSS
- **Custom Brand Colors**: Dark red/maroon theme
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions

## 🐛 Troubleshooting

### Common Issues

1. **Rate Limiting**: See `RATE_LIMITING_GUIDE.md`
2. **OAuth Errors**: Check `GOOGLE_OAUTH_SETUP.md`
3. **Build Errors**: Ensure all dependencies are installed

### Development Tips

- Use different email addresses for testing
- Clear browser data if authentication issues occur
- Check browser console for detailed error messages

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting guides
- Review the setup documentation
- Open an issue on GitHub

---

**Cudliy** - Transforming ideas into 3D reality 🎨🖨️

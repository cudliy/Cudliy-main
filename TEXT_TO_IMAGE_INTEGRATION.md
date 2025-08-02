# Text-to-Image Integration Guide

## Overview

This document explains the implementation of the text-to-image functionality in the Cudliy AI Creation component using the Huanyuan webhook.

## Features Implemented

### ✅ Core Functionality
- **Text Input**: Users can type or use voice input to describe what they want to create
- **Webhook Integration**: Real Huanyuan webhook calls to generate images
- **Database Persistence**: All creations are saved to Supabase
- **Status Tracking**: Real-time progress tracking through 3 steps
- **Error Handling**: Comprehensive error management with user feedback

### ✅ User Experience
- **Voice Recognition**: Speech-to-text input using Web Speech API
- **Real-time Feedback**: Visual indicators for webhook status
- **Progressive Steps**: Clear progress indication
- **Error Display**: User-friendly error messages
- **Reset Functionality**: "Create Another" button to start fresh

## Architecture

### Component Structure
```
AICreation.tsx
├── State Management
│   ├── User input (text/voice)
│   ├── Processing status
│   ├── Webhook feedback
│   └── Error handling
├── Authentication Integration
│   └── useAuth() hook
├── Database Operations
│   └── aiCreationService
└── Webhook Communication
    └── Huanyuan API calls
```

### Data Flow
1. **User Input** → Text entered or voice recorded
2. **Database Record** → Creation saved with 'pending' status
3. **Webhook Call** → Send to Huanyuan API
4. **Status Updates** → Database updated with image URL
5. **Result Display** → Image shown to user

## Technical Implementation

### Webhook Request Format
```json
{
  "text": "A cute pink teddy bear with a bow",
  "creation_id": "uuid-string",
  "user_id": "uuid-string", 
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Expected Response Format
```json
{
  "success": true,
  "image_url": "https://generated-image-url.com/image.jpg"
}
```

### Environment Configuration
Add to your `.env` file:
```
VITE_HUANYUAN_WEBHOOK_URL=https://n8nprimary.cudliy.com/webhook-test/textimage
```

## Database Schema

The implementation uses two main tables:

### ai_creations
- `id`: UUID primary key
- `user_id`: Reference to authenticated user
- `input_text`: User's description
- `generated_image_url`: URL of generated image
- `status`: 'pending' | 'processing' | 'completed' | 'failed'
- `created_at`: Timestamp
- `updated_at`: Auto-updated timestamp

### print_jobs (for future 3D printing)
- Links to `ai_creations` table
- Queues successful creations for printing

## Status Indicators

### Webhook Status
- 🔵 **Idle**: Ready to send
- 🟡 **Sending**: Request in progress (with animation)
- 🟢 **Success**: Successfully received by n8n
- 🔴 **Error**: Connection failed

### Creation Steps
1. **Text Input**: User enters description
2. **Text to Image**: Huanyuan processing
3. **Image Ready**: Generation complete

## Error Handling

### Network Errors
- Connection timeouts
- HTTP error status codes
- Invalid response formats

### Validation Errors
- Empty text input
- User not authenticated
- Database operation failures

### User Feedback
- Clear error messages displayed in red box
- Webhook status indicators
- Creation ID tracking for debugging

## Usage Instructions

1. **Authentication**: User must be logged in
2. **Input**: Enter text description or use voice input
3. **Generate**: Click "Create 3D Model" button
4. **Monitor**: Watch progress and webhook status
5. **Result**: View generated image when complete
6. **Reset**: Use "Create Another" to start over

## Future Enhancements

### Planned Features
- Image-to-3D conversion (Trellis integration)
- Download functionality
- Print queue management
- Creation history view
- Image editing tools

### Technical Improvements
- Response caching
- Retry mechanisms
- Rate limiting
- Image optimization
- Batch processing

## Troubleshooting

### Common Issues
1. **Webhook timeouts**: Check network connectivity
2. **Authentication errors**: Ensure user is logged in
3. **Invalid responses**: Verify webhook URL configuration
4. **Database errors**: Check Supabase connection

### Debug Information
- Creation ID displayed for tracking
- Console logs for detailed error information
- Webhook status real-time updates

## Configuration

### Required Environment Variables
```bash
# Supabase (required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# Webhook (optional - defaults to production URL)
VITE_HUANYUAN_WEBHOOK_URL=https://n8nprimary.cudliy.com/webhook-test/textimage
```

### Optional Features
- Google OAuth (for social login)
- Stripe integration (for payments)
- Custom styling configuration

This implementation provides a solid foundation for text-to-image generation with room for future 3D conversion features.
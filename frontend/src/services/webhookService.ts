// Webhook service for handling AI generation requests
export interface WebhookRequest {
  text: string;
  creation_id: string;
  user_id: string;
  timestamp: string;
}

export interface WebhookResponse {
  success: boolean;
  image_url?: string;
  model_url?: string;
  error?: string;
  message?: string;
}

export const webhookService = {
  // Call webhook for text-to-image-to-3D generation (Stable Diffusion + Trellis)
  async callHuanyuanWebhook(request: WebhookRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Use the same URL as in AICreation.tsx for consistency
      const webhookUrl = 'https://n8nprimary.cudliy.com/webhook-test/testimage';
      
      // Create query parameters for GET request to match n8n workflow expectations
      const params = new URLSearchParams({
        text: request.text,
        creation_id: request.creation_id,
        user_id: request.user_id,
        timestamp: request.timestamp
      });
      
      console.log('=== WEBHOOK SERVICE DEBUG ===');
      console.log('URL:', webhookUrl);
      console.log('Full URL with params:', `${webhookUrl}?${params}`);
      console.log('Request data:', request);
      
      const response = await fetch(`${webhookUrl}?${params}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        }
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Try to parse JSON response
      let result;
      try {
        result = await response.json();
        
        // Debug: Log the actual response we got
        console.log('=== WEBHOOK RESPONSE DEBUG ===');
        console.log('Raw response:', result);
        console.log('Image URL:', result?.image_url || 'NO IMAGE URL');
        console.log('3D Model URL:', result?.model_url || 'NO MODEL URL');
        console.log('Success:', result?.success);
        
      } catch (parseError) {
        // If JSON parsing fails, try to get text response
        const textResponse = await response.text();
        console.log('JSON Parse Error:', parseError);
        console.log('Raw text response:', textResponse);
        throw new Error(`Invalid JSON response: ${textResponse}`);
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Webhook error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown webhook error'
      };
    }
  },

  // Call webhook for image-to-3D generation (Trellis)
  async callImageTo3DWebhook(imageUrl: string, creationId: string, userId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // 3D workflow webhook URL
      const webhookUrl = 'https://n8nprimary.cudliy.com/webhook-test/3dworkflow';
      
      // Create query parameters for GET request
      const params = new URLSearchParams({
        image_url: imageUrl,
        creation_id: creationId,
        user_id: userId,
        timestamp: new Date().toISOString()
      });
      
      console.log('=== 3D WEBHOOK SERVICE DEBUG ===');
      console.log('URL:', webhookUrl);
      console.log('Full URL with params:', `${webhookUrl}?${params}`);
      console.log('Sending image URL:', imageUrl);
      
      const response = await fetch(`${webhookUrl}?${params}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        }
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Try to parse JSON response
      let result;
      try {
        result = await response.json();
        
        // Debug: Log the actual response we got
        console.log('=== 3D WEBHOOK RESPONSE DEBUG ===');
        console.log('Raw response:', result);
        console.log('3D Model URL:', result?.model_url || 'NO MODEL URL');
        console.log('Success:', result?.success);
        
      } catch (parseError) {
        // If JSON parsing fails, try to get text response
        const textResponse = await response.text();
        console.log('JSON Parse Error:', parseError);
        console.log('Raw text response:', textResponse);
        throw new Error(`Invalid JSON response: ${textResponse}`);
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('3D webhook error:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown webhook error'
      };
    }
  },

  // Validate webhook response format
  validateWebhookResponse(data: any): data is WebhookResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.success === 'boolean'
    );
  }
};
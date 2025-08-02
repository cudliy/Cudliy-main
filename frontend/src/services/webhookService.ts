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
  error?: string;
  message?: string;
}

export const webhookService = {
  // Call Huanyuan webhook for text-to-image generation
  async callHuanyuanWebhook(request: WebhookRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('https://n8nprimary.cudliy.com/webhook-test/textimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request)
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Try to parse JSON response
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, try to get text response
        const textResponse = await response.text();
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

  // Validate webhook response format
  validateWebhookResponse(data: any): data is WebhookResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.success === 'boolean'
    );
  }
};
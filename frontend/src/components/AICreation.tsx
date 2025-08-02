import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { aiCreationService } from '../services/aiCreationService';

const AICreation = () => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState('');
  const [creationId, setCreationId] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const steps = [
    { id: 1, name: 'Text Input', status: 'pending' },
    { id: 2, name: 'Text to Image', status: 'pending' },
    { id: 3, name: 'Image Ready', status: 'pending' }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      setRecognition(recognition);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  // Call Huanyuan webhook for text-to-image generation
  const callHuanyuanWebhook = async (text: string, creationId: string) => {
    try {
      setWebhookStatus('sending');
      
      const webhookUrl = import.meta.env.VITE_HUANYUAN_WEBHOOK_URL || 'https://n8nprimary.cudliy.com/webhook-test/textimage';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          creation_id: creationId,
          user_id: user?.id,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      setWebhookStatus('success');
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Webhook error:', error);
      setWebhookStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect to Huanyuan service');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const handleCreate = async () => {
    if (!inputText.trim() || !user) {
      setErrorMessage('Please enter text and ensure you are logged in');
      return;
    }
    
    setIsProcessing(true);
    setCurrentStep(1);
    setErrorMessage('');
    setWebhookStatus('idle');
    
    try {
      // Step 1: Create database record
      const { data: creation, error: dbError } = await aiCreationService.createCreation(user.id, inputText.trim());
      
      if (dbError || !creation) {
        throw new Error(dbError?.message || 'Failed to create database record');
      }
      
      setCreationId(creation.id);
      
      // Step 2: Text to Image (Huanyuan)
      setCurrentStep(2);
      const huanyuanResponse = await callHuanyuanWebhook(inputText.trim(), creation.id);
      
      if (huanyuanResponse.success && huanyuanResponse.data?.image_url) {
        // Update database with image URL
        const { error: updateError } = await aiCreationService.updateWithImage(
          creation.id, 
          huanyuanResponse.data.image_url
        );
        
        if (updateError) {
          console.warn('Failed to update database with image URL:', updateError);
        }
        
        setGeneratedImage(huanyuanResponse.data.image_url);
        setCurrentStep(3); // Image Ready
      } else {
        throw new Error(huanyuanResponse.error || 'Failed to generate image');
      }
      
    } catch (error) {
      console.error('Creation failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setInputText('');
    setCurrentStep(0);
    setGeneratedImage('');
    setCreationId(null);
    setWebhookStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 mb-4 floating-animation">
            <img src="/Main Brand ICON.svg" alt="Cudliy Logo" className="h-full w-full" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI-Powered 3D Creation</h1>
          <p className="text-lg text-gray-600">Describe what you want, and we'll create it for you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Describe Your Creation</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Describe what you want to create... (e.g., 'A cute pink teddy bear with a bow')"
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all duration-200 resize-none"
                    disabled={isProcessing}
                  />
                  
                  <button
                    onClick={startListening}
                    disabled={isProcessing || isListening}
                    className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-[#8B0000] text-white hover:bg-[#6B0000]'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#8B0000] to-[#90EE90] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating your 3D model...
                    </div>
                  ) : (
                    'Create 3D Model'
                  )}
                </button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Creation Progress</h3>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                      step.id <= currentStep 
                        ? 'border-[#8B0000] bg-[#8B0000]/5' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl">
                      {step.id < currentStep ? '✅' : step.id === currentStep ? '🔄' : '⏳'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.name}</h4>
                      <p className="text-sm text-gray-600">
                        {step.id === 1 && 'Enter your description'}
                        {step.id === 2 && 'Converting to image with Huanyuan'}
                        {step.id === 3 && 'Image generation complete'}
                      </p>
                    </div>
                    {step.id === currentStep && isProcessing && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#8B0000] border-t-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Webhook Status */}
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Status</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    webhookStatus === 'idle' ? 'bg-gray-400' :
                    webhookStatus === 'sending' ? 'bg-yellow-400 animate-pulse' :
                    webhookStatus === 'success' ? 'bg-green-400' :
                    'bg-red-400'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {webhookStatus === 'idle' && 'Ready to send'}
                    {webhookStatus === 'sending' && 'Sending to Huanyuan...'}
                    {webhookStatus === 'success' && 'Successfully received by n8n'}
                    {webhookStatus === 'error' && 'Failed to connect'}
                  </span>
                </div>
                {creationId && (
                  <p className="text-xs text-gray-500">Creation ID: {creationId}</p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-sm font-semibold text-red-800">Error</h4>
                </div>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {generatedImage && (
              <div className="bg-white rounded-2xl card-shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Image</h3>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={generatedImage} alt="Generated from text" className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-500">Created with Huanyuan AI</p>
                  <div className="flex space-x-3">
                    <button 
                      onClick={resetForm}
                      className="flex-1 py-2 px-4 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors"
                    >
                      Create Another
                    </button>
                    <button className="flex-1 py-2 px-4 border border-[#8B0000] text-[#8B0000] rounded-lg hover:bg-[#8B0000] hover:text-white transition-colors">
                      Save Image
                    </button>
                  </div>
                </div>
              </div>
            )}



            {!generatedImage && (
              <div className="bg-white rounded-2xl card-shadow p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create</h3>
                  <p className="text-gray-500">Describe what you want and we'll generate it for you</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICreation; 
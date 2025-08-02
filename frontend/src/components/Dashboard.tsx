import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { aiCreationService } from '../services/aiCreationService';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const [isPrinting, setIsPrinting] = useState(false);
  const [showAICreation, setShowAICreation] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState('');
  const [generated3D, setGenerated3D] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [creation, setCreation] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  const stats = [
    { name: 'Active Prints', value: '0', change: '0%', changeType: 'neutral' },
    { name: 'Completed Today', value: '0', change: '0%', changeType: 'neutral' },
    { name: 'Revenue', value: '$0', change: '0%', changeType: 'neutral' },
    { name: 'Print Queue', value: '0', change: '0%', changeType: 'neutral' },
  ];



  const quickActions = [
    { name: 'AI Creation', icon: '🤖', action: () => setShowAICreation(true) },
    { name: 'Start New Print', icon: '🖨️', action: () => setIsPrinting(true) },
    { name: 'View Queue', icon: '📋', action: () => console.log('View Queue clicked') },
    { name: 'Analytics', icon: '📊', action: () => console.log('Analytics clicked') },
  ];

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Enable continuous recording
      recognition.interimResults = true; // Get interim results for better UX
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update input text with final results
        if (finalTranscript) {
          setInputText(prev => prev + ' ' + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        // Only stop listening if user didn't manually stop
        if (isListening) {
          // Restart recognition for continuous recording
          setTimeout(() => {
            if (isListening && recognition) {
              try {
                recognition.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
                setIsListening(false);
                // Clear timer if recognition fails
                if (recordingInterval) {
                  clearInterval(recordingInterval);
                  setRecordingInterval(null);
                }
                setRecordingTime(0);
              }
            }
          }, 100);
        } else {
          // Clear timer if user manually stopped
          if (recordingInterval) {
            clearInterval(recordingInterval);
            setRecordingInterval(null);
          }
          setRecordingTime(0);
        }
      };

      setRecognition(recognition);
    }
  }, [isListening]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setRecordingTime(0);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsListening(false);
        clearInterval(interval);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Failed to stop recognition:', error);
      }
      setIsListening(false);
      
      // Clear timer
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setRecordingTime(0);
    }
  };

  const simulateWebhook = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    return {
      success: true,
      data: {
        image_url: 'https://via.placeholder.com/400x400/8B0000/ffffff?text=AI+Generated',
        model_url: 'https://via.placeholder.com/400x400/2F4F2F/ffffff?text=3D+Model'
      }
    };
  };

  const handleStripePayment = async (creationId: string, productName: string, price: number) => {
    try {
      // Simulate Stripe payment webhook
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price * 100, // Convert to cents
          currency: 'usd',
          metadata: {
            creation_id: creationId,
            product_name: productName,
            user_id: user?.id
          }
        })
      });

      await response.json();
      
      // In a real implementation, you would use Stripe.js to confirm the payment
      // For now, we'll simulate a successful payment
      console.log('Payment successful for creation:', creationId);
      
      // Add to print queue after successful payment
      if (user) {
        await aiCreationService.addToPrintQueue(user.id, creationId, productName);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Payment failed:', error);
      return { success: false, error };
    }
  };

  const handleAICreation = async () => {
    if (!inputText.trim() || !user) return;
    
    setIsProcessing(true);
    setCurrentStep(1);
    
    try {
      // Create record in Supabase
      const { data: newCreation, error: creationError } = await aiCreationService.createCreation(
        user.id,
        inputText
      );
      
      if (creationError) {
        console.error('Failed to create record:', creationError);
        return;
      }
      
      setCreation(newCreation);
      
      // Step 2: Text to Image (Huanyuan)
      setCurrentStep(2);
      const huanyuanResponse = await simulateWebhook();
      setGeneratedImage(huanyuanResponse.data.image_url);
      
      // Update Supabase with image
      if (newCreation) {
        await aiCreationService.updateWithImage(newCreation.id, huanyuanResponse.data.image_url);
      }
      
      // Step 3: Image to 3D (Trellis)
      setCurrentStep(3);
      const trellisResponse = await simulateWebhook();
      setGenerated3D(trellisResponse.data.model_url);
      
      // Update Supabase with 3D model
      if (newCreation) {
        await aiCreationService.updateWith3DModel(newCreation.id, trellisResponse.data.model_url);
      }
      
      // Step 4: Complete
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Creation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="/MAIN Logo.svg" alt="Cudliy" className="h-8" />
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.user_metadata?.first_name || user?.email || 'User'}
                </span>
                <button
                  onClick={signOut}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Sign out"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-2xl card-shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={action.action}
                    className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 hover:border-[#8B0000] hover:bg-[#8B0000]/5 transition-all duration-200 group"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
                    <span className="text-sm font-medium text-gray-700 text-center">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>


          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Current Print Status */}
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Print</h2>
              {isPrinting ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="w-full h-full border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#8B0000] rounded-full animate-spin" style={{ borderTopColor: 'transparent' }}></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Teddy Bear - Pink</h3>
                  <p className="text-sm text-gray-600 mb-4">Printing in progress...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-[#8B0000] h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">65% Complete • 45 min remaining</p>
                  <button className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">
                    Stop Print
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No active prints</p>
                  <button 
                    onClick={() => setIsPrinting(true)}
                    className="mt-4 w-full py-2 px-4 brand-gradient text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Start New Print
                  </button>
                </div>
              )}
            </div>

            {/* Popular Products */}
            <div className="bg-white rounded-2xl card-shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Products</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    🧸
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Teddy Bear</p>
                    <p className="text-xs text-gray-500">Pink, Brown, White</p>
                  </div>
                  <span className="text-sm font-semibold text-[#8B0000]">$25</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    🎭
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Labubu</p>
                    <p className="text-xs text-gray-500">Blue, Green, Purple</p>
                  </div>
                  <span className="text-sm font-semibold text-[#8B0000]">$35</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    🎨
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Custom Figurine</p>
                    <p className="text-xs text-gray-500">Any design</p>
                  </div>
                  <span className="text-sm font-semibold text-[#8B0000]">$50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Creation Modal */}
      {showAICreation && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-hide">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">AI-Powered 3D Creation</h2>
                <button
                  onClick={() => setShowAICreation(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Describe Your Creation</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Describe what you want to create... (e.g., 'A cute pink teddy bear with a bow', 'A blue labubu character with wings')"
                          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all duration-200 resize-none"
                          disabled={isProcessing}
                        />
                        
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          {isListening ? (
                            <button
                              onClick={stopListening}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                              title="Stop recording"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={startListening}
                              disabled={isProcessing}
                              className="p-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-all duration-200 disabled:opacity-50"
                              title="Start recording"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {isListening 
                            ? `Recording... ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')} - Click stop to end`
                            : 'Click the microphone to use voice input'
                          }
                        </span>
                      </div>

                      <button
                        onClick={handleAICreation}
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Creation Progress</h3>
                    <div className="space-y-3">
                      {[
                        { id: 1, name: 'Text Input', desc: 'Enter your description' },
                        { id: 2, name: 'Text to Image', desc: 'Converting to image with Huanyuan' },
                        { id: 3, name: 'Image to 3D', desc: 'Converting to 3D with Trellis' },
                        { id: 4, name: 'Ready for Print', desc: '3D model ready' }
                      ].map((step) => (
                        <div
                          key={step.id}
                          className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300 ${
                            step.id <= currentStep 
                              ? 'border-[#8B0000] bg-[#8B0000]/5' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="text-xl">
                            {step.id < currentStep ? '✅' : step.id === currentStep ? '🔄' : '⏳'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{step.name}</h4>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                          </div>
                          {step.id === currentStep && isProcessing && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#8B0000] border-t-transparent"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                  {generatedImage && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Image</h3>
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                        <img src={generatedImage} alt="Generated from text" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Created with Huanyuan AI</p>
                    </div>
                  )}

                  {generated3D && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">3D Model Ready</h3>
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img src={generated3D} alt="3D model" className="w-full h-full object-cover" />
                      </div>
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-gray-500">Created with Trellis AI</p>
                        <div className="flex space-x-3">
                          <button className="flex-1 py-2 px-4 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors">
                            Download 3D Model
                          </button>
                          <button 
                            onClick={() => handleStripePayment(creation?.id || '', 'Custom 3D Model', 50)}
                            className="flex-1 py-2 px-4 border border-[#8B0000] text-[#8B0000] rounded-lg hover:bg-[#8B0000] hover:text-white transition-colors"
                          >
                            Purchase & Print ($50)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!generatedImage && !generated3D && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create</h3>
                      <p className="text-gray-500">Describe what you want and we'll generate it for you</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
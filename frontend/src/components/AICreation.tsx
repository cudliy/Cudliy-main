import { useState, useEffect } from 'react';

const AICreation = () => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState('');
  const [generated3D, setGenerated3D] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  const steps = [
    { id: 1, name: 'Text Input', status: 'pending' },
    { id: 2, name: 'Text to Image', status: 'pending' },
    { id: 3, name: 'Image to 3D', status: 'pending' },
    { id: 4, name: 'Ready for Print', status: 'pending' }
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

  const simulateWebhook = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    return {
      success: true,
      data: {
        image_url: 'https://via.placeholder.com/400x400/ff6b9d/ffffff?text=AI+Generated',
        model_url: 'https://via.placeholder.com/400x400/1c1e3b/ffffff?text=3D+Model'
      }
    };
  };

  const handleCreate = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setCurrentStep(1);
    
    try {
      // Step 2: Text to Image (Huanyuan)
      setCurrentStep(2);
      const huanyuanResponse = await simulateWebhook();
      setGeneratedImage(huanyuanResponse.data.image_url);
      
      // Step 3: Image to 3D (Trellis)
      setCurrentStep(3);
      const trellisResponse = await simulateWebhook();
      setGenerated3D(trellisResponse.data.model_url);
      
      // Step 4: Complete
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Creation failed:', error);
    } finally {
      setIsProcessing(false);
    }
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
                        {step.id === 3 && 'Converting to 3D with Trellis'}
                        {step.id === 4 && '3D model ready'}
                      </p>
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
              <div className="bg-white rounded-2xl card-shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Image</h3>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={generatedImage} alt="Generated from text" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Created with Huanyuan AI</p>
              </div>
            )}

            {generated3D && (
              <div className="bg-white rounded-2xl card-shadow p-6">
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
                    <button className="flex-1 py-2 px-4 border border-[#8B0000] text-[#8B0000] rounded-lg hover:bg-[#8B0000] hover:text-white transition-colors">
                      Add to Print Queue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!generatedImage && !generated3D && (
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
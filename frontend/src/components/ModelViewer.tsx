import React, { useEffect, useRef, useState, useCallback } from 'react';

// Using the existing type declarations from your project
// These should already be defined in your types file

interface ModelViewerProps {
  modelUrl: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
  backgroundColor?: string;
  shadowIntensity?: number;
  exposure?: number;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  alt = "3D Model", 
  autoRotate = true,
  cameraControls = true,
  loadingMessage = "Loading 3D Model...",
  errorMessage = "Failed to load 3D model",
  className = "", 
  style = {},
  showControls = true,
  backgroundColor = "#f3f4f6",
  shadowIntensity = 1,
  exposure = 1,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAutoRotate, setCurrentAutoRotate] = useState(autoRotate);
  const modelViewerRef = useRef<any>(null);

  // Load model-viewer web component
  useEffect(() => {
    const loadModelViewer = async () => {
      try {
        // Check if model-viewer is already loaded
        if (customElements.get('model-viewer')) {
          setIsLoaded(true);
          setIsLoading(false);
          return;
        }

        // Create and load the script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@google/model-viewer@^3.4.0/dist/model-viewer.min.js';
        script.type = 'module';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          setIsLoaded(true);
          setIsLoading(false);
        };
        
        script.onerror = () => {
          const err = 'Failed to load model-viewer library';
          setError(err);
          setIsLoading(false);
          onError?.(err);
        };
        
        document.head.appendChild(script);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage;
        setError(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
      }
    };

    loadModelViewer();
  }, [errorMessage, onError]);

  // Set up event listeners for model-viewer
  useEffect(() => {
    if (isLoaded && modelViewerRef.current && modelUrl) {
      const modelViewer = modelViewerRef.current;
      
      const handleLoad = () => {
        setError(null);
        onLoad?.();
      };
      
      const handleError = (event: any) => {
        const err = event.detail?.message || errorMessage;
        setError(err);
        onError?.(err);
      };

      const handleProgress = (event: any) => {
        // Optional: handle loading progress
        console.log('Loading progress:', event.detail.totalProgress);
      };
      
      // Add event listeners
      modelViewer.addEventListener('load', handleLoad);
      modelViewer.addEventListener('error', handleError);
      modelViewer.addEventListener('progress', handleProgress);
      
      return () => {
        modelViewer.removeEventListener('load', handleLoad);
        modelViewer.removeEventListener('error', handleError);
        modelViewer.removeEventListener('progress', handleProgress);
      };
    }
  }, [isLoaded, modelUrl, errorMessage, onLoad, onError]);

  // Control functions
  const resetView = useCallback(() => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = '0deg 75deg 105%';
      modelViewerRef.current.fieldOfView = '30deg';
      modelViewerRef.current.cameraTarget = '0m 0m 0m';
    }
  }, []);

  const toggleAutoRotate = useCallback(() => {
    if (modelViewerRef.current) {
      const newAutoRotate = !currentAutoRotate;
      setCurrentAutoRotate(newAutoRotate);
      modelViewerRef.current.autoRotate = newAutoRotate;
    }
  }, [currentAutoRotate]);

  const zoomIn = useCallback(() => {
    if (modelViewerRef.current) {
      const currentOrbit = modelViewerRef.current.cameraOrbit;
      const parts = currentOrbit.split(' ');
      if (parts.length >= 3) {
        const distance = parseFloat(parts[2]);
        const newDistance = Math.max(distance * 0.8, 50); // Min 50% zoom
        modelViewerRef.current.cameraOrbit = `${parts[0]} ${parts[1]} ${newDistance}%`;
      }
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (modelViewerRef.current) {
      const currentOrbit = modelViewerRef.current.cameraOrbit;
      const parts = currentOrbit.split(' ');
      if (parts.length >= 3) {
        const distance = parseFloat(parts[2]);
        const newDistance = Math.min(distance * 1.2, 300); // Max 300% zoom
        modelViewerRef.current.cameraOrbit = `${parts[0]} ${parts[1]} ${newDistance}%`;
      }
    }
  }, []);

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`} style={style}>
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-2">Failed to Load 3D Model</p>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // Retry loading
              window.location.reload();
            }}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded || isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`} style={style}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">
            {!isLoaded ? 'Loading 3D Viewer...' : loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  // Validate GLB format
  const isValidGLB = modelUrl && (
    modelUrl.toLowerCase().includes('.glb') || 
    modelUrl.toLowerCase().includes('.gltf') ||
    modelUrl.toLowerCase().includes('.obj')
  );

  if (!isValidGLB) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`} style={style}>
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 text-yellow-500">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
          <p className="text-gray-700 font-medium mb-2">Unsupported Format</p>
          <p className="text-sm text-gray-500">Please use GLB, GLTF, or OBJ format</p>
        </div>
      </div>
    );
  }

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor,
    textDecoration: 'none',
    outline: 'none',
    ...style
  };

  return (
    <div className={`relative ${className}`} style={defaultStyle}>
      <style>
        {`
          model-viewer {
            text-decoration: none !important;
            outline: none !important;
            border: none !important;
          }
          model-viewer:focus {
            outline: none !important;
            text-decoration: none !important;
          }
        `}
      </style>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt={alt}
        auto-rotate={currentAutoRotate}
        camera-controls={cameraControls}
        loading="lazy"
        shadow-intensity={shadowIntensity}
        camera-orbit="0deg 75deg 105%"
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 300%"
        field-of-view="30deg"
        min-field-of-view="10deg"
        max-field-of-view="45deg"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          textDecoration: 'none',
          outline: 'none'
        }}
      >
        {/* Loading slot */}
        <div slot="poster" className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">{loadingMessage}</p>
          </div>
        </div>

        {/* Progress bar slot */}
        <div slot="progress-bar" className="absolute bottom-4 left-4 right-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#8B0000] h-2 rounded-full transition-all duration-300"></div>
          </div>
        </div>
      </model-viewer>
      
      {/* Dark overlay to cover red underline */}
      <div 
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '100px',
          background: '#000000',
          pointerEvents: 'none',
          zIndex: 1000
        }}
      />
      
      {/* Control buttons */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={resetView}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors group"
            title="Reset View"
          >
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button
            onClick={toggleAutoRotate}
            className={`p-2 backdrop-blur-sm rounded-lg shadow-lg transition-colors ${
              currentAutoRotate 
                ? 'bg-[#8B0000] text-white hover:bg-[#6B0000]' 
                : 'bg-white/80 hover:bg-white'
            }`}
            title={currentAutoRotate ? "Stop Auto-Rotate" : "Start Auto-Rotate"}
          >
            <svg className={`w-4 h-4 ${currentAutoRotate ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={zoomIn}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>

          <button
            onClick={zoomOut}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
        </div>
      )}


    </div>
  );
};

export default ModelViewer;

// Usage example for your Dashboard component:
/*
import ModelViewer from './ModelViewer';

// In your component:
{generated3DModel && (
  <div className="bg-white rounded-2xl card-shadow p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">3D Model</h3>
    <div className="aspect-square rounded-xl overflow-hidden">
      <ModelViewer
        modelUrl={generated3DModel}
        alt="Generated 3D Model"
        autoRotate={true}
        cameraControls={true}
        showControls={true}
        backgroundColor="#f3f4f6"
        shadowIntensity={1}
        exposure={1}
        onLoad={() => console.log('Model loaded successfully')}
        onError={(error) => console.error('Model error:', error)}
        className="w-full h-full"
      />
    </div>
    <div className="mt-4 space-y-3">
      <p className="text-sm text-gray-500">Created with Trellis AI</p>
      <div className="flex space-x-3">
        <button 
          onClick={() => {
            setGeneratedImage('');
            setGenerated3DModel('');
            setCurrentStep(0);
            setInputText('');
          }}
          className="flex-1 py-2 px-4 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors"
        >
          Create Another
        </button>
        <a 
          href={generated3DModel}
          download
          className="flex-1 py-2 px-4 border border-[#8B0000] text-[#8B0000] rounded-lg hover:bg-[#8B0000] hover:text-white transition-colors text-center"
        >
          Download Model
        </a>
      </div>
    </div>
  </div>
)}
*/
/// <reference types="vite/client" />

// Type definitions for model-viewer web component
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      // Core attributes
      src?: string;
      alt?: string;
      
      // Camera and interaction
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      'camera-orbit'?: string;
      'field-of-view'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      'min-field-of-view'?: string;
      'max-field-of-view'?: string;
      'camera-target'?: string;
      'touch-action'?: string;
      
      // Loading and display
      loading?: 'auto' | 'lazy' | 'eager';
      poster?: string;
      reveal?: 'auto' | 'manual';
      'auto-rotate-delay'?: number;
      'rotation-per-second'?: string;
      
      // Lighting and shadows
      'shadow-intensity'?: number;
      'shadow-softness'?: number;
      'environment-image'?: string;
      exposure?: number;
      
      // Animation
      interpolation?: 'step' | 'linear';
      'animation-name'?: string;
      'animation-crossfade-duration'?: number;
      autoplay?: boolean;
      'interpolation-decay'?: number;
      
      // AR support
      ar?: boolean | string;
      'ar-modes'?: string;
      
      // Interaction
      'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
      'interaction-prompt-style'?: 'basic' | 'wiggle';
      'interaction-prompt-threshold'?: number;
      'disable-zoom'?: boolean | string;
      'disable-pan'?: boolean | string;
      'disable-tap'?: boolean | string;
      
      // React specific
      ref?: React.Ref<any>;
      style?: React.CSSProperties;
      className?: string;
      
      // Event handlers (React style)
      onLoad?: () => void;
      onError?: (error: any) => void;
      onProgress?: (event: any) => void;
      
      // Slots (as children in React)
      children?: React.ReactNode;
      
      // Any other attributes
      [key: string]: any;
    };
  }
}

// Additional type definitions for model-viewer element methods and properties
interface ModelViewerElement extends HTMLElement {
  // Properties
  src: string;
  alt: string;
  autoRotate: boolean;
  cameraControls: boolean;
  cameraOrbit: string;
  fieldOfView: string;
  cameraTarget: string;
  
  // Methods
  getCameraOrbit(): { theta: number; phi: number; radius: number };
  setCameraOrbit(theta: number, phi: number, radius: number): void;
  getCameraTarget(): { x: number; y: number; z: number };
  setCameraTarget(x: number, y: number, z: number): void;
  getFieldOfView(): number;
  setFieldOfView(fov: number): void;
  
  // Animation methods
  play(options?: { repetitions?: number }): void;
  pause(): void;
  
  // Model information
  getBoundingBoxCenter(): { x: number; y: number; z: number };
  getDimensions(): { x: number; y: number; z: number };
  
  // Screenshot
  toDataURL(type?: string, encoderOptions?: number): string;
  toBlob(options?: { mimeType?: string; qualityArgument?: number; idealAspect?: boolean }): Promise<Blob>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': {
        // Core attributes
        src?: string;
        alt?: string;
        
        // Camera and interaction
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'camera-orbit'?: string;
        'field-of-view'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'min-field-of-view'?: string;
        'max-field-of-view'?: string;
        'camera-target'?: string;
        'touch-action'?: string;
        
        // Loading and display
        loading?: 'auto' | 'lazy' | 'eager';
        poster?: string;
        reveal?: 'auto' | 'manual';
        'auto-rotate-delay'?: number;
        'rotation-per-second'?: string;
        
        // Lighting and shadows
        'shadow-intensity'?: number;
        'shadow-softness'?: number;
        'environment-image'?: string;
        exposure?: number;
        
        // Animation
        interpolation?: 'step' | 'linear';
        'animation-name'?: string;
        'animation-crossfade-duration'?: number;
        autoplay?: boolean;
        'interpolation-decay'?: number;
        
        // AR support
        ar?: boolean | string;
        'ar-modes'?: string;
        
        // Interaction
        'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
        'interaction-prompt-style'?: 'basic' | 'wiggle';
        'interaction-prompt-threshold'?: number;
        'disable-zoom'?: boolean | string;
        'disable-pan'?: boolean | string;
        'disable-tap'?: boolean | string;
        
        // React specific
        ref?: React.Ref<any>;
        style?: React.CSSProperties;
        className?: string;
        
        // Event handlers (React style)
        onLoad?: () => void;
        onError?: (error: any) => void;
        onProgress?: (event: any) => void;
        
        // Slots (as children in React)
        children?: React.ReactNode;
        
        // Any other attributes
        [key: string]: any;
      };
    }
  }
}

export type { ModelViewerElement }; 
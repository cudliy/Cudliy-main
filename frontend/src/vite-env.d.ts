/// <reference types="vite/client" />

// Type definitions for model-viewer web component
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      style?: React.CSSProperties;
      loading?: 'auto' | 'lazy' | 'eager';
      'shadow-intensity'?: number;
      'shadow-softness'?: number;
      poster?: string;
      'reveal-type'?: 'auto' | 'manual';
      'auto-rotate-delay'?: number;
      'rotation-per-second'?: string;
      'camera-orbit'?: string;
      'field-of-view'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      'min-field-of-view'?: string;
      'max-field-of-view'?: string;
      interpolation?: 'step' | 'linear';
      'animation-name'?: string;
      'animation-crossfade-duration'?: number;
      autoplay?: boolean;
    };
  }
}

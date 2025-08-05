/// <reference types="vite/client" />

// Type definitions for model-viewer web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
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

export type { ModelViewerElement }; 
import { Object3D } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js elements
      group: any;
      primitive: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      color: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}

// Extend the Window interface to include any global Three.js properties
declare global {
  interface Window {
    THREE: typeof import('three');
  }
}

// Export the types
export {}; 
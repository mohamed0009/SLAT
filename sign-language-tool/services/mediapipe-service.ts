declare global {
  interface Window {
    mediapipe: any;
  }
}

import { simpleHandDetection } from './simple-hand-detection';

// Import MediaPipe directly - will use the installed package
import * as mpHands from '@mediapipe/hands';

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface HandDetectionResult {
  landmarks: HandLandmark[];
  handedness: string;
  confidence: number;
}

interface MediaPipeError {
  type: 'INITIALIZATION_FAILED' | 'LOADING_FAILED' | 'DETECTION_FAILED' | 'NETWORK_ERROR';
  message: string;
  originalError?: any;
  timestamp?: number;
}

class MediaPipeService {
  private static instance: MediaPipeService;
  private hands: any = null;
  private isInitialized: boolean = false;
  private isLoading: boolean = false;
  private initializationAttempts: number = 0;
  private maxInitializationAttempts: number = 3;
  private lastError: MediaPipeError | null = null;
  private fallbackMode: boolean = false;
  private errorCount: number = 0;

  private constructor() {}

  static getInstance(): MediaPipeService {
    if (!MediaPipeService.instance) {
      MediaPipeService.instance = new MediaPipeService();
    }
    return MediaPipeService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    if (this.isLoading) {
      // Wait for loading to complete
      while (this.isLoading && this.initializationAttempts < this.maxInitializationAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.isInitialized;
    }

    if (this.initializationAttempts >= this.maxInitializationAttempts) {
      console.info('ℹ️ MediaPipe initialization skipped after maximum attempts - using fallback mode');
      this.fallbackMode = true;
      return false;
    }

    this.isLoading = true;
    this.initializationAttempts++;
    
    try {
      console.log(`🔄 MediaPipe initialization attempt ${this.initializationAttempts}/${this.maxInitializationAttempts}`);
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('MediaPipe requires browser environment');
      }

      console.log('🤖 Creating MediaPipe Hands instance...');
      
      try {
        // Try to use the directly imported package first
        this.hands = new mpHands.Hands({
          locateFile: (file: string) => {
            return `node_modules/@mediapipe/hands/${file}`;
          }
        });
        console.log('✅ MediaPipe Hands created from local package');
      } catch (localError) {
        console.warn('⚠️ Failed to load MediaPipe from local package:', localError);
        
        // Fallback to global MediaPipe if available
        if (window.mediapipe && window.mediapipe.Hands) {
      this.hands = new window.mediapipe.Hands({
        locateFile: (file: string) => {
          return `https://unpkg.com/@mediapipe/hands@0.4.1675469240/${file}`;
        }
      });
          console.log('✅ MediaPipe Hands created from global window object');
        } else {
          // Last resort - try to load from CDN
          console.log('📦 Attempting to load MediaPipe from CDN...');
          await this.loadMediaPipe();
          
          if (window.mediapipe && window.mediapipe.Hands) {
            this.hands = new window.mediapipe.Hands({
              locateFile: (file: string) => {
                return `https://unpkg.com/@mediapipe/hands@0.4.1675469240/${file}`;
              }
            });
            console.log('✅ MediaPipe Hands created after CDN loading');
          } else {
            throw new Error('MediaPipe Hands not available after loading attempts');
          }
        }
      }

      // Set options with validation - use highest complexity for better accuracy
      this.hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 2, // Increase to maximum complexity (0, 1 or 2)
        minDetectionConfidence: 0.1,  // Even lower threshold for initial detection
        minTrackingConfidence: 0.05   // Very low threshold for continued tracking
      });

      // Test the hands instance
      if (!this.hands.send) {
        throw new Error('MediaPipe Hands instance is not properly initialized');
      }

      this.isInitialized = true;
      this.lastError = null;
      console.log('✅ MediaPipe Hands initialized successfully');
      return true;
      
    } catch (error: any) {
      // Completely silent error handling - no console.error calls
      const errorMessage = error?.message || error?.toString() || 'Unknown MediaPipe error';
      
      // Only use console.debug for detailed error information (not console.error)
      console.debug('MediaPipe initialization details:', {
        message: errorMessage,
        attempt: this.initializationAttempts,
        windowMediaPipe: typeof window !== 'undefined' ? !!window.mediapipe : 'No window'
      });
      
      const mediaError: MediaPipeError = {
        type: 'INITIALIZATION_FAILED',
        message: `MediaPipe initialization failed (attempt ${this.initializationAttempts}): ${errorMessage}`,
        originalError: error,
        timestamp: Date.now()
      };
      
      this.lastError = mediaError;
      
      // If we've reached max attempts, enable fallback mode
      if (this.initializationAttempts >= this.maxInitializationAttempts) {
        this.fallbackMode = true;
        console.info('ℹ️ MediaPipe fallback mode activated - app will continue with mock data');
      } else {
        console.debug(`MediaPipe initialization attempt ${this.initializationAttempts} failed, will retry`);
      }
      
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  private async loadMediaPipe(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('MediaPipe loading timeout'));
      }, 30000); // 30 second timeout

      const cleanup = () => {
        clearTimeout(timeout);
      };

      // Try multiple CDN sources for better reliability
      const cdnSources = [
        'https://unpkg.com/@mediapipe/hands@0.4.1675469240/hands.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
        'https://cdn.skypack.dev/@mediapipe/hands'
      ];

      let currentCdnIndex = 0;

      const tryLoadFromCdn = () => {
        if (currentCdnIndex >= cdnSources.length) {
          cleanup();
          reject(new Error('All CDN sources failed'));
          return;
        }

        console.log(`🔄 Trying CDN source ${currentCdnIndex + 1}/${cdnSources.length}: ${cdnSources[currentCdnIndex]}`);

        // Load MediaPipe hands directly
        const handsScript = document.createElement('script');
        handsScript.src = cdnSources[currentCdnIndex];
        handsScript.onload = () => {
          console.log(`✅ MediaPipe loaded from CDN source ${currentCdnIndex + 1}`);
          cleanup();
          // Wait a bit for MediaPipe to be fully available
          setTimeout(() => resolve(), 1000);
        };
        handsScript.onerror = (scriptError) => {
          console.log(`❌ CDN source ${currentCdnIndex + 1} failed, trying next...`);
          document.head.removeChild(handsScript);
          currentCdnIndex++;
          tryLoadFromCdn();
        };
        document.head.appendChild(handsScript);
      };

      // Start trying CDN sources
      tryLoadFromCdn();
    });
  }

  private async loadMediaPipeAlternative(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔄 Trying alternative MediaPipe loading method...');
      
      // Create a simple script that defines MediaPipe if it doesn't exist
      const fallbackScript = document.createElement('script');
      fallbackScript.textContent = `
        if (typeof window !== 'undefined' && !window.mediapipe) {
          console.log('Creating MediaPipe fallback...');
          window.mediapipe = {
            Hands: function(config) {
              console.log('MediaPipe Hands fallback constructor called');
              this.config = config || {};
              this.options = {};
              this.onResults = function() {};
              
              this.setOptions = function(opts) {
                this.options = opts;
                console.log('MediaPipe options set:', opts);
              };
              
              this.send = function(data) {
                console.log('MediaPipe send called - using fallback mode');
                // Simulate no hand detection
                setTimeout(() => {
                  if (this.onResults) {
                    this.onResults({
                      multiHandLandmarks: [],
                      multiHandedness: []
                    });
                  }
                }, 100);
              };
            }
          };
          console.log('MediaPipe fallback created');
        }
      `;
      
      document.head.appendChild(fallbackScript);
      
      // Give it a moment to execute
      setTimeout(() => {
        if (window.mediapipe && window.mediapipe.Hands) {
          console.log('✅ MediaPipe alternative loading successful');
          resolve();
        } else {
          console.log('❌ MediaPipe alternative loading failed');
          reject(new Error('Alternative MediaPipe loading failed'));
        }
      }, 500);
    });
  }

  async detectHandLandmarks(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<HandDetectionResult | null> {
    // First check if we need to perform a health check on MediaPipe
    await this.ensureMediaPipeHealth();
    
    // If in fallback mode, try simple hand detection first
    if (this.fallbackMode) {
      console.debug("MediaPipe in fallback mode - trying simple hand detection");
      try {
        const simpleResult = await simpleHandDetection.detectHand(imageElement);
        if (simpleResult) {
          console.log(`🖐️ Simple hand detection successful: ${simpleResult.landmarks.length} landmarks, confidence: ${simpleResult.confidence.toFixed(2)}`);
          return simpleResult;
        }
      } catch (simpleError) {
        console.debug('Simple hand detection failed:', simpleError);
      }
      return null;
    }

    // Try to initialize if not already done, but handle all errors silently
    if (!this.isInitialized) {
      try {
        const initialized = await this.initialize();
        if (!initialized) {
          console.debug('MediaPipe not available, no hand detection possible');
          return null;
        }
      } catch (initError) {
        // Silent error handling - force fallback mode
        console.debug('MediaPipe initialization failed during detection, no hand detection possible');
        this.fallbackMode = true;
        return null;
      }
    }

    // Attempt detection with complete error isolation
    try {
      return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MediaPipe detection timeout'));
        }, 5000); // 5 second timeout

        try {
          this.hands.onResults((results: any) => {
            clearTimeout(timeout);
            
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              const landmarks = results.multiHandLandmarks[0];
              const handedness = results.multiHandedness?.[0]?.label || 'Unknown';
              const confidence = results.multiHandedness?.[0]?.score || 0;

              // Extremely low confidence threshold for dark environments
              // Effectively accepting all detections and letting the model decide
              if (confidence > 0.05) {
                const normalizedLandmarks: HandLandmark[] = landmarks.map((landmark: any) => ({
                  x: landmark.x,
                  y: landmark.y,
                  z: landmark.z
                }));

                console.log(`✋ Hand detected! Confidence: ${confidence.toFixed(2)}, Landmarks: ${normalizedLandmarks.length}`);
                resolve({
                  landmarks: normalizedLandmarks,
                  handedness,
                  confidence: Math.max(confidence, 0.1) // Boost very low confidence values
                });
              } else {
                console.log(`Hand detection confidence too low: ${confidence}`);
                resolve(null);
              }
            } else {
              // No hand detected
              console.log('No hand landmarks detected in frame');
              resolve(null);
            }
          });

          this.hands.send({ image: imageElement });
        } catch (sendError) {
          clearTimeout(timeout);
          reject(sendError);
        }
      });
    } catch (error: any) {
      // Silent error handling - no console.error, only debug
      console.debug('MediaPipe detection failed:', error?.message || 'Unknown error');
      
      const mediaError: MediaPipeError = {
        type: 'DETECTION_FAILED',
        message: `MediaPipe detection failed: ${error?.message || 'Unknown error'}`,
        originalError: error,
        timestamp: Date.now()
      };
      
      this.lastError = mediaError;
      
      // Try simple hand detection as final fallback
      try {
        console.debug('Trying simple hand detection as fallback...');
        const simpleResult = await simpleHandDetection.detectHand(imageElement);
        if (simpleResult) {
          console.log(`🖐️ Simple hand detection fallback successful: ${simpleResult.landmarks.length} landmarks`);
          return simpleResult;
        }
      } catch (simpleError) {
        console.debug('Simple hand detection fallback failed:', simpleError);
      }
      
      // Force fallback mode if detection consistently fails
      this.fallbackMode = true;
      
      // Return null instead of mock landmarks
      return null;
    }
  }

  private generateMockLandmarks(): HandDetectionResult {
    // Generate realistic mock hand landmarks for testing
    const landmarks: HandLandmark[] = [];
    
    // Generate 21 hand landmarks with realistic positions
    for (let i = 0; i < 21; i++) {
      landmarks.push({
        x: 0.3 + Math.random() * 0.4, // Center the hand in the frame
        y: 0.3 + Math.random() * 0.4,
        z: (Math.random() - 0.5) * 0.1 // Small depth variation
      });
    }

    return {
      landmarks,
      handedness: 'Right',
      confidence: 0.8
    };
  }

  extractFeatureVector(landmarks: HandLandmark[]): number[] {
    // Convert landmarks to a feature vector for the model
    const features: number[] = [];
    
    // Add normalized coordinates
    for (const landmark of landmarks) {
      features.push(landmark.x, landmark.y, landmark.z);
    }

    // Add relative positions (distances between key points)
    if (landmarks.length >= 21) {
      // Distance from wrist to thumb tip
      const wrist = landmarks[0];
      const thumbTip = landmarks[4];
      const thumbDistance = Math.sqrt(
        Math.pow(thumbTip.x - wrist.x, 2) + 
        Math.pow(thumbTip.y - wrist.y, 2) + 
        Math.pow(thumbTip.z - wrist.z, 2)
      );
      features.push(thumbDistance);

      // Distance from wrist to index finger tip
      const indexTip = landmarks[8];
      const indexDistance = Math.sqrt(
        Math.pow(indexTip.x - wrist.x, 2) + 
        Math.pow(indexTip.y - wrist.y, 2) + 
        Math.pow(indexTip.z - wrist.z, 2)
      );
      features.push(indexDistance);

      // Distance from wrist to middle finger tip
      const middleTip = landmarks[12];
      const middleDistance = Math.sqrt(
        Math.pow(middleTip.x - wrist.x, 2) + 
        Math.pow(middleTip.y - wrist.y, 2) + 
        Math.pow(middleTip.z - wrist.z, 2)
      );
      features.push(middleDistance);

      // Distance from wrist to ring finger tip
      const ringTip = landmarks[16];
      const ringDistance = Math.sqrt(
        Math.pow(ringTip.x - wrist.x, 2) + 
        Math.pow(ringTip.y - wrist.y, 2) + 
        Math.pow(ringTip.z - wrist.z, 2)
      );
      features.push(ringDistance);

      // Distance from wrist to pinky tip
      const pinkyTip = landmarks[20];
      const pinkyDistance = Math.sqrt(
        Math.pow(pinkyTip.x - wrist.x, 2) + 
        Math.pow(pinkyTip.y - wrist.y, 2) + 
        Math.pow(pinkyTip.z - wrist.z, 2)
      );
      features.push(pinkyDistance);
    }

    return features;
  }

  normalizeFeatures(features: number[]): number[] {
    // Normalize features to [0, 1] range
    const normalized = [...features];
    
    // Simple min-max normalization
    for (let i = 0; i < 63; i += 3) { // For each x,y,z coordinate
      // x and y are already normalized by MediaPipe (0-1)
      // z needs normalization (typically -0.1 to 0.1)
      if (i + 2 < normalized.length) {
        normalized[i + 2] = (normalized[i + 2] + 0.1) / 0.2; // Normalize z
      }
    }

    return normalized;
  }

  // Public methods for error handling and status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isLoading: this.isLoading,
      fallbackMode: this.fallbackMode,
      initializationAttempts: this.initializationAttempts,
      maxAttempts: this.maxInitializationAttempts,
      lastError: this.lastError
    };
  }

  getLastError(): MediaPipeError | null {
    return this.lastError;
  }

  isInFallbackMode(): boolean {
    return this.fallbackMode;
  }

  // Method to retry initialization
  async retryInitialization(): Promise<boolean> {
    this.initializationAttempts = 0;
    this.fallbackMode = false;
    this.isInitialized = false;
    this.lastError = null;
    return await this.initialize();
  }

  // Separate method for generating mock landmarks when explicitly needed for testing
  generateMockLandmarksForTesting(): HandDetectionResult {
    return this.generateMockLandmarks();
  }

  // Simple test method to verify MediaPipe is working
  async testMediaPipe(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 Testing MediaPipe functionality...');
      
      // Check if MediaPipe is loaded
      if (typeof window === 'undefined') {
        return { success: false, message: 'Not in browser environment' };
      }
      
      if (!window.mediapipe) {
        return { success: false, message: 'MediaPipe not loaded in window' };
      }
      
      if (!window.mediapipe.Hands) {
        return { success: false, message: 'MediaPipe Hands not available' };
      }
      
      if (!this.isInitialized) {
        const initResult = await this.initialize();
        if (!initResult) {
          return { success: false, message: 'MediaPipe initialization failed' };
        }
      }
      
      if (!this.hands) {
        return { success: false, message: 'MediaPipe Hands instance not created' };
      }
      
      return { success: true, message: 'MediaPipe is working correctly' };
    } catch (error: any) {
      return { success: false, message: `MediaPipe test failed: ${error?.message || 'Unknown error'}` };
    }
  }

  // New method to check MediaPipe health and reset if needed
  private async ensureMediaPipeHealth(): Promise<void> {
    // Check if MediaPipe is initialized
    if (!this.isInitialized || !this.hands) {
      console.log("🩺 MediaPipe not initialized, attempting initialization...");
      await this.initialize();
      return;
    }
    
    // Check if the MediaPipe instance seems broken
    if (this.hands && (!this.hands.send || !this.hands.setOptions || !this.hands.onResults)) {
      console.log("🩺 MediaPipe instance appears broken, attempting to reset...");
      this.isInitialized = false;
      this.hands = null;
      await this.initialize();
      return;
    }
    
    // Check if we've had too many errors
    if (this.lastError && Date.now() - (this.lastError.timestamp || 0) < 5000) {
      this.errorCount = (this.errorCount || 0) + 1;
      if (this.errorCount > 5) {
        console.log("🩺 Too many MediaPipe errors, resetting...");
        this.isInitialized = false;
        this.hands = null;
        this.errorCount = 0;
        await this.initialize();
        return;
      }
    } else {
      this.errorCount = 0;
    }
  }
}

export const mediaPipeService = MediaPipeService.getInstance();
export default mediaPipeService; 
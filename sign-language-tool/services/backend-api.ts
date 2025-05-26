import axios from 'axios';

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface BackendDetectionResult {
  letter: string;
  confidence: number;
  processing_time: number;
  method: 'landmarks' | 'image';
  landmarks_detected: boolean;
  error?: string;
}

interface DetectionRequest {
  landmarks?: HandLandmark[];
  image_data?: string; // base64 encoded image
  use_landmarks: boolean;
}

class BackendApiService {
  private static instance: BackendApiService;
  private baseUrl: string;
  private isAvailable: boolean = false;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds

  private constructor() {
    // Updated to match Django URL structure
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  }

  static getInstance(): BackendApiService {
    if (!BackendApiService.instance) {
      BackendApiService.instance = new BackendApiService();
    }
    return BackendApiService.instance;
  }

  async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Skip health check if done recently
    if (now - this.lastHealthCheck < this.healthCheckInterval && this.isAvailable) {
      return this.isAvailable;
    }

    try {
      // Updated to match Django API endpoint
      const response = await axios.get(`${this.baseUrl}/app/api/health/`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.isAvailable = response.status === 200;
      this.lastHealthCheck = now;
      
      if (this.isAvailable) {
        console.log('✓ Backend API is available');
      }
      
      return this.isAvailable;
    } catch (error) {
      console.warn('Backend API not available:', error);
      this.isAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  async detectSignFromLandmarks(landmarks: HandLandmark[]): Promise<BackendDetectionResult | null> {
    try {
      if (!await this.checkHealth()) {
        console.warn('Backend not available for landmark detection');
        return null;
      }

      const request: DetectionRequest = {
        landmarks: landmarks,
        use_landmarks: true,
      };

      // Updated to match Django API endpoint
      const response = await axios.post(`${this.baseUrl}/app/api/detect-sign/`, request, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data as BackendDetectionResult;
    } catch (error) {
      console.error('Error detecting sign from landmarks:', error);
      return null;
    }
  }

  async detectSignFromImage(imageData: ImageData): Promise<BackendDetectionResult | null> {
    try {
      if (!await this.checkHealth()) {
        console.warn('Backend not available for image detection');
        return null;
      }

      // Convert ImageData to base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx?.putImageData(imageData, 0, 0);
      
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      const request: DetectionRequest = {
        image_data: base64Image,
        use_landmarks: false,
      };

      // Updated to match Django API endpoint
      const response = await axios.post(`${this.baseUrl}/app/api/detect-sign/`, request, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data as BackendDetectionResult;
    } catch (error) {
      console.error('Error detecting sign from image:', error);
      return null;
    }
  }

  async getModelInfo(): Promise<any> {
    try {
      if (!await this.checkHealth()) {
        return null;
      }

      // Updated to match Django API endpoint
      const response = await axios.get(`${this.baseUrl}/app/api/model-info/`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting model info:', error);
      return null;
    }
  }

  // Additional method to use the Django predict endpoint
  async predictFromLandmarks(landmarks: any[]): Promise<any> {
    try {
      if (!await this.checkHealth()) {
        return null;
      }

      const response = await axios.post(`${this.baseUrl}/app/predict/`, {
        landmarks: landmarks
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error with Django predict endpoint:', error);
      return null;
    }
  }

  getStatus() {
    return {
      isAvailable: this.isAvailable,
      baseUrl: this.baseUrl,
      lastHealthCheck: this.lastHealthCheck,
    };
  }

  // Method to test different backend URLs
  async findAvailableBackend(): Promise<string | null> {
    const possibleUrls = [
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
    ];

    for (const url of possibleUrls) {
      try {
        // Updated to match Django API endpoint
        const response = await axios.get(`${url}/app/api/health/`, {
          timeout: 3000,
        });
        
        if (response.status === 200) {
          this.baseUrl = url;
          this.isAvailable = true;
          console.log(`✓ Found backend at: ${url}`);
          return url;
        }
      } catch (error) {
        // Continue to next URL
      }
    }

    console.warn('No available backend found');
    return null;
  }
}

export const backendApiService = BackendApiService.getInstance();
export default backendApiService; 
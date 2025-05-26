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

class SimpleHandDetection {
  private static instance: SimpleHandDetection;

  private constructor() {}

  static getInstance(): SimpleHandDetection {
    if (!SimpleHandDetection.instance) {
      SimpleHandDetection.instance = new SimpleHandDetection();
    }
    return SimpleHandDetection.instance;
  }

  async detectHand(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<HandDetectionResult | null> {
    try {
      // Simple color-based hand detection
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = 224;
      canvas.height = 224;
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple skin color detection
      let skinPixels = 0;
      let totalPixels = 0;
      const skinRegions: { x: number; y: number }[] = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        totalPixels++;
        
        // Simple skin color detection (very basic)
        if (this.isSkinColor(r, g, b)) {
          skinPixels++;
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);
          skinRegions.push({ x: x / canvas.width, y: y / canvas.height });
        }
      }

      const skinRatio = skinPixels / totalPixels;
      
      // If we detect enough skin-colored pixels, assume there's a hand
      if (skinRatio > 0.05 && skinRegions.length > 100) {
        console.log(`🖐️ Simple hand detection: ${skinPixels} skin pixels (${(skinRatio * 100).toFixed(1)}%)`);
        
        // Generate simplified hand landmarks based on skin regions
        const landmarks = this.generateLandmarksFromSkinRegions(skinRegions);
        
        return {
          landmarks,
          handedness: 'Right',
          confidence: Math.min(skinRatio * 10, 0.9) // Scale confidence
        };
      }

      return null;
    } catch (error) {
      console.debug('Simple hand detection error:', error);
      return null;
    }
  }

  private isSkinColor(r: number, g: number, b: number): boolean {
    // Very simple skin color detection
    // This is a basic heuristic and not very accurate
    return (
      r > 95 && g > 40 && b > 20 &&
      r > g && r > b &&
      Math.abs(r - g) > 15 &&
      r - b > 15
    );
  }

  private generateLandmarksFromSkinRegions(skinRegions: { x: number; y: number }[]): HandLandmark[] {
    // Generate 21 hand landmarks based on skin regions
    const landmarks: HandLandmark[] = [];
    
    if (skinRegions.length === 0) {
      // Fallback to center landmarks
      for (let i = 0; i < 21; i++) {
        landmarks.push({
          x: 0.5 + (Math.random() - 0.5) * 0.2,
          y: 0.5 + (Math.random() - 0.5) * 0.2,
          z: (Math.random() - 0.5) * 0.1
        });
      }
      return landmarks;
    }

    // Calculate bounding box of skin regions
    const minX = Math.min(...skinRegions.map(p => p.x));
    const maxX = Math.max(...skinRegions.map(p => p.x));
    const minY = Math.min(...skinRegions.map(p => p.y));
    const maxY = Math.max(...skinRegions.map(p => p.y));
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const width = maxX - minX;
    const height = maxY - minY;

    // Generate landmarks in a hand-like pattern
    const handPattern = [
      // Wrist
      { x: 0, y: 0.8 },
      // Thumb
      { x: -0.3, y: 0.6 }, { x: -0.4, y: 0.4 }, { x: -0.5, y: 0.2 }, { x: -0.6, y: 0 },
      // Index finger
      { x: -0.2, y: 0.6 }, { x: -0.2, y: 0.4 }, { x: -0.2, y: 0.2 }, { x: -0.2, y: 0 },
      // Middle finger
      { x: 0, y: 0.6 }, { x: 0, y: 0.4 }, { x: 0, y: 0.2 }, { x: 0, y: -0.1 },
      // Ring finger
      { x: 0.2, y: 0.6 }, { x: 0.2, y: 0.4 }, { x: 0.2, y: 0.2 }, { x: 0.2, y: 0 },
      // Pinky
      { x: 0.4, y: 0.6 }, { x: 0.4, y: 0.4 }, { x: 0.4, y: 0.2 }, { x: 0.4, y: 0.1 }
    ];

    for (const pattern of handPattern) {
      landmarks.push({
        x: centerX + pattern.x * width * 0.5,
        y: centerY + pattern.y * height * 0.5,
        z: (Math.random() - 0.5) * 0.05
      });
    }

    return landmarks;
  }
}

export const simpleHandDetection = SimpleHandDetection.getInstance();
export default simpleHandDetection; 
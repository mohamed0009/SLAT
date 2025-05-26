import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HandMetal, Video, Camera, AlertTriangle } from 'lucide-react';

interface WebcamFeedProps {
  onFrameCapture: (imageData: ImageData) => void;
  isDetecting: boolean;
  onStartDetection: () => void;
  onStopDetection: () => void;
}

export const WebcamFeed = ({
  onFrameCapture,
  isDetecting,
  onStartDetection,
  onStopDetection,
}: WebcamFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [handVisible, setHandVisible] = useState(false);

  useEffect(() => {
    const initializeCamera = async () => {
      setIsInitializing(true);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        // Set initializing to false after a brief delay to allow video to start
        setTimeout(() => setIsInitializing(false), 1500);
      } catch (err) {
        setError('Failed to access camera. Please ensure you have granted camera permissions.');
        setIsInitializing(false);
        console.error('Camera access error:', err);
      }
    };

    initializeCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate hand detection for demo purposes
  useEffect(() => {
    if (isDetecting) {
      const intervalId = setInterval(() => {
        // Randomly toggle hand visibility to simulate detection
        setHandVisible(prev => Math.random() > 0.3 ? true : prev);
      }, 2000);
      
      return () => clearInterval(intervalId);
    } else {
      setHandVisible(false);
    }
  }, [isDetecting]);

  useEffect(() => {
    let animationFrameId: number;

    const captureFrame = () => {
      if (videoRef.current && canvasRef.current && isDetecting) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          // Set canvas dimensions to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw the current video frame
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get the image data
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          onFrameCapture(imageData);
        }

        // Schedule next frame capture
        animationFrameId = requestAnimationFrame(captureFrame);
      }
    };

    if (isDetecting) {
      captureFrame();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDetecting, onFrameCapture]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-zinc-700">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }} // Mirror the video for better user experience
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm">
            <div className="bg-red-50 p-6 rounded-lg shadow-lg max-w-md mx-4">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <AlertTriangle className="h-6 w-6" />
                <span className="font-semibold">Camera Error</span>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Reload Page
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Hand position guide - only show when not detecting */}
            {!isDetecting && !isInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20">
                <div className="relative mb-4">
                  <HandMetal className="h-20 w-20 text-white/80" />
                  <div className="absolute inset-0 animate-ping opacity-30">
                    <HandMetal className="h-20 w-20 text-white/60" />
                  </div>
                </div>
                <p className="text-white text-xl font-medium text-center px-6 drop-shadow-lg">
                  Position your hand in the frame
                </p>
                <p className="text-white/80 text-sm text-center px-6 mt-2 drop-shadow-md">
                  Make sure your hand is clearly visible and well-lit
                </p>
              </div>
            )}

            {/* Loading overlay */}
            {isInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                <p className="text-white text-lg font-medium">Initializing Camera...</p>
              </div>
            )}
            
            {/* Control buttons */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button
                onClick={onStartDetection}
                disabled={isDetecting || isInitializing || !!error}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isDetecting ? 'Detecting...' : 'Start Detection'}
              </Button>
              <Button
                onClick={onStopDetection}
                disabled={!isDetecting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Stop Detection
              </Button>
            </div>
            
            {/* Status indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-3 px-4 py-2 bg-black/70 backdrop-blur-sm text-white rounded-full shadow-lg">
              <div className={`h-3 w-3 rounded-full ${
                isInitializing ? 'bg-yellow-400 animate-pulse' :
                isDetecting ? 'bg-green-400 animate-pulse' : 
                'bg-gray-400'
              }`} />
              <span className="text-sm font-medium">
                {isInitializing ? 'Initializing...' : 
                 isDetecting ? 'Detecting' : 
                 'Ready'}
              </span>
            </div>

            {/* Detection indicator */}
            {isDetecting && (
              <div className="absolute top-4 left-4 px-4 py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Detection</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Camera info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Camera feed is mirrored for better user experience</p>
        <p className="mt-1">Ensure good lighting for optimal detection accuracy</p>
      </div>
    </div>
  );
};

export default WebcamFeed; 
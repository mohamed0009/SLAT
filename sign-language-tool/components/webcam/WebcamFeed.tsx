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
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/10 backdrop-blur-sm">
            <div className="bg-red-50 p-4 rounded-lg shadow-lg max-w-md">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Camera Error</span>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Hand position guide */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {!isDetecting && (
                <>
                  <div className="relative mb-2">
                    <HandMetal className="h-16 w-16 text-white/70" />
                    <div className="absolute inset-0 animate-ping opacity-40">
                      <HandMetal className="h-16 w-16 text-white/50" />
                    </div>
                  </div>
                  <p className="text-white/90 text-lg font-medium mt-4 text-center px-4 drop-shadow-md">
                    Position your hand in the frame
                  </p>
                </>
              )}
            </div>
            
            {/* Buttons overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              <Button
                onClick={onStartDetection}
                disabled={isDetecting || isInitializing || !!error}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md shadow-md disabled:opacity-60"
              >
                Start Detection
              </Button>
              <Button
                onClick={onStopDetection}
                disabled={!isDetecting}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md shadow-md disabled:opacity-60"
              >
                Stop Detection
              </Button>
            </div>
            
            {/* Status indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white rounded-full shadow-md">
              <div className={`h-2.5 w-2.5 rounded-full ${isDetecting ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">{isInitializing ? 'Initializing...' : isDetecting ? 'Detecting' : 'Ready'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WebcamFeed; 
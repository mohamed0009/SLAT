'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { Activity, BarChart2, Bell, Book, HandMetal, Languages, Layers, Mic, Send, Settings, User, Video, AlertCircle, RefreshCw, Save, StopCircle, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import WebcamFeed from '@/components/webcam/WebcamFeed';
import TextToSign from '@/components/text-to-sign/TextToSign';
import { signLanguageModel } from '@/services/model';
import { signLanguageApi } from '@/services/api';
import { Conversation, ConversationHandle } from '@/components/conversation/Conversation';
import { AudioToSign } from "@/components/audio-to-sign/AudioToSign";
import { Badge } from "@/components/ui/badge"
import { WelcomeBanner } from '@/components/welcome-banner';
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

interface DetectionResult {
  gesture: string;
  confidence: number;
  detectionTime: number;
  fps: number;
}

export default function HomePage() {
  const router = useRouter();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult>({
    gesture: '',
    confidence: 0,
    detectionTime: 0,
    fps: 0,
  });
  const [systemStatus, setSystemStatus] = useState({
    camera: 'initializing',
    model: 'loading',
    processing: 'idle',
  });
  
  // Use refs to track state and component references
  const isProcessingRef = useRef(false);
  const conversationRef = useRef<ConversationHandle>(null);
  const [handDetected, setHandDetected] = useState(false);
  const [landmarks, setLandmarks] = useState(0);
  
  // Add refs for tracking detection history
  const lastDetectedGestureRef = useRef('');
  const lastDetectionTimeRef = useRef(0);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSigns, setRecordedSigns] = useState<string[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [recordingToSave, setRecordingToSave] = useState<any>(null);
  
  // Video recording refs and states
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && recordingStartTime) {
      interval = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingStartTime]);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        await signLanguageModel.loadModel();
        setSystemStatus(prev => ({ ...prev, model: 'ready' }));
      } catch (error) {
        console.error('Failed to initialize model:', error);
        setSystemStatus(prev => ({ ...prev, model: 'error' }));
      }
    };

    initializeModel();
  }, []);

  const handleFrameCapture = useCallback(async (imageData: ImageData) => {
    if (isProcessingRef.current) return;
    
    try {
      isProcessingRef.current = true;
      setSystemStatus(prev => ({ ...prev, processing: 'active' }));
      const startTime = performance.now();

      const result = await signLanguageModel.detectSign(imageData);
      
      // Update hand detection state
      setHandDetected(result.confidence > 0.5);
      // Ensure landmarks is a number - if it's an array, use its length instead
      setLandmarks(Array.isArray(result.landmarks) ? result.landmarks.length : (result.landmarks || 0));
      
      const endTime = performance.now();
      const detectionTime = endTime - startTime;

      setDetectionResult({
        gesture: result.gesture,
        confidence: result.confidence,
        detectionTime,
        fps: 1000 / detectionTime,
      });

      // Record sign if recording is active and confidence is high enough
      if (isRecording && result.gesture && result.confidence > 0.7) {
        setRecordedSigns(prev => {
          // Only add if it's different from the last sign to avoid duplicates
          if (prev.length === 0 || prev[prev.length - 1] !== result.gesture) {
            return [...prev, result.gesture];
          }
          return prev;
        });
      }

      // Only send detection result to conversation component if:
      // 1. Confidence is very high (above 0.8)
      // 2. The gesture is different from the last detected one
      // 3. We're not detecting too frequently (limit updates)
      const currentTime = Date.now();
      const timeSinceLastDetection = currentTime - lastDetectionTimeRef.current;
      
      // Only add to conversation if confidence is high enough AND 
      // either it's a new gesture OR enough time has passed (3 seconds)
      if (result.confidence > 0.8 && 
          conversationRef.current && 
          (result.gesture !== lastDetectedGestureRef.current || timeSinceLastDetection > 3000)) {
        
        conversationRef.current.handleSignDetection(result.gesture, result.confidence);
        lastDetectedGestureRef.current = result.gesture;
        lastDetectionTimeRef.current = currentTime;
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    } finally {
      setSystemStatus(prev => ({ ...prev, processing: 'idle' }));
      isProcessingRef.current = false;
    }
  }, [isRecording]);

  const handleStartDetection = useCallback(async () => {
    try {
      if (systemStatus.model !== 'ready') {
        setSystemStatus(prev => ({ ...prev, model: 'loading' }));
        await signLanguageModel.loadModel();
        setSystemStatus(prev => ({ ...prev, model: 'ready' }));
      }
      setIsDetecting(true);
      setSystemStatus(prev => ({ ...prev, camera: 'ready' }));
    } catch (error) {
      console.error('Failed to start detection:', error);
      setSystemStatus(prev => ({ ...prev, model: 'error' }));
    }
  }, [systemStatus.model]);

  const handleStopDetection = useCallback(() => {
    setIsDetecting(false);
  }, []);

  const handleStartRecording = () => {
    // Start video recording
    startVideoRecording();
    
    setIsRecording(true);
    setRecordedSigns([]);
    setRecordingStartTime(Date.now());
    setRecordingDuration(0);
    setShowSaveDialog(false);
  };

  // Start video recording from webcam
  const startVideoRecording = () => {
    try {
      // Get the active webcam stream that's already being used
      const videoStream = document.querySelector('video')?.srcObject as MediaStream;
      
      if (!videoStream) {
        console.error('No active webcam stream found');
        toast({
          title: "Recording Error",
          description: "No camera stream available. Please ensure your camera is enabled.",
          variant: "destructive",
        });
        return;
      }
      
      // Save the stream reference
      videoStreamRef.current = videoStream;
      
      // Try to use a widely supported MIME type
      let mimeType = 'video/webm';
      const supportedTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ];
      
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log(`Using MIME type: ${mimeType}`);
          break;
        }
      }
      
      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(videoStream, { 
        mimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      });
      
      // Clear any previous recorded chunks
      recordedChunksRef.current = [];
      
      // Add event listeners
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      
      console.log('Video recording started');
    } catch (error) {
      console.error('Error starting video recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start video recording. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Stop video recording and process the video
  const stopVideoRecording = () => {
    if (!mediaRecorderRef.current) {
      console.warn('No active media recorder found');
      return null;
    }
    
    return new Promise<Blob>((resolve, reject) => {
      try {
        mediaRecorderRef.current!.onstop = () => {
          // Create a single Blob from all chunks
          const videoBlob = new Blob(recordedChunksRef.current, { 
            type: 'video/webm' 
          });
          
          // Create a URL for the blob
          const url = URL.createObjectURL(videoBlob);
          setVideoBlob(videoBlob);
          setVideoUrl(url);
          
          console.log(`Video recording stopped, size: ${(videoBlob.size / (1024 * 1024)).toFixed(2)} MB`);
          
          // Resolve with the blob
          resolve(videoBlob);
        };
        
        // Stop recording
        mediaRecorderRef.current!.stop();
      } catch (error) {
        console.error('Error stopping video recording:', error);
        reject(error);
      }
    });
  };

  // Format time for recording display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    console.log("Recording stopped, creating save dialog");
    
    try {
      // Stop video recording and get the recorded blob
      const videoBlob = await stopVideoRecording();
      
      // Create a recording object that matches the format used in the recordings page
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Calculate size based on video size
      const dataSize = videoBlob ? videoBlob.size / 1024 : 0; // KB
      const formattedSize = dataSize > 1024 ? `${(dataSize / 1024).toFixed(1)} MB` : `${dataSize.toFixed(1)} KB`;
      
      // Create the recording object
      const recordingData = {
        id: Date.now(), // Unique ID based on timestamp
        title: `Sign Detection Session ${today.toLocaleDateString()}`,
        date: dateStr,
        time: timeStr,
        duration: formatTime(recordingDuration),
        size: formattedSize,
        category: "Sign Detection",
        thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        videoUrl: videoUrl || "",
        signs: recordedSigns.length > 0 ? recordedSigns : ['No signs detected'], // Store detected signs or placeholder
        timestamp: today.toISOString()
      };
      
      // Set the recording to save and show dialog
      setRecordingToSave(recordingData);
      setShowSaveDialog(true);
      console.log("Save dialog should be visible now", {showSaveDialog: true, recordingData});
      
    } catch (error) {
      console.error('Failed to prepare recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to process the recorded video. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveRecording = () => {
    if (recordingToSave && videoBlob) {
      try {
        console.log("Saving recording with video...");
        
        // Update title if custom name provided
        if (recordingName.trim()) {
          recordingToSave.title = recordingName.trim();
        }
        
        // Show saving status
        toast({
          title: "Saving Recording",
          description: "Please wait while we save your recording...",
        });
        
        // Convert video blob to data URL
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          
          // Store video data separately to avoid localStorage size limits
          const videoKey = `video_${recordingToSave.id}`;
          localStorage.setItem(videoKey, base64data);
          
          // Load existing recordings
          let existingRecordings = [];
          try {
            const storedRecordings = localStorage.getItem('userRecordings');
            existingRecordings = storedRecordings ? JSON.parse(storedRecordings) : [];
            
            // Validate that we got an array
            if (!Array.isArray(existingRecordings)) {
              console.warn('Stored recordings was not an array, resetting');
              existingRecordings = [];
            }
          } catch (parseError) {
            console.error('Failed to parse existing recordings:', parseError);
            existingRecordings = [];
          }
          
          // Add new recording to the list
          existingRecordings.push(recordingToSave);
          
          // Save back to localStorage
          localStorage.setItem('userRecordings', JSON.stringify(existingRecordings));
          
          // Confirm the save with a console message
          console.log(`Successfully saved recording with ${recordedSigns.length} signs and video to storage`);
          
          // Show success message
          toast({
            title: "Recording Saved",
            description: "Your recording has been saved successfully!",
            variant: "default",
          });
          
          // Clean up
          if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
            setVideoUrl(null);
          }
          setVideoBlob(null);
          
          // Reset state
          setShowSaveDialog(false);
          setRecordingName('');
          setRecordedSigns([]);
          
          // Navigate to the recordings page with a small delay to allow toast to be seen
          setTimeout(() => {
            router.push('/recordings?newRecording=true&id=' + recordingToSave.id);
          }, 1000);
        };
        
      } catch (error) {
        console.error('Failed to save recording:', error);
        
        // Show error but keep dialog open
        toast({
          title: "Error",
          description: "Failed to save recording. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.error('No recording data or video to save');
      toast({
        title: "Error",
        description: "No video data available to save.",
        variant: "destructive",
      });
    }
  };
  
  const handleDiscardRecording = () => {
    console.log("Discarding recording...");
    
    // Confirm before discarding if there are signs recorded
    if (recordedSigns.length > 3) {
      if (!confirm(`Are you sure you want to discard this recording with ${recordedSigns.length} signs?`)) {
        return; // User cancelled the discard operation
      }
    }
    
    // Clean up video resources
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    setVideoBlob(null);
    
    // Reset recording state
    setRecordedSigns([]);
    setShowSaveDialog(false);
    setRecordingName('');
    setRecordingToSave(null);
    
    console.log("Recording discarded");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <WelcomeBanner />

      {/* Save Dialog - Standalone component that appears regardless of recorded signs */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full bg-white shadow-xl animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center gap-3 text-white">
              <Save className="h-5 w-5" />
              <h3 className="text-lg font-medium">Save Your Recording</h3>
            </div>
            <div className="p-6">
              {/* Video Preview */}
              {videoUrl && (
                <div className="mb-6 overflow-hidden rounded-lg border-2 border-blue-100 bg-black">
                  <video 
                    ref={videoPreviewRef}
                    src={videoUrl} 
                    className="w-full h-48 object-cover"
                    controls
                    autoPlay={false}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm text-blue-700 mb-1 font-medium">Recording Name</label>
                <input 
                  type="text"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  placeholder={recordingToSave?.title || "Sign Detection Session"}
                  className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="mb-4 bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Signs detected:</span> {recordedSigns.length}
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  <span className="font-medium">Duration:</span> {formatTime(recordingDuration)}
                </p>
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
                </p>
                {videoBlob && (
                  <p className="text-sm text-blue-700 mt-2">
                    <span className="font-medium">Video size:</span> {(videoBlob.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>
              <div className="flex justify-between gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                  onClick={handleDiscardRecording}
                >
                  Discard
                </Button>
                <Button 
                  variant="default" 
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={handleSaveRecording}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save & View Recordings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Container */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5" />
                <h3 className="text-lg font-medium">Live Camera Feed</h3>
              </div>
              
              {/* Recording controls */}
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Circle className="h-3 w-3 text-red-500 animate-pulse" />
                      <span className="text-sm font-medium">{recordingDuration}s</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold shadow-md px-4 py-2"
                      onClick={handleStopRecording}
                    >
                      <StopCircle className="h-4 w-4" />
                      STOP RECORDING
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold shadow-md flex items-center gap-1 px-4 py-2"
                    onClick={handleStartRecording}
                  >
                    <Circle className="h-4 w-4 text-white animate-pulse" />
                    START RECORDING
                  </Button>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-6 bg-gradient-to-b from-blue-50/50 to-white">
              <WebcamFeed
                onFrameCapture={handleFrameCapture}
                isDetecting={isDetecting}
                onStartDetection={handleStartDetection}
                onStopDetection={handleStopDetection}
              />
            </div>
          </Card>

          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center gap-3 text-white">
              <HandMetal className="h-5 w-5" />
              <h3 className="text-lg font-medium">Real-Time Detection Dashboard</h3>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md">
                  <div className="p-3 border-b border-white/20 flex items-center gap-2">
                    <HandMetal className="h-4 w-4" />
                    <h4 className="font-medium">Current Sign</h4>
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-semibold text-center mb-4">
                      {detectionResult.gesture || 'Waiting for detection...'}
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${detectionResult.confidence * 100}%` }}
                        />
                      </div>
                      <div className="text-sm text-center">
                        Confidence: {(detectionResult.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="shadow-md border border-blue-100">
                  <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-3 border-b flex items-center gap-2 text-white">
                    <Activity className="h-4 w-4" />
                    <h4 className="font-medium">Performance Metrics</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-blue-700">Detection Time</span>
                      <span className="font-medium text-blue-900">{detectionResult.detectionTime.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-blue-700">Accuracy</span>
                      <span className="font-medium text-blue-900">{(detectionResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-blue-700">FPS</span>
                      <span className="font-medium text-blue-900">{detectionResult.fps.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-blue-100 mt-1">
                      <span className="text-blue-700">Method</span>
                      <Badge className="bg-blue-500 hover:bg-blue-600">MediaPipe</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="shadow-md border border-blue-100">
                  <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-3 border-b flex items-center gap-2 text-white">
                    <Settings className="h-4 w-4" />
                    <h4 className="font-medium">System Status</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-blue-700">Camera</span>
                      <Badge variant={systemStatus.camera === 'ready' ? 'default' : systemStatus.camera === 'error' ? 'destructive' : 'outline'} 
                         className={systemStatus.camera === 'ready' ? 'bg-blue-500 text-white' : ''}>
                        {systemStatus.camera}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-blue-700">Model</span>
                      <Badge variant={systemStatus.model === 'ready' ? 'default' : systemStatus.model === 'error' ? 'destructive' : 'outline'}
                         className={systemStatus.model === 'ready' ? 'bg-blue-500 text-white' : ''}>
                        {systemStatus.model}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-blue-700">Processing</span>
                      <Badge variant={systemStatus.processing === 'active' ? 'default' : 'outline'} className={systemStatus.processing === 'active' ? 'bg-blue-500 hover:bg-blue-600' : ''}>
                        {systemStatus.processing}
                      </Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-100">
                      <h3 className="text-sm font-medium mb-2 text-blue-700">System Controls</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Video className="h-3 w-3 mr-1" />
                          Reset Camera
                        </Button>
                        <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Debug Info Card */}
                <Card className="shadow-md border border-blue-100">
                  <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-3 border-b flex items-center gap-2 text-white">
                    <Activity className="h-4 w-4" />
                    <h4 className="font-medium">Debug Info</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-blue-700">Hand Detected</span>
                      <Badge 
                        variant={handDetected ? 'default' : 'destructive'}
                        className={handDetected ? 'bg-blue-500 text-white' : ''}
                      >
                        {handDetected ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-blue-700">Hand Confidence</span>
                      <span className="font-medium text-blue-900">{(detectionResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-blue-100">
                      <span className="text-blue-700">Landmarks</span>
                      <span className="font-medium text-blue-900">{landmarks}</span>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-sm font-medium mb-2 text-blue-700">Log Events</h3>
                      <div className="bg-blue-50 p-2 rounded-md font-mono text-xs h-24 overflow-y-auto">
                        <div className="text-green-600">[INFO] Model loaded successfully</div>
                        <div className="text-blue-600">[DEBUG] Camera {systemStatus.camera}</div>
                        <div className="text-blue-600">[DEBUG] MediaPipe Hands model initialized</div>
                        {detectionResult.confidence < 0.5 && (
                          <div className="text-orange-500">[WARN] Low detection confidence: {(detectionResult.confidence * 100).toFixed(1)}%</div>
                        )}
                        <div className="text-blue-600">[DEBUG] Processing at {detectionResult.fps.toFixed(1)}fps</div>
                        {landmarks > 0 && (
                          <div className="text-blue-600">[DEBUG] {landmarks} landmarks detected</div>
                        )}
                        {isRecording && (
                          <div className="text-red-500">[INFO] Recording active: {recordingDuration}s, {recordedSigns.length} signs</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
          
          {/* Recorded Signs Card - Only show when there are recorded signs */}
          {recordedSigns.length > 0 && (
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Save className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Recorded Signs</h3>
                </div>
                <div className="text-sm bg-white/20 px-2 py-1 rounded">
                  {recordedSigns.length} signs | {recordingDuration}s
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {recordedSigns.map((sign, index) => (
                    <div key={index} className="bg-blue-50 p-2 rounded border border-blue-100 text-center">
                      <span className="text-blue-800 font-medium">{sign}</span>
                    </div>
                  ))}
                </div>
                {isRecording ? (
                  <div className="mt-4 text-center text-sm text-blue-600">
                    Recording in progress...
                  </div>
                ) : (
                  <div className="mt-4 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={() => router.push('/recordings')}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      View Recordings
                    </Button>
                    {recordedSigns.length > 0 && (
                      <Button 
                        variant="default" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowSaveDialog(true)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Session
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}
          
          {/* Analytics Dashboard */}
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center gap-3 text-white">
              <BarChart2 className="h-5 w-5" />
              <h3 className="text-lg font-medium">Analytics Dashboard</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-800">Detection Statistics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-blue-600">Success Rate</span>
                        <span className="text-sm text-blue-600">85%</span>
                      </div>
                      <Progress value={85} className="h-2 bg-blue-100" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-blue-600">Average Confidence</span>
                        <span className="text-sm text-blue-600">78%</span>
                      </div>
                      <Progress value={78} className="h-2 bg-blue-100" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-blue-600">Detection Speed</span>
                        <span className="text-sm text-blue-600">92%</span>
                      </div>
                      <Progress value={92} className="h-2 bg-blue-100" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-800">Top Detected Signs</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded-md flex justify-between items-center">
                      <span className="text-blue-700">Hello</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-600">124 times</Badge>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-md flex justify-between items-center">
                      <span className="text-blue-700">Thank you</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-600">98 times</Badge>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-md flex justify-between items-center">
                      <span className="text-blue-700">Yes</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-600">87 times</Badge>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-md flex justify-between items-center">
                      <span className="text-blue-700">No</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-600">76 times</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Interaction Panel */}
        <div className="space-y-8">
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center gap-3 text-white">
              <Mic className="h-5 w-5" />
              <h3 className="text-lg font-medium">Audio to Sign</h3>
            </div>
            <div className="p-4">
              <AudioToSign />
            </div>
          </Card>

          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center gap-3 text-white">
              <Send className="h-5 w-5" />
              <h3 className="text-lg font-medium">Conversation</h3>
            </div>
            <div className="p-4">
              <Conversation ref={conversationRef} />
            </div>
          </Card>

          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center gap-3 text-white">
              <Languages className="h-5 w-5" />
              <h3 className="text-lg font-medium">Text to Sign</h3>
            </div>
            <div className="p-4">
              <TextToSign />
            </div>
          </Card>

          {/* Quick Tools Section */}
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 border-b flex items-center gap-3 text-white">
              <Layers className="h-5 w-5" />
              <h3 className="text-lg font-medium">Quick Tools</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <Link href="/dictionary">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>Dictionary</span>
                </Button>
              </Link>
              <Link href="/translate">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span>Translate</span>
                </Button>
              </Link>
              <Link href="/recordings">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Recordings</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Feature Card */}
          <Card className="bg-gradient-to-r from-blue-800 to-blue-900 text-white overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
            <div className="p-6 relative z-10">
              <h3 className="text-xl font-bold mb-2">Try Our New Features</h3>
              <p className="mb-4 opacity-90">
                Explore all the capabilities of our Sign Language Analysis Tool.
              </p>
              <Button className="bg-white text-blue-700 hover:bg-gray-100 shadow-md">
                <Layers className="h-4 w-4 mr-2" />
                View All Features
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

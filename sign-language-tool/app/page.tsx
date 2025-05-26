'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from "next/link"
import { Activity, BarChart2, Bell, Book, HandMetal, Languages, Layers, Mic, Send, Settings, User, Video, AlertCircle, RefreshCw } from "lucide-react"
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

interface DetectionResult {
  gesture: string;
  confidence: number;
  detectionTime: number;
  fps: number;
}

export default function HomePage() {
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

      // Send detection result to conversation component if confidence is high enough
      if (result.confidence > 0.7 && conversationRef.current) {
        conversationRef.current.handleSignDetection(result.gesture, result.confidence);
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    } finally {
      setSystemStatus(prev => ({ ...prev, processing: 'idle' }));
      isProcessingRef.current = false;
    }
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <WelcomeBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Container */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center gap-3 text-white">
              <Video className="h-5 w-5" />
              <h3 className="text-lg font-medium">Live Camera Feed</h3>
            </div>
            <div className="p-4 sm:p-6 bg-gradient-to-b from-indigo-50/50 to-white">
              <WebcamFeed
                onFrameCapture={handleFrameCapture}
                isDetecting={isDetecting}
                onStartDetection={handleStartDetection}
                onStopDetection={handleStopDetection}
              />
            </div>
          </Card>

          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 border-b flex items-center gap-3 text-white">
              <HandMetal className="h-5 w-5" />
              <h3 className="text-lg font-medium">Real-Time Detection Dashboard</h3>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-md">
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

                <Card className="shadow-md border border-indigo-100">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 border-b flex items-center gap-2 text-white">
                    <Activity className="h-4 w-4" />
                    <h4 className="font-medium">Performance Metrics</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between py-1 border-b border-indigo-100">
                      <span className="text-indigo-700">Detection Time</span>
                      <span className="font-medium text-indigo-900">{detectionResult.detectionTime.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-indigo-100">
                      <span className="text-indigo-700">Accuracy</span>
                      <span className="font-medium text-indigo-900">{(detectionResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-indigo-700">FPS</span>
                      <span className="font-medium text-indigo-900">{detectionResult.fps.toFixed(1)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="shadow-md border border-indigo-100">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 border-b flex items-center gap-2 text-white">
                    <Settings className="h-4 w-4" />
                    <h4 className="font-medium">System Status</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between py-1 border-b border-indigo-100">
                      <span className="text-indigo-700">Camera</span>
                      <Badge variant={systemStatus.camera === 'ready' ? 'default' : systemStatus.camera === 'error' ? 'destructive' : 'outline'} 
                         className={systemStatus.camera === 'ready' ? 'bg-green-500 text-white' : ''}>
                        {systemStatus.camera}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-1 border-b border-indigo-100">
                      <span className="text-indigo-700">Model</span>
                      <Badge variant={systemStatus.model === 'ready' ? 'default' : systemStatus.model === 'error' ? 'destructive' : 'outline'}
                         className={systemStatus.model === 'ready' ? 'bg-green-500 text-white' : ''}>
                        {systemStatus.model}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-indigo-700">Processing</span>
                      <Badge variant={systemStatus.processing === 'active' ? 'default' : 'outline'} className={systemStatus.processing === 'active' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}>
                        {systemStatus.processing}
                      </Badge>
                    </div>
                  </div>
                </Card>
                
                {/* Debug Info Card */}
                <Card className="shadow-md border border-indigo-100">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 border-b flex items-center gap-2 text-white">
                    <Activity className="h-4 w-4" />
                    <h4 className="font-medium">Debug Info</h4>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between py-1 border-b border-indigo-100">
                      <span className="text-indigo-700">Hand Detected</span>
                      <Badge 
                        variant={handDetected ? 'default' : 'destructive'}
                        className={handDetected ? 'bg-green-500 text-white' : ''}
                      >
                        {handDetected ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-indigo-100">
                      <span className="text-indigo-700">Hand Confidence</span>
                      <span className="font-medium text-indigo-900">{(detectionResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-indigo-100">
                      <span className="text-indigo-700">Landmarks</span>
                      <span className="font-medium text-indigo-900">{landmarks}</span>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-sm font-medium mb-2 text-indigo-700">Log Events</h3>
                      <div className="bg-indigo-50 p-2 rounded-md font-mono text-xs h-24 overflow-y-auto">
                        <div className="text-green-600">[INFO] Model loaded successfully</div>
                        <div className="text-indigo-600">[DEBUG] Camera {systemStatus.camera}</div>
                        <div className="text-indigo-600">[DEBUG] MediaPipe Hands model initialized</div>
                        {detectionResult.confidence < 0.5 && (
                          <div className="text-orange-500">[WARN] Low detection confidence: {(detectionResult.confidence * 100).toFixed(1)}%</div>
                        )}
                        <div className="text-indigo-600">[DEBUG] Processing at {detectionResult.fps.toFixed(1)}fps</div>
                        {landmarks > 0 && (
                          <div className="text-indigo-600">[DEBUG] {landmarks} landmarks detected</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>

        {/* Interaction Panel */}
        <div className="space-y-8">
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 border-b flex items-center gap-3 text-white">
              <Mic className="h-5 w-5" />
              <h3 className="text-lg font-medium">Audio to Sign</h3>
            </div>
            <div className="p-4">
              <AudioToSign />
            </div>
          </Card>

          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 border-b flex items-center gap-3 text-white">
              <Send className="h-5 w-5" />
              <h3 className="text-lg font-medium">Conversation</h3>
            </div>
            <div className="p-4">
              <Conversation ref={conversationRef} />
            </div>
          </Card>

          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 border-b flex items-center gap-3 text-white">
              <Languages className="h-5 w-5" />
              <h3 className="text-lg font-medium">Text to Sign</h3>
            </div>
            <div className="p-4">
              <TextToSign />
            </div>
          </Card>

          {/* Quick Tools Section */}
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 border-b flex items-center gap-3 text-white">
              <Layers className="h-5 w-5" />
              <h3 className="text-lg font-medium">Quick Tools</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <Link href="/dictionary">
                <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center gap-2">
                  <Book className="h-4 w-4" />
                  <span>Dictionary</span>
                </Button>
              </Link>
              <Link href="/translate">
                <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span>Translate</span>
                </Button>
              </Link>
              <Link href="/recordings">
                <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center gap-2">
                  <Video className="h-4 w-4" />
                  <span>Recordings</span>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="w-full border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Feature Card */}
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
            <div className="p-6 relative z-10">
              <h3 className="text-xl font-bold mb-2">Try Our New Features</h3>
              <p className="mb-4 opacity-90">
                Explore all the capabilities of our Sign Language Analysis Tool.
              </p>
              <Button className="bg-white text-indigo-700 hover:bg-gray-100 shadow-md">
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

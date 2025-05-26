'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, HandMetal, Activity, RefreshCw, AlertCircle, Camera, Database, BarChart2 } from "lucide-react";

export default function RealTimeDetectionDashboard() {
  const [mounted, setMounted] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("initializing");
  const [modelStatus, setModelStatus] = useState("ready");
  const [processingStatus, setProcessingStatus] = useState("idle");
  const [handDetected, setHandDetected] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [detectionTime, setDetectionTime] = useState(0);
  const [fps, setFps] = useState(0);
  const [currentSign, setCurrentSign] = useState("");
  const [landmarks, setLandmarks] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // This would be replaced with actual camera initialization code
    const timer = setTimeout(() => {
      setCameraStatus("active");
      setProcessingStatus("active");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // This function would normally start the webcam
  const startWebcam = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        videoRef.current.srcObject = stream;
        setCameraStatus("active");
        setProcessingStatus("active");
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setCameraStatus("error");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
      <div className="container mx-auto p-6">
        <header className="flex items-center mb-6 text-white">
          <HandMetal className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-bold">Real-Time Detection Dashboard</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Sign Detection */}
          <Card className="bg-blue-600/20 backdrop-blur-sm border-blue-500/30 text-white shadow-xl">
            <CardHeader className="bg-blue-700 border-b border-blue-600">
              <CardTitle className="flex items-center">
                <HandMetal className="h-6 w-6 mr-2" />
                Current Sign
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 min-h-[300px]">
              {currentSign ? (
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">{currentSign}</h2>
                  <div className="w-full max-w-md">
                    <Progress value={confidence} className="h-2 bg-blue-800/50" />
                  </div>
                  <p className="mt-2 text-blue-200">Confidence: {confidence.toFixed(1)}%</p>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-blue-300 mb-4">Waiting for detection...</h2>
                  <div className="w-full max-w-md">
                    <Progress value={0} className="h-2 bg-blue-800/50" />
                  </div>
                  <p className="mt-2 text-blue-300">Confidence: 0.0%</p>
                </div>
              )}
              
              <div className="mt-6 relative w-full max-w-md">
                <div className="relative aspect-video overflow-hidden rounded-md bg-black">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  <canvas 
                    ref={canvasRef} 
                    className="absolute top-0 left-0 w-full h-full"
                  />
                  {cameraStatus === "initializing" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-400" />
                        <p className="text-sm text-blue-200">Initializing camera...</p>
                      </div>
                    </div>
                  )}
                  {cameraStatus === "error" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                        <p className="text-sm text-red-200">Camera error</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 text-white border-white/30 hover:bg-white/10"
                          onClick={startWebcam}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Performance Metrics */}
          <Card className="bg-blue-600/20 backdrop-blur-sm border-blue-500/30 text-white shadow-xl">
            <CardHeader className="bg-blue-700 border-b border-blue-600">
              <CardTitle className="flex items-center">
                <Activity className="h-6 w-6 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-blue-600/50 pb-3">
                  <span className="text-blue-200">Detection Time</span>
                  <span className="font-mono">{detectionTime.toFixed(1)}ms</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-blue-600/50 pb-3">
                  <span className="text-blue-200">Accuracy</span>
                  <span className="font-mono">{confidence.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-blue-600/50 pb-3">
                  <span className="text-blue-200">FPS</span>
                  <span className="font-mono">{fps.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Method</span>
                  <Badge className="bg-green-500 hover:bg-green-600">MediaPipe</Badge>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 text-blue-100">Detection History</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-700/50 rounded-md flex justify-between">
                      <span>Hello</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">98%</Badge>
                    </div>
                    <div className="p-2 bg-blue-700/50 rounded-md flex justify-between">
                      <span>Thank you</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">95%</Badge>
                    </div>
                    <div className="p-2 bg-blue-700/50 rounded-md flex justify-between">
                      <span>Yes</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">92%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* System Status */}
          <Card className="bg-blue-600/20 backdrop-blur-sm border-blue-500/30 text-white shadow-xl">
            <CardHeader className="bg-blue-700 border-b border-blue-600">
              <CardTitle className="flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-blue-600/50 pb-3">
                  <span className="text-blue-200">Camera</span>
                  <Badge 
                    className={cameraStatus === "active" 
                      ? "bg-green-500 hover:bg-green-600" 
                      : cameraStatus === "error" 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {cameraStatus}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center border-b border-blue-600/50 pb-3">
                  <span className="text-blue-200">Model</span>
                  <Badge 
                    className={modelStatus === "ready" 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {modelStatus}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Processing</span>
                  <Badge 
                    className={processingStatus === "active" 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-gray-500 hover:bg-gray-600"
                    }
                  >
                    {processingStatus}
                  </Badge>
                </div>
                
                <div className="mt-6 pt-4 border-t border-blue-600/50">
                  <h3 className="text-lg font-medium mb-4 text-blue-100">System Controls</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-700/50">
                      <Camera className="h-4 w-4 mr-2" />
                      Reset Camera
                    </Button>
                    <Button variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-700/50">
                      <Database className="h-4 w-4 mr-2" />
                      Load Model
                    </Button>
                    <Button variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-700/50">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Debug Info */}
          <Card className="bg-blue-600/20 backdrop-blur-sm border-blue-500/30 text-white shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 border-b border-orange-600">
              <CardTitle className="flex items-center">
                <Activity className="h-6 w-6 mr-2" />
                Debug Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-blue-600/50 pb-3">
                  <span className="text-blue-200">Hand Detected</span>
                  <Badge 
                    className={handDetected 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-red-500 hover:bg-red-600"
                    }
                  >
                    {handDetected ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center border-b border-blue-600/50 pb-3">
                  <span className="text-blue-200">Hand Confidence</span>
                  <span className="font-mono">{confidence.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Landmarks</span>
                  <span className="font-mono">{landmarks}</span>
                </div>
                
                <div className="mt-6 pt-4 border-t border-blue-600/50">
                  <h3 className="text-lg font-medium mb-4 text-blue-100">Log Events</h3>
                  <div className="bg-blue-900/50 p-3 rounded-md font-mono text-xs h-32 overflow-y-auto">
                    <div className="text-green-300">[INFO] Model loaded successfully</div>
                    <div className="text-blue-300">[DEBUG] Camera initialized at 640x480</div>
                    <div className="text-blue-300">[DEBUG] MediaPipe Hands model initialized</div>
                    <div className="text-yellow-300">[WARN] Low detection confidence: 45%</div>
                    <div className="text-blue-300">[DEBUG] Processing at 25fps</div>
                    <div className="text-blue-300">[DEBUG] 21 landmarks detected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Additional Controls and Statistics */}
        <div className="mt-6">
          <Card className="bg-blue-600/20 backdrop-blur-sm border-blue-500/30 text-white shadow-xl">
            <CardHeader className="bg-blue-700 border-b border-blue-600">
              <CardTitle className="flex items-center">
                <BarChart2 className="h-6 w-6 mr-2" />
                Analytics Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-100">Detection Statistics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-blue-200">Success Rate</span>
                        <span className="text-sm text-blue-200">85%</span>
                      </div>
                      <Progress value={85} className="h-2 bg-blue-800/50" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-blue-200">Average Confidence</span>
                        <span className="text-sm text-blue-200">78%</span>
                      </div>
                      <Progress value={78} className="h-2 bg-blue-800/50" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-blue-200">Detection Speed</span>
                        <span className="text-sm text-blue-200">92%</span>
                      </div>
                      <Progress value={92} className="h-2 bg-blue-800/50" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 text-blue-100">Top Detected Signs</h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-700/50 rounded-md flex justify-between">
                      <span>Hello</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">124 times</Badge>
                    </div>
                    <div className="p-2 bg-blue-700/50 rounded-md flex justify-between">
                      <span>Thank you</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">98 times</Badge>
                    </div>
                    <div className="p-2 bg-blue-700/50 rounded-md flex justify-between">
                      <span>Yes</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">87 times</Badge>
                    </div>
                    <div className="p-2 bg-blue-700/50 rounded-md flex justify-between">
                      <span>No</span>
                      <Badge variant="outline" className="border-blue-400 text-blue-200">76 times</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

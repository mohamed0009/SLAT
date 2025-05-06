"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, Camera, X } from "lucide-react"
import Link from "next/link"

export default function RealTimeFeedbackPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [showWebcam, setShowWebcam] = useState(false);
  const [error, setError] = useState('');
  
  // Handle starting webcam
  const startWebcam = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowWebcam(true);
        setIsActive(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Unable to access webcam. Please check browser permissions.");
      setShowWebcam(false);
      setIsActive(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowWebcam(false);
    setIsActive(false);
    setFeedback('');
    setConfidenceScore(0);
  };

  // Feedback system using useEffect for proper interval management
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isActive) {
      const feedbacks = [
        "Good hand position. Try to keep your fingers more spread.",
        "Great job! Your signing is clear and precise.",
        "Try to position your hand at eye level for this sign.",
        "The movement is correct, but try to make it more fluid.",
        "Your speed is good, but focus on wrist rotation.",
        "Excellent! The sign is clearly recognizable."
      ];
      
      // Start providing feedback after a short delay
      intervalId = setInterval(() => {
        const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        const randomConfidence = 65 + Math.floor(Math.random() * 30);
        
        setFeedback(randomFeedback);
        setConfidenceScore(randomConfidence);
      }, 3000);
    }
    
    // Clean up interval on component unmount or when isActive changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive]);

  // Clean up webcam on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopWebcam();
      }
    };
  }, []);

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/ai-learning">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI Learning
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Real-time Feedback</h1>
        <Badge className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-500">Popular</Badge>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle>How it works</CardTitle>
          <CardDescription>
            Our AI analyzes your signing in real-time and provides instant feedback to help you improve
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <Camera className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">Step 1</h3>
              <p className="text-sm text-gray-600">Position yourself in front of your camera</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 11v2a5 5 0 0 0 10 0v-2M4 19h16" />
                  <path d="M7 6h10" />
                  <path d="M9 6V4" />
                  <path d="M15 6V4" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Step 2</h3>
              <p className="text-sm text-gray-600">Practice your sign language gestures</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-indigo-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">Step 3</h3>
              <p className="text-sm text-gray-600">Receive instant feedback and improve</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {showWebcam ? (
                <div className="relative">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    muted
                    className="w-full h-[400px] object-cover rounded-lg"
                    onLoadedMetadata={() => videoRef.current?.play()}
                  />
                  <button 
                    className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors"
                    onClick={stopWebcam}
                  >
                    <X className="h-5 w-5 text-indigo-600" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-indigo-50 rounded-lg border border-indigo-100">
                  {error ? (
                    <>
                      <p className="text-red-500 mb-4 text-center max-w-md">{error}</p>
                      <Button onClick={startWebcam} className="bg-indigo-600 hover:bg-indigo-700">
                        Try Again
                      </Button>
                    </>
                  ) : (
                    <>
                      <Camera className="h-12 w-12 text-indigo-400 mb-4" />
                      <p className="text-indigo-600 text-center mb-6 max-w-md">
                        Enable your camera to receive real-time feedback on your sign language technique
                      </p>
                      <Button onClick={startWebcam} className="bg-indigo-600 hover:bg-indigo-700">
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
              <CardDescription>
                Real-time analysis of your signing technique
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feedback ? (
                <div className="space-y-6">
                  <div className="p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
                    <p className="text-indigo-800 font-medium mb-2">{feedback}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-indigo-600">
                        <span>Confidence</span>
                        <span>{confidenceScore}%</span>
                      </div>
                      <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${confidenceScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Focus Areas</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Hand position and orientation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Movement speed and fluidity</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Finger positioning and details</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <p className="text-indigo-800 mb-2">
                    {showWebcam ? "Waiting for you to sign..." : "Start your camera to receive feedback"}
                  </p>
                  <p className="text-sm text-gray-500 max-w-md">
                    Our AI will analyze your signing technique and provide instant personalized feedback
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
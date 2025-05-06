"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, Video, UploadCloud, X, RefreshCw, Info } from "lucide-react"
import Link from "next/link"

export default function VideoAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check if the file is a video
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file.');
        return;
      }
      
      // Check file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size too large. Maximum allowed is 100MB.');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Simulate video analysis process
  const analyzeVideo = () => {
    if (!file) return;
    
    setAnalyzing(true);
    setProgress(0);
    setAnalysis([]);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          
          // Sample analysis results
          setAnalysis([
            "Sign identified: 'Hello' - 92% confidence",
            "Hand position correct, good palm orientation",
            "Movement slightly fast - try a more deliberate motion",
            "Facial expression could be more engaged",
            "Overall sign clarity: Good (86%)",
            "Recommendation: Practice with slightly slower movements"
          ]);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  // Reset analysis
  const resetAnalysis = () => {
    setFile(null);
    setAnalysis([]);
    setProgress(0);
    setError('');
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/ai-learning">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI Learning
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Video Analysis</h1>
        <Badge className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-500">New</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle>How Video Analysis Works</CardTitle>
            <CardDescription>
              Upload a video of your signing to receive detailed AI feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <UploadCloud className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Upload</h3>
                  <p className="text-sm text-gray-600">Record yourself signing and upload the video</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Process</h3>
                  <p className="text-sm text-gray-600">Our AI analyzes your signing technique frame by frame</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Review</h3>
                  <p className="text-sm text-gray-600">Get detailed feedback and improvement suggestions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle>Benefits</CardTitle>
            <CardDescription>
              Why video analysis improves your sign language skills
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-indigo-800">Frame-by-frame breakdown</h3>
                  <p className="text-sm text-gray-600">Our AI examines each frame of your video to provide detailed analysis of your technique</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-indigo-800">Side-by-side comparisons</h3>
                  <p className="text-sm text-gray-600">See how your signing compares to the correct form and technique</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-indigo-800">Shareable progress reports</h3>
                  <p className="text-sm text-gray-600">Save and share your progress with teachers or practice partners</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle>Upload & Analyze</CardTitle>
          <CardDescription>
            Upload a video of yourself signing to receive AI-powered feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {file && !analysis.length ? (
            <div className="rounded-lg overflow-hidden border border-indigo-100">
              <div className="bg-indigo-50 p-3 text-center border-b border-indigo-100">
                <p className="text-sm font-medium text-indigo-700">
                  Ready to analyze: {file.name}
                </p>
              </div>
              <div className="p-4 flex flex-col items-center">
                <Video className="h-16 w-16 text-indigo-500 mb-4" />
                
                {analyzing ? (
                  <div className="w-full space-y-3">
                    <div className="flex justify-between text-sm text-indigo-600">
                      <span>Analyzing video...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                ) : (
                  <div className="space-y-3 w-full max-w-md">
                    <Button 
                      onClick={analyzeVideo}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      Start Analysis
                    </Button>
                    <Button 
                      onClick={resetAnalysis}
                      variant="outline"
                      className="w-full border-indigo-200"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : analysis.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-indigo-100">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-center">
                <p className="text-lg font-medium text-white">
                  Analysis Complete
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {analysis.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {index === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-indigo-600" />
                          </div>
                        )}
                      </div>
                      <p className="text-indigo-800">{item}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 mb-6">
                  <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 mb-1">Practice Tip</h3>
                    <p className="text-sm text-amber-700">
                      Try practicing in front of a mirror to get visual feedback on your hand positioning. 
                      Focus on making your movements more deliberate and smooth.
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={resetAnalysis}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Analyze Another Video
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-indigo-50 rounded-lg border border-indigo-100 p-6">
              <Video className="h-16 w-16 text-indigo-400 mb-6" />
              <p className="text-indigo-800 text-center mb-2 text-lg font-medium">
                Upload a video for analysis
              </p>
              <p className="text-sm text-indigo-600 text-center mb-8 max-w-md">
                Record yourself signing a word or phrase and upload it to receive detailed feedback
              </p>
              
              {error && (
                <div className="w-full max-w-md mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center">
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Choose Video File
                </div>
              </label>
              
              <p className="text-xs text-gray-500 mt-4">
                Supported formats: MP4, MOV, AVI, WEBM (max 100MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
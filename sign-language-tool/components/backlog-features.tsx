"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  BookOpen,
  Camera,
  Check,
  Download,
  FileText,
  HandMetal,
  Languages,
  Mic,
  Play,
  Settings,
  Share2,
  Upload,
  Users,
  Video,
  Wand2,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function BacklogFeatures() {
  const [activeTab, setActiveTab] = useState("translation")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [translationMode, setTranslationMode] = useState("text-to-sign")
  const [recognitionAccuracy, setRecognitionAccuracy] = useState(85)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [exportFormat, setExportFormat] = useState("mp4")
  const [selectedLanguage, setSelectedLanguage] = useState("asl")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Simulate loading state for demo purposes
  const handleAction = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  // Simulate upload progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 300)

      return () => clearInterval(interval)
    } else {
      setUploadProgress(0)
    }
  }, [isLoading])

  // Toggle recording state
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording simulation
      handleAction()
    }
  }

  // Handle feedback submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setFeedbackSubmitted(true)
      setTimeout(() => setFeedbackSubmitted(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Success</AlertTitle>
          <AlertDescription className="text-green-600">Operation completed successfully.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="translation" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="translation">
            <Languages className="h-4 w-4 mr-2" />
            Translation
          </TabsTrigger>
          <TabsTrigger value="recognition">
            <HandMetal className="h-4 w-4 mr-2" />
            Recognition
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <FileText className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
        </TabsList>

        {/* Translation Tab */}
        <TabsContent value="translation" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Languages className="h-5 w-5 mr-2 text-primary" />
              Sign Language Translation
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant={translationMode === "text-to-sign" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setTranslationMode("text-to-sign")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Text to Sign
                </Button>
                <Button
                  variant={translationMode === "sign-to-text" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setTranslationMode("sign-to-text")}
                >
                  <HandMetal className="h-4 w-4 mr-2" />
                  Sign to Text
                </Button>
                <Button
                  variant={translationMode === "voice-to-sign" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setTranslationMode("voice-to-sign")}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice to Sign
                </Button>
              </div>

              {translationMode === "text-to-sign" && (
                <div className="space-y-4">
                  <Textarea placeholder="Enter text to translate to sign language..." className="min-h-[100px]" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1 max-w-xs">
                      <Label>Translation Speed</Label>
                      <div className="flex items-center gap-4">
                        <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
                        <span className="text-sm">1x</span>
                      </div>
                    </div>
                    <Select defaultValue="asl" onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select sign language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asl">American Sign Language</SelectItem>
                        <SelectItem value="bsl">British Sign Language</SelectItem>
                        <SelectItem value="lsf">French Sign Language</SelectItem>
                        <SelectItem value="lsq">Quebec Sign Language</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleAction} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Translate to {selectedLanguage.toUpperCase()}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {translationMode === "sign-to-text" && (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative">
                    <Camera className="h-12 w-12 text-gray-300" />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                      <Button onClick={toggleRecording} className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}>
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md flex items-center">
                        <div className="animate-pulse h-2 w-2 bg-white rounded-full mr-2" />
                        Recording
                      </div>
                    )}
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-2">Recognized Text:</h4>
                    <p className="text-gray-600">
                      {isLoading ? "Recognizing sign language..." : "No sign language detected yet."}
                    </p>
                  </div>
                </div>
              )}

              {translationMode === "voice-to-sign" && (
                <div className="space-y-4">
                  <div className="p-6 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                    <Button
                      size="lg"
                      className={`rounded-full h-16 w-16 ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
                      onClick={toggleRecording}
                    >
                      <Mic className="h-6 w-6" />
                    </Button>
                    <p className="mt-4 text-gray-600">{isRecording ? "Listening..." : "Click to start speaking"}</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-2">Recognized Speech:</h4>
                    <p className="text-gray-600">{isLoading ? "Processing speech..." : "No speech detected yet."}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button disabled={!isLoading && !showSuccess} onClick={handleAction}>
                      <HandMetal className="h-4 w-4 mr-2" />
                      Translate to Sign Language
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Translation Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-detect" className="cursor-pointer">
                  Enable Auto-Detection
                </Label>
                <Switch id="auto-detect" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="continuous-translation" className="cursor-pointer">
                  Continuous Translation
                </Label>
                <Switch id="continuous-translation" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="save-history" className="cursor-pointer">
                  Save Translation History
                </Label>
                <Switch id="save-history" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Recognition Sensitivity</Label>
                <div className="flex items-center gap-4">
                  <Slider defaultValue={[0.7]} min={0.1} max={1} step={0.1} />
                  <span className="text-sm">0.7</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred-dialect">Preferred Dialect</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="preferred-dialect">
                    <SelectValue placeholder="Select dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="regional">Regional Variations</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="casual">Casual/Everyday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Recognition Tab */}
        <TabsContent value="recognition" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <HandMetal className="h-5 w-5 mr-2 text-primary" />
              Sign Language Recognition
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative">
                  <Camera className="h-12 w-12 text-gray-300" />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <Button onClick={toggleRecording}>{isRecording ? "Stop Recognition" : "Start Recognition"}</Button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="p-4 border rounded-lg bg-gray-50 flex-1">
                    <h4 className="font-medium mb-2">Recognition Results:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Accuracy:</span>
                        <Badge variant={recognitionAccuracy > 80 ? "default" : "outline"}>{recognitionAccuracy}%</Badge>
                      </div>
                      <Progress value={recognitionAccuracy} className="h-2" />

                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Detected Signs:</h5>
                        <ul className="space-y-2">
                          <li className="flex justify-between items-center p-2 bg-white rounded border">
                            <span>Hello</span>
                            <Badge variant="outline">95%</Badge>
                          </li>
                          <li className="flex justify-between items-center p-2 bg-white rounded border">
                            <span>Thank You</span>
                            <Badge variant="outline">87%</Badge>
                          </li>
                          <li className="flex justify-between items-center p-2 bg-white rounded border">
                            <span>Please</span>
                            <Badge variant="outline">82%</Badge>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Video className="h-4 w-4 mr-2 text-primary" />
                    Video Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Frame Rate:</span>
                      <span>30 fps</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Resolution:</span>
                      <span>720p</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Processing Time:</span>
                      <span>42ms</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <HandMetal className="h-4 w-4 mr-2 text-primary" />
                    Hand Tracking
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Landmarks:</span>
                      <span>21 points</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence:</span>
                      <span>High</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tracking:</span>
                      <span className="text-green-600 flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    Dictionary Match
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dictionary:</span>
                      <span>ASL Standard</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Signs Available:</span>
                      <span>2,500+</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Updated:</span>
                      <span>Today</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Save Results
                </Button>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Analysis
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-primary" />
              Upload Video for Recognition
            </h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium mb-2">Drag and drop video file</h4>
                  <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
                  <Button variant="outline">Select Video File</Button>
                </div>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">Supported formats: MP4, MOV, AVI (max 100MB)</div>
                <Button disabled={!isLoading && uploadProgress < 100} onClick={handleAction}>
                  <HandMetal className="h-4 w-4 mr-2" />
                  Analyze Video
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2 text-primary" />
              Export Translation Results
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="mp4" onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">Video (MP4)</SelectItem>
                        <SelectItem value="gif">Animated GIF</SelectItem>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="txt">Text File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Faster)</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High (Recommended)</SelectItem>
                        <SelectItem value="ultra">Ultra HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Include</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="include-subtitles" defaultChecked />
                        <Label htmlFor="include-subtitles">Subtitles</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="include-timestamps" defaultChecked />
                        <Label htmlFor="include-timestamps">Timestamps</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="include-metadata" />
                        <Label htmlFor="include-metadata">Metadata</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {exportFormat === "mp4" && <Video className="h-12 w-12 text-gray-300" />}
                    {exportFormat === "gif" && <Play className="h-12 w-12 text-gray-300" />}
                    {exportFormat === "pdf" && <FileText className="h-12 w-12 text-gray-300" />}
                    {exportFormat === "txt" && <FileText className="h-12 w-12 text-gray-300" />}
                    <span className="absolute text-gray-500">Preview</span>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium mb-2">Export Details:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-medium">{exportFormat.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Size:</span>
                        <span className="font-medium">
                          {exportFormat === "mp4"
                            ? "12.4 MB"
                            : exportFormat === "gif"
                              ? "5.8 MB"
                              : exportFormat === "pdf"
                                ? "1.2 MB"
                                : "4 KB"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">00:01:24</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Directly
                </Button>
                <Button onClick={handleAction} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Share with Team
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email Addresses</Label>
                <Input placeholder="Enter email addresses separated by commas" />
              </div>

              <div className="space-y-2">
                <Label>Message (Optional)</Label>
                <Textarea placeholder="Add a message to recipients..." />
              </div>

              <div className="space-y-2">
                <Label>Access Level</Label>
                <Select defaultValue="view">
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="comment">Can Comment</SelectItem>
                    <SelectItem value="edit">Can Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAction} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6 pt-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Provide Feedback
            </h3>

            {feedbackSubmitted ? (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Thank You for Your Feedback!</h4>
                <p className="text-gray-600 mb-6">Your feedback helps us improve the Sign Language Analysis Tool.</p>
                <Button onClick={() => setFeedbackSubmitted(false)}>Submit Another Feedback</Button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-type">Feedback Type</Label>
                  <Select defaultValue="suggestion">
                    <SelectTrigger id="feedback-type">
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="praise">Praise</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-subject">Subject</Label>
                  <Input id="feedback-subject" placeholder="Brief description of your feedback" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-details">Details</Label>

                  <Textarea
                    id="feedback-details"
                    placeholder="Please provide detailed information about your feedback..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="contact-permission" />
                    <Label htmlFor="contact-permission">I'm willing to be contacted about this feedback</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback-email">Email (Optional)</Label>
                  <Input id="feedback-email" type="email" placeholder="Your email address" />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" />
              Report an Issue
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Before Reporting an Issue</h4>
                    <p className="text-amber-700 text-sm mt-1">
                      Please check our{" "}
                      <a href="#" className="underline">
                        FAQ
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline">
                        Known Issues
                      </a>{" "}
                      pages to see if your issue has already been addressed.
                    </p>
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Report a Technical Issue
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report Technical Issue</DialogTitle>
                    <DialogDescription>
                      Please provide details about the technical issue you're experiencing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Issue Type</Label>
                      <Select defaultValue="error">
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error">Error Message</SelectItem>
                          <SelectItem value="crash">Application Crash</SelectItem>
                          <SelectItem value="performance">Performance Issue</SelectItem>
                          <SelectItem value="ui">UI Problem</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Describe the issue in detail..." className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                      <Label>Steps to Reproduce</Label>
                      <Textarea placeholder="List the steps to reproduce this issue..." className="min-h-[100px]" />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button onClick={handleAction}>Submit Report</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-center text-sm text-gray-500 mt-4">
                For urgent issues, please contact our support team directly at{" "}
                <a href="mailto:support@slat.com" className="text-primary">
                  support@slat.com
                </a>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

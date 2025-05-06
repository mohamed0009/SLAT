"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { PageHeader } from "@/components/page-header"
import { Mic, Play, Square, HandMetal, Camera, RefreshCw, Loader2, Save, Settings } from "lucide-react"
import { Avatar } from "@/components/avatar"
import { ImprovedAvatar } from "@/components/improved-avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample sign language dictionary for demonstration
const signDictionary = [
  "hello",
  "thank you",
  "please",
  "yes",
  "no",
  "help",
  "sorry",
  "good",
  "bad",
  "morning",
  "afternoon",
  "evening",
  "name",
  "what",
  "where",
  "when",
  "who",
  "why",
  "how",
  "eat",
  "drink",
  "sleep",
]

export default function TranslatePage() {
  const [inputText, setInputText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [avatarReady, setAvatarReady] = useState(false)
  const [captureMode, setCaptureMode] = useState(false)
  const [avatarImage, setAvatarImage] = useState<string | null>(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  )
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [recentTranslations, setRecentTranslations] = useState<string[]>([])
  const [useImprovedAvatar, setUseImprovedAvatar] = useState(true)
  const [avatarType, setAvatarType] = useState<"2d" | "3d">("2d")
  const [recognitionSensitivity, setRecognitionSensitivity] = useState(75)
  const [selectedLanguage, setSelectedLanguage] = useState("asl")
  const [showSettings, setShowSettings] = useState(false)
  const [savedAvatars, setSavedAvatars] = useState<{ name: string; url: string }[]>([
    {
      name: "Default Avatar",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ])
  const [newAvatarName, setNewAvatarName] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Set default avatar on component mount
  useEffect(() => {
    if (avatarImage) {
      setAvatarReady(true)
    }
  }, [avatarImage])

  // Initialize webcam when in capture mode
  useEffect(() => {
    if (captureMode) {
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.error("Error accessing webcam:", err)
        }
      }

      startWebcam()

      return () => {
        // Stop webcam when component unmounts or capture mode is disabled
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream
          const tracks = stream.getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }, [captureMode])

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setRecordingTime(0)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  // Handle input text suggestions
  useEffect(() => {
    if (inputText.trim() === "") {
      setSuggestions([])
      return
    }

    const filteredSuggestions = signDictionary
      .filter((word) => word.toLowerCase().includes(inputText.toLowerCase()))
      .slice(0, 5)

    setSuggestions(filteredSuggestions)
  }, [inputText])

  const captureAvatar = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/png")
        setAvatarImage(imageDataUrl)
        setAvatarReady(true)
        setCaptureMode(false)
      }
    }
  }

  const startRecording = async () => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Your browser doesn't support audio recording")
        alert("Your browser doesn't support audio recording")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Initialize audio context for visualization
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContext) {
          console.error("AudioContext not supported")
          return
        }
        audioContextRef.current = new AudioContext()
      }

      if (audioContextRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)
      }

      // Initialize media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        processAudioToText(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      alert("Could not access microphone. Please check your browser permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()

      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }

      setIsRecording(false)
    }
  }

  const processAudioToText = (audioBlob: Blob) => {
    // Show loading state
    setInputText("Processing your speech...")

    // In a real app, this would send the audio to a speech-to-text service
    // For demo purposes, we'll simulate a response after a delay
    setTimeout(() => {
      // Simulated speech-to-text result
      const demoTexts = [
        "Hello, how are you today?",
        "Can you help me with directions?",
        "Thank you for your assistance",
        "I would like to learn sign language",
      ]

      const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)]
      setInputText(randomText)

      // Automatically start translation after speech recognition
      setTimeout(() => {
        translateText()
      }, 500)
    }, 1500)
  }

  const simulateRecording = () => {
    setIsRecording(true)

    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false)

      // Simulate speech recognition
      const demoTexts = [
        "Hello, how are you today?",
        "Can you help me with directions?",
        "Thank you for your assistance",
        "I would like to learn sign language",
      ]

      const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)]
      setInputText(randomText)

      // Automatically start translation
      setTimeout(() => {
        translateText()
      }, 500)
    }, 3000)
  }

  const translateText = () => {
    if (!inputText.trim()) return

    setIsTranslating(true)

    // Add to recent translations if not already there
    if (!recentTranslations.includes(inputText)) {
      setRecentTranslations((prev) => [inputText, ...prev].slice(0, 5))
    }

    // Simulate translation process
    setTimeout(() => {
      // In a real app, this would continue until the full translation is complete
      // For demo, we'll stop after a few seconds
      setTimeout(() => {
        setIsTranslating(false)
      }, 5000)
    }, 500)
  }

  const saveCurrentAvatar = () => {
    if (!avatarImage || !newAvatarName.trim()) return

    setSavedAvatars((prev) => [...prev, { name: newAvatarName, url: avatarImage }])

    setNewAvatarName("")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarImage(event.target.result as string)
        setAvatarReady(true)
      }
    }
    reader.readAsDataURL(file)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader
        title="Sign Language Translator"
        description="Translate text or speech to sign language using your personalized avatar"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HandMetal className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">Your Sign Language Avatar</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Settings</span>
              </Button>
            </div>

            <div className="p-6">
              {captureMode ? (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                      <Button onClick={captureAvatar} className="bg-primary hover:bg-primary/90">
                        <Camera className="h-4 w-4 mr-2" />
                        Capture Avatar
                      </Button>
                      <Button variant="outline" onClick={() => setCaptureMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                  <p className="text-center text-gray-500">Position yourself in the frame and click "Capture Avatar"</p>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-6 w-full max-w-md aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {avatarReady ? (
                      useImprovedAvatar ? (
                        <ImprovedAvatar
                          imageUrl={avatarImage || ""}
                          isTranslating={isTranslating}
                          playbackSpeed={playbackSpeed}
                          signText={inputText}
                        />
                      ) : (
                        <Avatar
                          imageUrl={avatarImage || ""}
                          isTranslating={isTranslating}
                          playbackSpeed={playbackSpeed}
                        />
                      )
                    ) : (
                      <div className="text-center p-8">
                        <div className="mb-4 flex justify-center">
                          <HandMetal className="h-16 w-16 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Create Your Avatar</h3>
                        <p className="text-gray-500 mb-6">
                          Use your webcam to create a personalized sign language avatar
                        </p>
                        <Button onClick={() => setCaptureMode(true)} className="bg-primary hover:bg-primary/90">
                          <Camera className="h-4 w-4 mr-2" />
                          Create Avatar
                        </Button>
                      </div>
                    )}
                  </div>

                  {avatarReady && (
                    <div className="w-full max-w-md space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Playback Speed: {playbackSpeed}x</span>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <Save className="h-3 w-3" />
                                <span className="hidden sm:inline">Save Avatar</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Save Avatar</DialogTitle>
                                <DialogDescription>
                                  Give your avatar a name to save it for future use.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="avatar-name" className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id="avatar-name"
                                    value={newAvatarName}
                                    onChange={(e) => setNewAvatarName(e.target.value)}
                                    className="col-span-3"
                                    placeholder="My Avatar"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Preview</Label>
                                  <div className="col-span-3">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                                      <img
                                        src={avatarImage || ""}
                                        alt="Avatar preview"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={saveCurrentAvatar}>Save Avatar</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCaptureMode(true)}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span className="hidden sm:inline">Recapture</span>
                          </Button>
                        </div>
                      </div>
                      <Slider
                        value={[playbackSpeed]}
                        min={0.5}
                        max={2}
                        step={0.1}
                        onValueChange={(value) => setPlaybackSpeed(value[0])}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Translation Controls */}
        <div>
          <Card>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
              <h2 className="text-lg font-medium">Translation Controls</h2>
            </div>

            <div className="p-6">
              <Tabs defaultValue="text">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="text">Text Input</TabsTrigger>
                  <TabsTrigger value="voice">Voice Input</TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        placeholder="Enter text to translate to sign language..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                      {suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setInputText(suggestion)
                                setSuggestions([])
                              }}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={translateText}
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={!avatarReady || isTranslating || !inputText.trim()}
                    >
                      {isTranslating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Translating...
                        </>
                      ) : (
                        <>
                          <HandMetal className="h-4 w-4 mr-2" />
                          Translate to Sign Language
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Button
                        size="lg"
                        className={`rounded-full h-16 w-16 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"}`}
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      </Button>
                      {isRecording && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          ●
                        </span>
                      )}
                    </div>
                  </div>

                  {isRecording && (
                    <div className="text-center text-gray-500">Recording... {formatTime(recordingTime)}</div>
                  )}

                  <div className="text-center text-sm text-gray-500">
                    {isRecording ? "Tap to stop recording" : "Tap to start recording"}
                  </div>

                  {/* Add fallback button */}
                  <div className="text-center mt-2">
                    <Button variant="outline" size="sm" onClick={simulateRecording} disabled={isRecording}>
                      Simulate Voice Input
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      If microphone access isn't working, use this button instead
                    </p>
                  </div>

                  {inputText && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium mb-1">Recognized Speech:</p>
                      <p className="text-gray-700">{inputText}</p>
                      <Button
                        onClick={translateText}
                        className="w-full mt-3 bg-primary hover:bg-primary/90"
                        disabled={!avatarReady || isTranslating || inputText === "Processing your speech..."}
                      >
                        {isTranslating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Translating...
                          </>
                        ) : (
                          <>
                            <HandMetal className="h-4 w-4 mr-2" />
                            Translate to Sign Language
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Recent Translations */}
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-2">Recent Translations</h3>
                {recentTranslations.length > 0 ? (
                  <ul className="space-y-2">
                    {recentTranslations.map((text, index) => (
                      <li key={index} className="group">
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-left font-normal h-auto py-2"
                          onClick={() => {
                            setInputText(text)
                            translateText()
                          }}
                        >
                          <span className="truncate">{text}</span>
                          <Play className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">No recent translations</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Avatar Settings</DialogTitle>
            <DialogDescription>Customize your sign language avatar and translation settings</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar-type" className="text-right">
                Avatar Type
              </Label>
              <Select value={avatarType} onValueChange={(value) => setAvatarType(value as "2d" | "3d")}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select avatar type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2d">2D Avatar</SelectItem>
                  <SelectItem value="3d">3D Avatar (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="use-improved" className="text-right">
                Use Enhanced Avatar
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="use-improved" checked={useImprovedAvatar} onCheckedChange={setUseImprovedAvatar} />
                <Label htmlFor="use-improved">{useImprovedAvatar ? "Enhanced" : "Basic"}</Label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sign-language" className="text-right">
                Sign Language
              </Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select sign language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asl">American Sign Language (ASL)</SelectItem>
                  <SelectItem value="bsl">British Sign Language (BSL)</SelectItem>
                  <SelectItem value="lsf">French Sign Language (LSF)</SelectItem>
                  <SelectItem value="lsm">Mexican Sign Language (LSM)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recognition-sensitivity" className="text-right">
                Recognition Sensitivity
              </Label>
              <div className="col-span-3 space-y-2">
                <Slider
                  id="recognition-sensitivity"
                  value={[recognitionSensitivity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setRecognitionSensitivity(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>{recognitionSensitivity}%</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar-upload" className="text-right">
                Upload Avatar
              </Label>
              <div className="col-span-3">
                <Input id="avatar-upload" type="file" accept="image/*" onChange={handleFileUpload} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="saved-avatars" className="text-right pt-2">
                Saved Avatars
              </Label>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-3">
                  {savedAvatars.map((avatar, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => setAvatarImage(avatar.url)}
                    >
                      <div
                        className={`w-16 h-16 rounded-full overflow-hidden border-2 ${avatarImage === avatar.url ? "border-primary" : "border-gray-200"}`}
                      >
                        <img
                          src={avatar.url || "/placeholder.svg"}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs mt-1 text-center">{avatar.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

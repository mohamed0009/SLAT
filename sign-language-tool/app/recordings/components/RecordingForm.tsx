"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Camera, StopCircle, Video } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"

interface RecordingFormProps {
  onSave: (recordingData: any) => void;
}

export default function RecordingForm({ onSave }: RecordingFormProps) {
  // Recording form state
  const [newRecordingTitle, setNewRecordingTitle] = useState("")
  const [newRecordingCategory, setNewRecordingCategory] = useState("practice")
  const [newRecordingDescription, setNewRecordingDescription] = useState("")
  
  // Recording state
  const [isCapturingVideo, setIsCapturingVideo] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // Camera/video refs
  const cameraRef = useRef<HTMLVideoElement | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  
  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      
      // Clean up any object URLs to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [stream, recordingInterval, previewUrl]);
  
  // Function to start camera
  const startCamera = async () => {
    try {
      setRecordingError(null);
      
      // Request camera and microphone permissions
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setStream(mediaStream);
      
      // Set stream to video element
      if (cameraRef.current) {
        cameraRef.current.srcObject = mediaStream;
      }
      
      // Create media recorder with supported MIME type
      let mimeType = 'video/webm;codecs=vp9,opus';
      const supportedTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
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
      
      // Create media recorder
      const recorder = new MediaRecorder(mediaStream, {
        mimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      });
      
      // Event handlers for the recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      recorder.onstop = () => {
        // Create a blob from the recorded chunks
        const blob = new Blob(recordedChunks, {
          type: 'video/webm'
        });
        
        // Create a URL for the blob
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setShowPreview(true);
        
        // Update preview video
        if (previewVideoRef.current) {
          previewVideoRef.current.src = url;
        }
      };
      
      setMediaRecorder(recorder);
      setIsCapturingVideo(true);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setRecordingError('Could not access camera or microphone. Please check permissions.');
    }
  };
  
  // Function to start recording
  const startVideoRecording = () => {
    if (mediaRecorder) {
      // Clear previous recording chunks
      setRecordedChunks([]);
      setShowPreview(false);
      setPreviewUrl(null);
      
      // Start recording with 1 second intervals
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingDuration(0);
      
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      setRecordingInterval(interval);
    }
  };
  
  // Function to stop recording
  const stopVideoRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      
      setIsRecording(false);
      
      toast({
        title: "Recording completed",
        description: `Duration: ${formatTime(recordingDuration)}`,
      });
    }
  };
  
  // Function to save the recorded video
  const saveRecordedVideo = () => {
    if (recordedChunks.length > 0 && newRecordingTitle) {
      try {
        // Create a blob from the recorded chunks
        const blob = new Blob(recordedChunks, {
          type: 'video/webm'
        });
        
        // Get file size in MB
        const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(1);
        
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Convert blob to data URL for storage
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          
          // Create a new recording object
          const newRecording = {
            id: Date.now(), // Use timestamp as unique ID
            title: newRecordingTitle || "Untitled Recording",
            date: dateStr,
            time: timeStr,
            duration: formatTime(recordingDuration),
            size: `${fileSizeMB} MB`,
            category: newRecordingCategory || "Practice",
            thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            videoUrl: "",
            timestamp: today.toISOString()
          };
          
          // Store video data separately to avoid localStorage size limits
          localStorage.setItem(`video_${newRecording.id}`, base64data);
          
          // Load existing recordings
          let existingRecordings = [];
          try {
            const storedRecordings = localStorage.getItem('userRecordings');
            existingRecordings = storedRecordings ? JSON.parse(storedRecordings) : [];
          } catch (error) {
            console.error('Failed to parse existing recordings:', error);
          }
          
          // Add new recording to the list
          existingRecordings.push(newRecording);
          
          // Save back to localStorage
          localStorage.setItem('userRecordings', JSON.stringify(existingRecordings));
          
          // Callback with new recording
          onSave(newRecording);
          
          // Reset form and recording state
          setNewRecordingTitle("");
          setNewRecordingCategory("practice");
          setNewRecordingDescription("");
          setRecordingDuration(0);
          setRecordedChunks([]);
          setShowPreview(false);
          
          // Clean up resources
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          
          // Close camera stream
          closeCamera();
        };
      } catch (error) {
        console.error('Error saving recording:', error);
        toast({
          title: "Error",
          description: "Failed to save the recording. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide a title and record a video.",
        variant: "destructive",
      });
    }
  };
  
  // Function to close camera
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setMediaRecorder(null);
    setIsCapturingVideo(false);
  };
  
  return (
    <>
      {recordingError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-600 text-sm">{recordingError}</p>
          </div>
        </div>
      )}
      
      {!isRecording && !isCapturingVideo ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Recording Title</Label>
            <Input 
              id="title" 
              placeholder="Enter a title for your recording"
              value={newRecordingTitle}
              onChange={(e) => setNewRecordingTitle(e.target.value)}
              className="border-blue-200 focus-visible:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={newRecordingCategory} onValueChange={setNewRecordingCategory}>
              <SelectTrigger id="category" className="border-blue-200 focus:ring-blue-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="conversation">Conversation</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Add a description of this recording"
              value={newRecordingDescription}
              onChange={(e) => setNewRecordingDescription(e.target.value)}
              className="min-h-[80px] border-blue-200 focus-visible:ring-blue-500"
            />
          </div>
          
          <div className="mt-4">
            <Button 
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 flex items-center justify-center gap-2"
              onClick={startCamera}
            >
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {showCamera && !showPreview && (
            <>
              <div className="aspect-video bg-black rounded-md overflow-hidden relative">
                <video
                  ref={cameraRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white py-1 px-3 rounded-full flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    REC {formatTime(recordingDuration)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="toggle-camera" className="text-sm text-blue-800">Show Camera</Label>
                  <Switch
                    id="toggle-camera"
                    checked={showCamera}
                    onCheckedChange={setShowCamera}
                  />
                </div>
                
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 flex items-center gap-2"
                      onClick={startVideoRecording}
                    >
                      <Video className="h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-2"
                      onClick={stopVideoRecording}
                    >
                      <StopCircle className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={closeCamera}
                >
                  Close Camera
                </Button>
              </div>
            </>
          )}
          
          {showPreview && previewUrl && (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-md overflow-hidden">
                <video
                  ref={previewVideoRef}
                  controls
                  className="w-full h-full"
                  src={previewUrl}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    setShowPreview(false);
                    setShowCamera(true);
                  }}
                >
                  Retake
                </Button>
                
                <Button
                  className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"
                  onClick={saveRecordedVideo}
                >
                  Save Recording
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
} 
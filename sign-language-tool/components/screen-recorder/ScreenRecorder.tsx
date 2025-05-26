'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, Mic, Pause, Play, StopCircle, X, Save, Layers, Monitor } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ScreenRecorderProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define missing interfaces for TypeScript
interface DisplayMediaStreamOptions {
  video?: boolean | MediaTrackConstraints & {
    cursor?: string;
    displaySurface?: string;
  };
  audio?: boolean | MediaTrackConstraints;
}

declare global {
  interface MediaDevices {
    getDisplayMedia(options?: DisplayMediaStreamOptions): Promise<MediaStream>;
  }
}

export const ScreenRecorder = ({ isOpen, onClose }: ScreenRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [recordingCategory, setRecordingCategory] = useState('practice');
  const [recordWithAudio, setRecordWithAudio] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [availableSources, setAvailableSources] = useState<MediaDeviceInfo[]>([]);
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();

  // Update dialog visibility based on isOpen prop
  useEffect(() => {
    setDialogVisible(isOpen);
  }, [isOpen]);

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get available screen sources
  useEffect(() => {
    const getAvailableSources = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.error('MediaDevices API not supported');
          return;
        }
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAvailableSources(audioInputs);
        
        if (audioInputs.length > 0) {
          setSelectedSource(audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting media devices:', error);
      }
    };
    
    if (isOpen) {
      getAvailableSources();
    }
  }, [isOpen]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      stopRecording();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  // Start screen recording
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      
      // Request screen capture
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: false, // We'll handle audio separately
      };
      
      const screenStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      
      // Set up audio if enabled
      let combinedStream = screenStream;
      
      if (recordWithAudio && selectedSource) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: selectedSource },
          });
          
          // Combine screen and audio tracks
          const combinedTracks = [
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks(),
          ];
          
          combinedStream = new MediaStream(combinedTracks);
        } catch (audioError) {
          console.error('Error capturing audio:', audioError);
          toast({
            title: "Audio Capture Failed",
            description: "Recording will continue without audio",
            variant: "destructive",
          });
        }
      }
      
      streamRef.current = combinedStream;
      
      // Set up preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = combinedStream;
      }
      
      // Create MediaRecorder
      const options = { mimeType: 'video/webm; codecs=vp9,opus' };
      const recorder = new MediaRecorder(combinedStream, options);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setIsReadyToSave(true);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Update preview video
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
          videoPreviewRef.current.src = url;
          videoPreviewRef.current.controls = true;
        }
        
        // Show dialog for saving when recording is done
        setDialogVisible(true);
        setShowFloatingControls(false);
      };
      
      recorder.onpause = () => setIsPaused(true);
      recorder.onresume = () => setIsPaused(false);
      recorder.onstart = () => {
        setIsRecording(true);
        setRecordingTime(0);
        
        // Start timer
        timerIntervalRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
        
        // Allow user to close dialog and show floating controls
        setShowFloatingControls(true);
        
        toast({
          title: "Recording Started",
          description: "You can now navigate to other parts of the app while recording.",
          variant: "default",
        });
      };
      
      // Start recording
      mediaRecorderRef.current = recorder;
      recorder.start(1000); // Capture data in 1-second chunks
      
      // Add listener for when user stops sharing screen
      screenStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Could not start screen recording. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Save recording to recordings page
  const saveRecording = async () => {
    if (!recordedChunksRef.current.length || !recordingTitle) {
      toast({
        title: "Cannot Save Recording",
        description: "Please provide a title for your recording",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Create a blob from recorded chunks
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      
      // Get file size in MB
      const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(1);
      
      // Convert blob to base64 for storage in localStorage
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        
        // Create recording metadata
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // For preview, we'll still use a blob URL temporarily
        const url = URL.createObjectURL(blob);
        
        // Create a new recording object
        const newRecording = {
          id: Date.now(), // Use timestamp as unique ID
          title: recordingTitle,
          date: dateStr,
          time: timeStr,
          duration: formatTime(recordingTime),
          size: `${fileSizeMB} MB`,
          category: recordingCategory,
          thumbnail: "https://images.unsplash.com/photo-1527334919515-b8dee906a34b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          videoUrl: url, // Temporary URL for immediate viewing
          videoData: base64data, // The actual video data in base64 format
        };
        
        // Save to localStorage
        try {
          // Get existing recordings
          const savedRecordings = localStorage.getItem('userRecordings');
          const existingRecordings = savedRecordings ? JSON.parse(savedRecordings) : [];
          
          // For localStorage, we need to limit the size, so let's only include metadata
          // and save the actual video data separately
          const recordingForStorage = {
            ...newRecording,
            videoData: base64data.substring(0, 100) + '...' // Store just a hint of the data for debugging
          };
          
          // Store the actual video data with a unique key
          localStorage.setItem(`video_${newRecording.id}`, base64data);
          
          // Add new recording metadata to the list
          const updatedRecordings = [...existingRecordings, recordingForStorage];
          
          // Save back to localStorage
          localStorage.setItem('userRecordings', JSON.stringify(updatedRecordings));
          
          // Also store the ID of the most recently added recording
          localStorage.setItem('lastAddedRecordingId', String(newRecording.id));
        } catch (error) {
          console.error('Error saving recording to localStorage:', error);
          
          // If localStorage failed (likely due to size), try to save just the metadata
          try {
            const savedRecordings = localStorage.getItem('userRecordings');
            const existingRecordings = savedRecordings ? JSON.parse(savedRecordings) : [];
            
            // Create a simplified version without the video data
            const simplifiedRecording = {
              id: newRecording.id,
              title: newRecording.title,
              date: newRecording.date,
              time: newRecording.time,
              duration: newRecording.duration,
              size: newRecording.size,
              category: newRecording.category,
              thumbnail: newRecording.thumbnail,
              videoUrl: url, // Keep the temporary URL
            };
            
            // Add new simplified recording to the list
            const updatedRecordings = [...existingRecordings, simplifiedRecording];
            
            // Save back to localStorage
            localStorage.setItem('userRecordings', JSON.stringify(updatedRecordings));
            localStorage.setItem('lastAddedRecordingId', String(newRecording.id));
            
            // Show warning about storage limitations
            toast({
              title: "Warning",
              description: "The video is too large for permanent storage. It will be available until you refresh the page.",
              variant: "destructive",
            });
          } catch (fallbackError) {
            console.error('Even fallback storage failed:', fallbackError);
          }
        }
        
        toast({
          title: "Recording Saved",
          description: `${recordingTitle} (${fileSizeMB} MB) has been saved to your recordings`,
          variant: "default",
        });
        
        // Reset and close
        resetRecorder();
        onClose();
        
        // Navigate to recordings page with a parameter to show the new recording notification
        setTimeout(() => {
          router.push('/recordings?newRecording=true');
        }, 1000);
      };
      
      reader.onerror = (error) => {
        console.error('Error converting video to base64:', error);
        toast({
          title: "Save Failed",
          description: "Could not process your recording. Please try again.",
          variant: "destructive",
        });
        setIsSaving(false);
      };
      
    } catch (error) {
      console.error('Error saving recording:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your recording. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  // Reset recorder state
  const resetRecorder = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setPreviewUrl(null);
    setIsReadyToSave(false);
    setRecordingTitle('');
    setShowFloatingControls(false);
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    recordedChunksRef.current = [];
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
      videoPreviewRef.current.src = '';
    }
  };

  // Close dialog handler
  const handleClose = () => {
    if (isRecording) {
      // If recording, just close the dialog but keep recording with floating controls
      setDialogVisible(false);
    } else if (isReadyToSave) {
      if (confirm('Recording is ready to save. Are you sure you want to exit without saving?')) {
        resetRecorder();
        onClose();
      }
    } else {
      resetRecorder();
      onClose();
    }
  };

  // Handle clicking the floating controls to reopen the dialog
  const handleOpenDialog = () => {
    setDialogVisible(true);
  };

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={dialogVisible} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Screen Recorder
            </DialogTitle>
            <DialogDescription className="text-blue-600">
              Record your screen and voice for sign language demonstrations
              {isRecording && !isReadyToSave && (
                <span className="block mt-1 text-blue-700 font-medium">
                  You can close this dialog and continue using the app while recording
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            {/* Preview area */}
            <div className="aspect-video bg-black rounded-md overflow-hidden relative">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
              />
              
              {isRecording && (
                <div className="absolute top-3 left-3 bg-red-500 text-white py-1 px-3 rounded-full flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  REC {formatTime(recordingTime)}
                </div>
              )}
              
              {!isRecording && !previewUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-900/10">
                  <div className="text-center p-4">
                    <Monitor className="h-12 w-12 text-blue-800 mx-auto mb-3" />
                    <p className="text-blue-800 font-medium">Ready to record your screen</p>
                    <p className="text-blue-600 text-sm mt-1">Click the Start Recording button below to begin</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recording options */}
            {!isRecording && !isReadyToSave && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-md">
                <div className="flex items-center justify-between">
                  <Label htmlFor="include-audio" className="text-blue-800 font-medium">Include Audio</Label>
                  <Switch
                    id="include-audio"
                    checked={recordWithAudio}
                    onCheckedChange={setRecordWithAudio}
                  />
                </div>
                
                {recordWithAudio && (
                  <div className="space-y-2">
                    <Label htmlFor="audio-source" className="text-blue-800 text-sm">Audio Source</Label>
                    <Select value={selectedSource || ''} onValueChange={setSelectedSource}>
                      <SelectTrigger id="audio-source" className="border-blue-200 focus:ring-blue-500">
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSources.map((source) => (
                          <SelectItem key={source.deviceId} value={source.deviceId}>
                            {source.label || `Microphone ${source.deviceId.substring(0, 5)}...`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"
                    onClick={startRecording}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              </div>
            )}
            
            {/* Recording controls */}
            {isRecording && !isReadyToSave && (
              <div className="flex justify-center gap-3">
                {isPaused ? (
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-1"
                    onClick={resumeRecording}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-1"
                    onClick={pauseRecording}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-700 hover:bg-red-50 flex-1"
                  onClick={stopRecording}
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            )}
            
            {/* Save options */}
            {isReadyToSave && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="recording-title" className="text-blue-800 font-medium">Recording Title</Label>
                  <Input
                    id="recording-title"
                    placeholder="Enter a title for your recording"
                    value={recordingTitle}
                    onChange={(e) => setRecordingTitle(e.target.value)}
                    className="border-blue-200 focus-visible:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recording-category" className="text-blue-800 font-medium">Category</Label>
                  <Select value={recordingCategory} onValueChange={setRecordingCategory}>
                    <SelectTrigger id="recording-category" className="border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="practice">Practice</SelectItem>
                      <SelectItem value="conversation">Conversation</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2 flex gap-3">
                  <Button 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-1"
                    onClick={resetRecorder}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Discard
                  </Button>
                  
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"
                    onClick={saveRecording}
                    disabled={!recordingTitle || isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Recording'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {isRecording ? 'Recording' : isReadyToSave ? 'Ready to Save' : 'Ready'}
              </Badge>
            </div>
            
            {isRecording && !isReadyToSave && (
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => setDialogVisible(false)}
              >
                Continue Using App
              </Button>
            )}
            
            {!isRecording && !isReadyToSave && (
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleClose}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Floating Recording Controls */}
      {showFloatingControls && isRecording && !dialogVisible && (
        <div 
          className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm rounded-full shadow-lg p-2 flex items-center gap-2 cursor-pointer hover:bg-black/90 transition-colors"
          onClick={handleOpenDialog}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-white font-medium">{formatTime(recordingTime)}</span>
          <div className="flex items-center gap-1 ml-1">
            {isPaused ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-transparent hover:bg-white/10 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  resumeRecording();
                }}
              >
                <Play className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-transparent hover:bg-white/10 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  pauseRecording();
                }}
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-transparent hover:bg-white/10 text-white"
              onClick={(e) => {
                e.stopPropagation();
                stopRecording();
              }}
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ScreenRecorder; 
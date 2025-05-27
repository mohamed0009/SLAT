"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { Calendar, Download, Edit, Play, Search, Share2, Trash2, Video, CheckSquare, Square, Folder, Pause, Volume2, VolumeX, Sliders, Mic, StopCircle, Maximize, Minimize, SkipBack, SkipForward, Settings, Camera, AlertCircle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Switch } from "@/components/ui/switch"
import { createRoot } from "react-dom/client"

export default function RecordingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedRecordings, setSelectedRecordings] = useState<number[]>([])
  const [batchMode, setBatchMode] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showFolders, setShowFolders] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [newRecordingTitle, setNewRecordingTitle] = useState("")
  const [newRecordingCategory, setNewRecordingCategory] = useState("practice")
  const [newRecordingDescription, setNewRecordingDescription] = useState("")
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [isCapturingVideo, setIsCapturingVideo] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [userRecordings, setUserRecordings] = useState<any[]>([])
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cameraRef = useRef<HTMLVideoElement | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement | null>(null)
  
  // Sample folders data
  const folders = [
    { id: 1, name: "Practice Sessions", count: 12 },
    { id: 2, name: "Conversations", count: 8 },
    { id: 3, name: "Learning Materials", count: 5 },
    { id: 4, name: "Presentations", count: 3 }
  ]

  // Sample recordings data with real images
  const sampleRecordingsData = [
    {
      id: 1,
      title: "Morning Practice Session",
      date: "2023-06-05",
      time: "09:15 AM",
      duration: "12:45",
      size: "45.2 MB",
      category: "Practice",
      thumbnail:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "ASL Conversation with John",
      date: "2023-06-04",
      time: "02:30 PM",
      duration: "24:18",
      size: "87.6 MB",
      category: "Conversation",
      thumbnail:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Learning New Medical Terms",
      date: "2023-06-03",
      time: "11:45 AM",
      duration: "18:22",
      size: "62.3 MB",
      category: "Learning",
      thumbnail:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Practice for Presentation",
      date: "2023-06-02",
      time: "04:20 PM",
      duration: "32:10",
      size: "108.5 MB",
      category: "Practice",
      thumbnail:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Family Signs Practice",
      date: "2023-06-01",
      time: "10:05 AM",
      duration: "15:40",
      size: "52.8 MB",
      category: "Family",
      thumbnail:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ]
  
  // Load user recordings from localStorage on component mount
  useEffect(() => {
    try {
      const savedRecordings = localStorage.getItem('userRecordings');
      if (savedRecordings) {
        setUserRecordings(JSON.parse(savedRecordings));
      }
    } catch (error) {
      console.error('Error loading saved recordings:', error);
    }
  }, []);
  
  // Combine sample and user recordings
  const recordingsData = [...sampleRecordingsData, ...userRecordings];

  // Filter data based on search query, selected date, and active tab
  const filteredData = recordingsData.filter((recording) => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = !selectedDate || recording.date === selectedDate.toISOString().split("T")[0]
    const matchesCategory = activeTab === "all" || recording.category.toLowerCase() === activeTab.toLowerCase()

    return matchesSearch && matchesDate && matchesCategory
  })

  // Sort data based on selected sort option
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "longest":
        return parseInt(b.duration.split(":")[0]) * 60 + parseInt(b.duration.split(":")[1]) - 
               (parseInt(a.duration.split(":")[0]) * 60 + parseInt(a.duration.split(":")[1]))
      case "shortest":
        return parseInt(a.duration.split(":")[0]) * 60 + parseInt(a.duration.split(":")[1]) - 
               (parseInt(b.duration.split(":")[0]) * 60 + parseInt(b.duration.split(":")[1]))
      case "largest":
        return parseFloat(b.size.split(" ")[0]) - parseFloat(a.size.split(" ")[0])
      case "smallest":
        return parseFloat(a.size.split(" ")[0]) - parseFloat(b.size.split(" ")[0])
      default:
        return 0
    }
  })

  // Enhanced play recording handler with audio controls
  const handlePlayRecording = (recordingId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // Find the recording
    const recording = recordingsData.find(r => r.id === recordingId);
    if (!recording) {
      console.error('Recording not found:', recordingId);
      return;
    }
    
    console.log('Playing recording:', recording.id, recording.title);
    
    // For user recordings (ID > 5), use the video player
    if (recording.id > 5) {
      toggleVideoPlayer(recordingId);
      return;
    }
    
    // For sample recordings, handle audio playback
    if (currentlyPlaying === recordingId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(err => {
          console.error('Error playing audio:', err);
          toast({
            title: "Playback Error",
            description: "Could not play audio. Please try again.",
            variant: "destructive",
          });
        });
        setIsPlaying(true);
      }
    } else {
      setCurrentlyPlaying(recordingId);
      setIsPlaying(true);
      
      // In a real app, you would set the audio source here
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          toast({
            title: "Playback Error",
            description: "Could not play audio. Please try again.",
            variant: "destructive",
          });
        });
      }
    }
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  }
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('ended', () => {});
      };
    }
  }, [currentlyPlaying]);

  // Add handlers for button actions
  const handleDownloadRecording = (recordingId: number) => {
    // Find the recording
    const recording = recordingsData.find(r => r.id === recordingId);
    if (!recording) {
      toast({
        title: "Error",
        description: "Recording not found",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Downloading recording:', recording.id, recording.title);
    
    // For sample recordings (IDs 1-5), show a sample message
    if (recording.id <= 5) {
      toast({
        title: "Sample Recording",
        description: "Sample recordings cannot be downloaded",
        variant: "destructive",
      });
      return;
    }
    
    // For user recordings, try to download from localStorage
    const storageKey = `video_${recording.id}`;
    const storedVideoData = localStorage.getItem(storageKey);
    
    if (!storedVideoData) {
      toast({
        title: "Download Failed",
        description: "Video data not found. The recording may have been lost.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create a temporary link for download
      const a = document.createElement('a');
      a.href = storedVideoData;
      a.download = `${recording.title}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `${recording.title} is being downloaded`,
      });
    } catch (error) {
      console.error('Error downloading recording:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the recording",
        variant: "destructive",
      });
    }
  }
  
  const handleShareRecording = (recordingId: number) => {
    // Find the recording
    const recording = recordingsData.find(r => r.id === recordingId);
    if (!recording) {
      toast({
        title: "Error",
        description: "Recording not found",
        variant: "destructive",
      });
      return;
    }
    
    // For sample recordings or user recordings, show share options
    toast({
      title: "Share Options",
      description: "Sharing functionality will be available in a future update",
    });
    
    // In a real implementation, this would open a share dialog
    console.log(`Sharing recording ${recordingId}: ${recording.title}`);
  }
  
  const handleEditRecording = (recordingId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // Find the recording
    const recording = recordingsData.find(r => r.id === recordingId);
    if (!recording) {
      toast({
        title: "Error",
        description: "Recording not found",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Editing recording:', recording.id, recording.title);
    
    // For sample recordings, show an info message
    if (recording.id <= 5) {
      toast({
        title: "Sample Recording",
        description: "Sample recordings cannot be edited",
        variant: "destructive",
      });
      return;
    }
    
    // For user recordings, allow editing
    // In this demo, we'll just allow renaming the recording
    
    // Set up a state to store the edited title
    const [editTitle, setEditTitle] = useState(recording.title);
    const [editCategory, setEditCategory] = useState(recording.category);
    
    // Show a dialog for editing
    const EditDialog = () => (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Recording</DialogTitle>
            <DialogDescription>
              Update the details of your recording
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border-blue-200 focus-visible:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger id="edit-category" className="border-blue-200 focus:ring-blue-500">
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
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                document.body.removeChild(document.getElementById('edit-dialog-container')!);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Update the recording
                try {
                  // Get existing recordings
                  const savedRecordings = localStorage.getItem('userRecordings');
                  const existingRecordings = savedRecordings ? JSON.parse(savedRecordings) : [];
                  
                  // Find and update the recording
                  const updatedRecordings = existingRecordings.map((r: any) => {
                    if (r.id === recording.id) {
                      return {
                        ...r,
                        title: editTitle,
                        category: editCategory,
                      };
                    }
                    return r;
                  });
                  
                  // Save back to localStorage
                  localStorage.setItem('userRecordings', JSON.stringify(updatedRecordings));
                  
                  // Update state
                  setUserRecordings(prevRecordings => 
                    prevRecordings.map(r => 
                      r.id === recording.id 
                        ? { ...r, title: editTitle, category: editCategory } 
                        : r
                    )
                  );
                  
                  toast({
                    title: "Recording Updated",
                    description: "The recording has been updated successfully",
                  });
                } catch (error) {
                  console.error('Error updating recording:', error);
                  toast({
                    title: "Update Failed",
                    description: "Could not update the recording",
                    variant: "destructive",
                  });
                }
                
                // Remove the dialog
                document.body.removeChild(document.getElementById('edit-dialog-container')!);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
    
    // Create a container for the dialog
    const container = document.createElement('div');
    container.id = 'edit-dialog-container';
    document.body.appendChild(container);
    
    // Render the dialog
    const root = createRoot(container);
    root.render(<EditDialog />);
  }
  
  const handleDeleteRecording = (recordingId: number) => {
    if (confirm(`Are you sure you want to delete this recording?`)) {
      try {
        // For sample recordings, just show a message
        const recording = recordingsData.find(r => r.id === recordingId);
        if (!recording) {
          console.error('Recording not found:', recordingId);
          return;
        }
        
        // Check if it's a user recording (with ID greater than sample recordings)
        if (recording.id > 5) {
          // Delete from localStorage
          localStorage.removeItem(`video_${recordingId}`);
          
          // Get current user recordings
          const savedRecordings = localStorage.getItem('userRecordings');
          if (savedRecordings) {
            const recordings = JSON.parse(savedRecordings);
            // Filter out the deleted recording
            const updatedRecordings = recordings.filter((r: any) => r.id !== recordingId);
            // Save back to localStorage
            localStorage.setItem('userRecordings', JSON.stringify(updatedRecordings));
            // Update state
            setUserRecordings(updatedRecordings);
          }
          
          toast({
            title: "Recording Deleted",
            description: "Your recording has been deleted",
          });
        } else {
          // Sample recording
          toast({
            title: "Cannot Delete",
            description: "Sample recordings cannot be deleted",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error deleting recording:', error);
      }
    }
  }

  // Add batch selection handlers
  const toggleBatchMode = () => {
    setBatchMode(!batchMode)
    if (batchMode) {
      setSelectedRecordings([])
    }
  }

  const toggleRecordingSelection = (recordingId: number) => {
    if (selectedRecordings.includes(recordingId)) {
      setSelectedRecordings(selectedRecordings.filter(id => id !== recordingId))
    } else {
      setSelectedRecordings([...selectedRecordings, recordingId])
    }
  }

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedRecordings.length} recordings?`)) {
      // In a real implementation, this would delete the recordings
      alert(`${selectedRecordings.length} recordings deleted`)
      setSelectedRecordings([])
    }
  }

  const handleBatchDownload = () => {
    // In a real implementation, this would download the recordings
    alert(`Downloading ${selectedRecordings.length} recordings`)
  }

  // Toggle folder view
  const toggleFolderView = () => {
    setShowFolders(!showFolders);
  }

  // Function to start camera
  const startCamera = async () => {
    try {
      setRecordingError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      
      if (cameraRef.current) {
        cameraRef.current.srcObject = mediaStream;
      }
      
      // Create media recorder
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
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
        action: (
          <ToastAction altText="View">View</ToastAction>
        ),
      });
    }
  };
  
  // Function to save the recorded video
  const saveRecordedVideo = () => {
    if (recordedChunks.length > 0 && newRecordingTitle) {
      // Create a blob from the recorded chunks
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });
      
      // Get file size in MB
      const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(1);
      
      // Generate a temporary URL for the video (in a real app, this would be a server URL)
      const videoUrl = URL.createObjectURL(blob);
      
      // Create a thumbnail from the video (in a real app, this would be generated server-side)
      // For now, we'll use a placeholder image
      const thumbnail = previewUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
      
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Create a new recording object
      const newRecording = {
        id: Date.now(), // Use timestamp as unique ID
        title: newRecordingTitle || "Untitled Recording",
        date: dateStr,
        time: timeStr,
        duration: formatTime(recordingDuration),
        size: `${fileSizeMB} MB`,
        category: newRecordingCategory || "Practice",
        thumbnail: thumbnail,
        videoUrl: videoUrl,
      };
      
      // Add to recordings list
      const updatedRecordings = [...userRecordings, newRecording];
      setUserRecordings(updatedRecordings);
      
      // Save to localStorage
      try {
        localStorage.setItem('userRecordings', JSON.stringify(updatedRecordings));
      } catch (error) {
        console.error('Error saving recording to localStorage:', error);
      }
      
      toast({
        title: "Recording saved",
        description: `${newRecordingTitle} has been saved successfully.`,
        variant: "default",
      });
      
      // Reset form and recording state
      setNewRecordingTitle("");
      setNewRecordingCategory("practice");
      setNewRecordingDescription("");
      setRecordingDuration(0);
      setRecordedChunks([]);
      setShowPreview(false);
      setPreviewUrl(null);
      
      // Close camera stream
      closeCamera();
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
  
  // Cleanup function for when component unmounts
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

  // Video player controls
  const toggleVideoPlayer = (recordingId: number) => {
    if (showVideoPlayer && currentlyPlaying === recordingId) {
      setShowVideoPlayer(false)
    } else {
      // Find the selected recording
      const recording = recordingsData.find(r => r.id === recordingId);
      
      if (!recording) {
        console.error('Recording not found:', recordingId);
        toast({
          title: "Error",
          description: "Could not find the recording",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Loading recording:', recording.id, recording.title);
      
      setShowVideoPlayer(true)
      setCurrentlyPlaying(recordingId)
      
      // For sample recordings, use a sample video
      if (recording.id <= 5) { // Sample recordings have IDs 1-5
        console.log('Using sample video for recording ID:', recording.id);
        if (videoRef.current) {
          videoRef.current.src = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
          
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  console.log('Playing sample video');
                })
                .catch(err => {
                  console.error('Error playing sample video:', err);
                  toast({
                    title: "Playback Error",
                    description: "Could not play the sample video",
                    variant: "destructive",
                  });
                });
            }
          }, 100);
        }
        return;
      }
      
      // For user recordings, try to load from localStorage
      console.log('Attempting to load user recording:', recording.id);
      const storageKey = `video_${recording.id}`;
      const storedVideoData = localStorage.getItem(storageKey);
      
      if (!storedVideoData) {
        console.error('No stored video data found for key:', storageKey);
        toast({
          title: "Playback Error",
          description: "Video data not found. The recording may have been lost.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Found stored video data, size:', storedVideoData.length);
      
      try {
        // Check if it's a valid data URL
        if (!storedVideoData.startsWith('data:')) {
          throw new Error('Invalid data format');
        }
        
        // Create a blob URL directly from the data URL
        fetch(storedVideoData)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            console.log('Created blob URL:', blobUrl);
            
            if (videoRef.current) {
              videoRef.current.src = blobUrl;
              
              // Play the video after source is set
              videoRef.current.onloadeddata = () => {
                console.log('Video loaded, attempting to play');
                videoRef.current?.play()
                  .then(() => {
                    setIsPlaying(true);
                    console.log('Video playing successfully');
                  })
                  .catch(err => {
                    console.error('Error playing video after load:', err);
                    toast({
                      title: "Playback Error",
                      description: "There was an error playing this recording",
                      variant: "destructive",
                    });
                  });
              };
              
              videoRef.current.onerror = (e) => {
                console.error('Video element error:', e);
                toast({
                  title: "Video Error",
                  description: "The video file appears to be corrupted",
                  variant: "destructive",
                });
              };
            }
          })
          .catch(err => {
            console.error('Error fetching blob from data URL:', err);
            toast({
              title: "Playback Error",
              description: "Could not process the video data",
              variant: "destructive",
            });
          });
          
      } catch (error) {
        console.error('Error processing video data:', error);
        toast({
          title: "Playback Error",
          description: "Could not process the video. The format may be unsupported.",
          variant: "destructive",
        });
      }
    }
  }
  
  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (videoRef.current?.parentElement?.requestFullscreen) {
        videoRef.current.parentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  }
  
  const handleSkipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  }
  
  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  }
  
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // Check URL for recordings from ScreenRecorder
    const checkForNewRecordings = () => {
      // Check if we were redirected with a new recording
      const params = new URLSearchParams(window.location.search);
      const newRecording = params.get('newRecording');
      const newRecordingId = params.get('id');
      
      if (newRecording === 'true') {
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Highlight the new recording
        setTimeout(() => {
          const recordingElement = document.getElementById(`recording-${newRecordingId}`);
          if (recordingElement) {
            // Add highlight class
            recordingElement.classList.add('highlight-recording');
            
            // Scroll to the element
            recordingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Show success toast
            toast({
              title: "Recording Ready",
              description: "Your new recording is ready to play!",
              variant: "default",
            });
            
            // Remove highlight after 5 seconds
            setTimeout(() => {
              recordingElement.classList.remove('highlight-recording');
            }, 5000);
          }
        }, 500);
      }
    };
    
    checkForNewRecordings();
  }, []);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any blob URLs to prevent memory leaks
      recordingsData.forEach(recording => {
        if (recording.videoUrl && recording.videoUrl.startsWith('blob:')) {
          URL.revokeObjectURL(recording.videoUrl);
        }
      });
    };
  }, []);

  // Add inline styles for the highlight animation
  useEffect(() => {
    // Add the custom CSS to the document head
    const styleId = 'recording-highlight-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes pulse-highlight {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        
        .highlight-recording {
          animation: pulse-highlight 2s infinite;
          border: 2px solid #3b82f6 !important;
          transform: scale(1.02);
          transition: all 0.3s ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Clean up when component unmounts
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  return (
    <div className="container py-6">
      {/* Video Player Modal */}
      {showVideoPlayer && currentlyPlaying && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
            <div className="aspect-video bg-black relative">
              <video 
                ref={videoRef} 
                className="w-full h-full object-contain"
                autoPlay
                playsInline
                controls={false}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                    videoRef.current.playbackRate = playbackSpeed;
                  }
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
              >
                {/* No hardcoded source - we'll set this dynamically */}
                Your browser does not support the video tag.
              </video>
              
              {/* Video overlay controls - only show when not playing or on hover */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 ${!isPlaying ? 'opacity-100' : ''} transition-opacity flex flex-col justify-end`}>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-white min-w-[40px]">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 accent-blue-500 h-2"
                    />
                    <span className="text-sm text-white min-w-[40px]">{formatTime(duration)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                        onClick={handleSkipBackward}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 text-white hover:bg-white/20 rounded-full"
                        onClick={() => {
                          if (currentlyPlaying) {
                            if (videoRef.current) {
                              if (isPlaying) {
                                videoRef.current.pause();
                                setIsPlaying(false);
                              } else {
                                videoRef.current.play().catch(error => {
                                  console.error('Error playing video:', error);
                                });
                                setIsPlaying(true);
                              }
                            }
                          }
                        }}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                        onClick={handleSkipForward}
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                      
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                          onClick={toggleMute}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 accent-blue-500 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 focus:opacity-100"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                          onClick={() => setShowSettings(!showSettings)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        
                        {showSettings && (
                          <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-md p-2 min-w-32">
                            <p className="text-white text-xs mb-1">Playback Speed</p>
                            <div className="flex flex-wrap gap-1">
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                <button
                                  key={speed}
                                  className={`px-2 py-1 text-xs rounded-sm ${playbackSpeed === speed ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                  onClick={() => changePlaybackSpeed(speed)}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                        onClick={toggleFullscreen}
                      >
                        {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                        onClick={() => setShowVideoPlayer(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-b from-gray-900 to-black">
              <h3 className="text-lg font-medium text-white">
                {recordingsData.find(r => r.id === currentlyPlaying)?.title}
              </h3>
              <p className="text-sm text-gray-300">
                Recorded on {recordingsData.find(r => r.id === currentlyPlaying)?.date} at {recordingsData.find(r => r.id === currentlyPlaying)?.time}
              </p>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="Recordings"
        description="View and manage your sign language practice recordings"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-4 bg-gradient-to-r from-blue-100 to-blue-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-800">
              All
            </TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-white data-[state=active]:text-blue-800">
              Practice
            </TabsTrigger>
            <TabsTrigger value="conversation" className="data-[state=active]:bg-white data-[state=active]:text-blue-800">
              Conversation
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-white data-[state=active]:text-blue-800">
              Learning
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={toggleFolderView}
          >
            <Folder className="h-4 w-4 mr-2" />
            {showFolders ? "Show Grid" : "Show Folders"}
          </Button>
        <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px] border-blue-200 focus:ring-blue-500">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="longest">Longest Duration</SelectItem>
            <SelectItem value="shortest">Shortest Duration</SelectItem>
            <SelectItem value="largest">Largest Size</SelectItem>
            <SelectItem value="smallest">Smallest Size</SelectItem>
          </SelectContent>
        </Select>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"
              >
                <Video className="h-4 w-4 mr-2" />
                Create Recording
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Create New Recording</DialogTitle>
                <DialogDescription className="text-blue-600">
                  {isRecording 
                    ? "Recording in progress. Click stop when you're finished."
                    : "Fill in the details and click record to start capturing."
                  }
                </DialogDescription>
              </DialogHeader>
              
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
              
              <DialogFooter className="sm:justify-end">
                {!isRecording && !showPreview ? (
                  <>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        Cancel
                      </Button>
                    </DialogClose>
                    {isCapturingVideo ? (
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={closeCamera}
                      >
                        Close Camera
                      </Button>
                    ) : null}
                  </>
                ) : null}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4 flex-1 mb-6 border-blue-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder="Search recordings..."
                className="pl-9 border-blue-200 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                    <Calendar className="h-4 w-4" />
                    {selectedDate ? selectedDate.toLocaleDateString() : "Filter by Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
              {selectedDate && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedDate(undefined)}
                className="hover:bg-blue-50 hover:text-blue-700"
              >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                className={`border-blue-200 ${batchMode ? 'bg-blue-50 text-blue-800' : 'text-blue-700 hover:bg-blue-50'}`}
                onClick={toggleBatchMode}
              >
                {batchMode ? "Cancel Selection" : "Select Multiple"}
              </Button>
            </div>
          </div>
          {batchMode && selectedRecordings.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-2 bg-blue-50 rounded-md">
              <span className="text-blue-800 font-medium">{selectedRecordings.length} recordings selected</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-100"
                  onClick={handleBatchDownload}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-rose-200 text-rose-700 hover:bg-rose-50"
                  onClick={handleBatchDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete All
                </Button>
              </div>
            </div>
          )}
          
          {currentlyPlaying && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-700 hover:bg-blue-200"
                    onClick={(e) => handlePlayRecording(currentlyPlaying, e)}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <span className="text-blue-800 font-medium ml-2">
                    {recordingsData.find(r => r.id === currentlyPlaying)?.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-blue-700 hover:bg-blue-200"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-blue-700"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700 min-w-[40px]">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-blue-700 h-2"
                />
                <span className="text-sm text-blue-700 min-w-[40px]">{formatTime(duration)}</span>
              </div>
              
              {/* Hidden audio element for playback */}
              <audio ref={audioRef} preload="metadata">
                <source src="/sample-audio.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </Card>

      {showFolders ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map(folder => (
            <Card key={folder.id} className="overflow-hidden border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                  <Folder className="h-6 w-6 text-blue-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900">{folder.name}</h3>
                  <p className="text-sm text-blue-600">{folder.count} recordings</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedData.length > 0 ? (
          sortedData.map((recording) => (
              <Card 
                key={recording.id} 
                id={`recording-${recording.id}`}
                className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                      {batchMode && (
                        <div 
                          className="absolute top-3 right-3 z-20 p-1 bg-white/90 rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRecordingSelection(recording.id);
                          }}
                        >
                          {selectedRecordings.includes(recording.id) ? (
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Square className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      )}
                    <img
                      src={recording.thumbnail || "/placeholder.svg"}
                      alt={recording.title}
                      className="w-full h-48 object-cover"
                    />
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white rounded-full p-3 shadow-md">
                          <Play className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                      <Badge className="absolute bottom-3 right-3 bg-gradient-to-r from-blue-800 to-blue-900 border-none">
                      {recording.duration}
                    </Badge>
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-700 border-blue-200">
                      {recording.category}
                    </Badge>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                      <DialogTitle className="text-blue-900">{recording.title}</DialogTitle>
                      <DialogDescription className="text-blue-600">
                      Recorded on {recording.date} at {recording.time}
                    </DialogDescription>
                  </DialogHeader>
                    <div className="aspect-video bg-gradient-to-r from-blue-50 to-blue-100 rounded-md overflow-hidden relative">
                    <img
                      src={recording.thumbnail || "/placeholder.svg"}
                      alt={recording.title}
                      className="w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={(e) => handlePlayRecording(recording.id, e)}
                    >
                      <div className="bg-white/80 rounded-full p-3 shadow-md hover:bg-white transition-colors">
                          <Video className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                      <div className="text-sm text-blue-600">
                      <div>Duration: {recording.duration}</div>
                      <div>Size: {recording.size}</div>
                      <div>Category: {recording.category}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                          className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        onClick={(e) => handleDownloadRecording(recording.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                          className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        onClick={(e) => handleShareRecording(recording.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                  </div>
                </DialogContent>
              </Dialog>
              <div className="p-4">
                <h3 className="font-medium truncate text-blue-900">{recording.title}</h3>
                <div className="flex justify-between text-sm text-blue-600 mt-1">
                  <span>{recording.date}</span>
                  <span>{recording.time}</span>
                </div>
                </div>
                <div className="flex justify-between mt-4">
                    <span className="text-sm text-blue-600">{recording.size}</span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700"
                        onClick={(e) => handlePlayRecording(recording.id, e)}
                    >
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700"
                        onClick={(e) => handleEditRecording(recording.id, e)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                        onClick={(e) => handleDeleteRecording(recording.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-blue-600" />
            </div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">No recordings found</h3>
              <p className="text-blue-600 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for, or create a new recording.
            </p>
              <Dialog>
                <DialogTrigger asChild>
            <Button 
                    className="mt-4 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"
            >
              <Video className="h-4 w-4 mr-2" />
              Create New Recording
            </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-blue-900">Create New Recording</DialogTitle>
                    <DialogDescription className="text-blue-600">
                      {isRecording 
                        ? "Recording in progress. Click stop when you're finished."
                        : "Fill in the details and click record to start capturing."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
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
                        <Label htmlFor="title-alt">Recording Title</Label>
                        <Input 
                          id="title-alt" 
                          placeholder="Enter a title for your recording"
                          value={newRecordingTitle}
                          onChange={(e) => setNewRecordingTitle(e.target.value)}
                          className="border-blue-200 focus-visible:ring-blue-500"
                        />
      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category-alt">Category</Label>
                        <Select value={newRecordingCategory} onValueChange={setNewRecordingCategory}>
                          <SelectTrigger id="category-alt" className="border-blue-200 focus:ring-blue-500">
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
                        <Label htmlFor="description-alt">Description (Optional)</Label>
                        <Textarea 
                          id="description-alt" 
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
                  
                  <DialogFooter className="sm:justify-end">
                    {!isRecording && !showPreview ? (
                      <>
                        <DialogClose asChild>
                          <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                            Cancel
                          </Button>
                        </DialogClose>
                        {isCapturingVideo ? (
                          <Button
                            variant="outline"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            onClick={closeCamera}
                          >
                            Close Camera
                          </Button>
                        ) : null}
                      </>
                    ) : null}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

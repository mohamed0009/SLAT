"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Video, Play, Download, Share2, Edit, Trash2, CheckSquare, Square } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Recording {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  size: string;
  category: string;
  thumbnail: string;
}

interface RecordingGridProps {
  recordings: Recording[];
  batchMode: boolean;
  selectedRecordings: number[];
  onToggleSelection: (id: number) => void;
  onPlayRecording: (id: number, e?: React.MouseEvent) => void;
}

export default function RecordingGrid({ 
  recordings, 
  batchMode, 
  selectedRecordings, 
  onToggleSelection,
  onPlayRecording
}: RecordingGridProps) {
  
  const handleDeleteRecording = (recordingId: number) => {
    if (confirm(`Are you sure you want to delete this recording?`)) {
      try {
        // For sample recordings, just show a message
        const recording = recordings.find(r => r.id === recordingId);
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
            const allRecordings = JSON.parse(savedRecordings);
            // Filter out the deleted recording
            const updatedRecordings = allRecordings.filter((r: any) => r.id !== recordingId);
            // Save back to localStorage
            localStorage.setItem('userRecordings', JSON.stringify(updatedRecordings));
            
            // Refresh the page to update the UI
            window.location.reload();
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
  };
  
  const handleDownloadRecording = (recordingId: number) => {
    // Find the recording
    const recording = recordings.find(r => r.id === recordingId);
    if (!recording) {
      toast({
        title: "Error",
        description: "Recording not found",
        variant: "destructive",
      });
      return;
    }
    
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
  };
  
  const handleShareRecording = (recordingId: number) => {
    // Find the recording
    const recording = recordings.find(r => r.id === recordingId);
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
  };
  
  if (recordings.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center mx-auto mb-4">
          <Video className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-blue-900 mb-2">No recordings found</h3>
        <p className="text-blue-600 max-w-md mx-auto">
          Try adjusting your search or filter to find what you're looking for, or create a new recording.
        </p>
        <Button 
          className="mt-4 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"
        >
          <Video className="h-4 w-4 mr-2" />
          Create New Recording
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recordings.map((recording) => (
        <Card 
          key={recording.id} 
          id={`recording-${recording.id}`}
          className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200"
        >
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group">
                {batchMode && (
                  <div 
                    className="absolute top-3 right-3 z-20 p-1 bg-white/90 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelection(recording.id);
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
                  onClick={(e) => onPlayRecording(recording.id, e)}
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
                    onClick={() => handleDownloadRecording(recording.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => handleShareRecording(recording.id)}
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
          <div className="flex justify-between p-4 pt-0">
            <span className="text-sm text-blue-600">{recording.size}</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700"
                onClick={(e) => onPlayRecording(recording.id, e)}
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // In a real app, this would open an edit dialog
                  toast({
                    title: recording.id <= 5 ? "Sample Recording" : "Edit Recording",
                    description: recording.id <= 5 
                      ? "Sample recordings cannot be edited" 
                      : "Editing will be available in a future update",
                  });
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRecording(recording.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 
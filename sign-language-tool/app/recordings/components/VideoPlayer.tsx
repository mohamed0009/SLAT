"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, Settings, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface VideoPlayerProps {
  recordingId: number;
  recording: any;
  onClose: () => void;
}

export default function VideoPlayer({ recordingId, recording, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  useEffect(() => {
    // Load video content
    if (!recording) {
      toast({
        title: "Error",
        description: "Recording not found",
        variant: "destructive",
      });
      onClose();
      return;
    }
    
    loadVideo();
    
    // Clean up on unmount
    return () => {
      if (videoRef.current?.src.startsWith('blob:')) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, [recordingId, recording, onClose]);
  
  const loadVideo = async () => {
    // For sample recordings, use a sample video
    if (recording.id <= 5) {
      if (videoRef.current) {
        videoRef.current.src = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4";
        
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                setIsPlaying(true);
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
    
    try {
      // Check if it's a valid data URL
      if (!storedVideoData.startsWith('data:')) {
        throw new Error('Invalid data format');
      }
      
      // Create a blob URL directly from the data URL
      const response = await fetch(storedVideoData);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      if (videoRef.current) {
        videoRef.current.src = blobUrl;
        
        // Play the video after source is set
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play()
            .then(() => {
              setIsPlaying(true);
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
        
        videoRef.current.onerror = () => {
          toast({
            title: "Video Error",
            description: "The video file appears to be corrupted",
            variant: "destructive",
          });
        };
      }
    } catch (error) {
      console.error('Error processing video data:', error);
      toast({
        title: "Playback Error",
        description: "Could not process the video. The format may be unsupported.",
        variant: "destructive",
      });
    }
  };
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };
  
  const togglePlay = () => {
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
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };
  
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
  };
  
  const handleSkipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };
  
  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };
  
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };
  
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
  
  return (
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
                    onClick={togglePlay}
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
                    onClick={onClose}
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
            {recording?.title}
          </h3>
          <p className="text-sm text-gray-300">
            Recorded on {recording?.date} at {recording?.time}
          </p>
        </div>
      </div>
    </div>
  );
} 
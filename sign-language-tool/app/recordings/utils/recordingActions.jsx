'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Play, Video, Trash2, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { playRecording, downloadRecording, deleteRecording } from './videoPlayback';

/**
 * Recording Actions component provides buttons for controlling recordings
 */
export function RecordingActions({ 
  recording,
  recordingsData, 
  toggleVideoPlayer, 
  setUserRecordings,
  currentlyPlaying,
  isPlaying,
  editCallback,
  className = ""
}) {
  const handlePlay = (e) => {
    e.stopPropagation();
    playRecording(recording.id, recordingsData, toggleVideoPlayer, toast);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    downloadRecording(recording.id, recordingsData, toast);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete this recording?`)) {
      deleteRecording(recording.id, recordingsData, setUserRecordings, toast);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (recording.id <= 5) {
      toast({
        title: "Sample Recording",
        description: "Sample recordings cannot be edited",
        variant: "destructive",
      });
      return;
    }
    if (editCallback) {
      editCallback(recording.id);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    toast({
      title: "Share Options",
      description: "Sharing functionality will be available in a future update",
    });
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700"
        onClick={handlePlay}
      >
        <Video className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-700"
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

/**
 * Dialog Recording Actions for use in dialog views
 */
export function DialogRecordingActions({ recording, recordingsData }) {
  const handleDownload = (e) => {
    e.stopPropagation();
    downloadRecording(recording.id, recordingsData, toast);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    toast({
      title: "Share Options",
      description: "Sharing functionality will be available in a future update",
    });
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
} 
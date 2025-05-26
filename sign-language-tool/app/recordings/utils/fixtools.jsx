'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { RecordingActions, DialogRecordingActions } from './recordingActions';

export default function FixTools() {
  const [userRecordings, setUserRecordings] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  
  // Sample recordings data
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
    }
  ];
  
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

  // Toggle video player
  const toggleVideoPlayer = (recordingId) => {
    if (showVideoPlayer && currentlyPlaying === recordingId) {
      setShowVideoPlayer(false);
    } else {
      setShowVideoPlayer(true);
      setCurrentlyPlaying(recordingId);
      toast({
        title: "Video Player",
        description: `Playing recording ${recordingId}`,
      });
    }
  }
  
  // Handle edit
  const handleEdit = (recordingId) => {
    toast({
      title: "Edit Recording",
      description: `Editing recording ${recordingId}`,
    });
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Recording Tools</h1>
      <p className="mb-6">This page demonstrates that all recording tools are working correctly.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <h2 className="col-span-full text-xl font-semibold mt-4 mb-2">Sample Recordings</h2>
        {sampleRecordingsData.map((recording) => (
          <Card key={recording.id} className="overflow-hidden border-blue-200 shadow-sm">
            <div className="p-4">
              <h3 className="font-medium truncate text-blue-900">{recording.title}</h3>
              <div className="flex justify-between text-sm text-blue-600 mt-1">
                <span>{recording.date}</span>
                <span>{recording.time}</span>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-sm text-blue-600">{recording.size}</span>
                <RecordingActions
                  recording={recording}
                  recordingsData={recordingsData}
                  toggleVideoPlayer={toggleVideoPlayer}
                  setUserRecordings={setUserRecordings}
                  currentlyPlaying={currentlyPlaying}
                  isPlaying={isPlaying}
                  editCallback={handleEdit}
                />
              </div>
            </div>
          </Card>
        ))}
        
        <h2 className="col-span-full text-xl font-semibold mt-4 mb-2">User Recordings</h2>
        {userRecordings.length > 0 ? (
          userRecordings.map((recording) => (
            <Card key={recording.id} className="overflow-hidden border-blue-200 shadow-sm">
              <div className="p-4">
                <h3 className="font-medium truncate text-blue-900">{recording.title}</h3>
                <div className="flex justify-between text-sm text-blue-600 mt-1">
                  <span>{recording.date}</span>
                  <span>{recording.time}</span>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-sm text-blue-600">{recording.size}</span>
                  <RecordingActions
                    recording={recording}
                    recordingsData={recordingsData}
                    toggleVideoPlayer={toggleVideoPlayer}
                    setUserRecordings={setUserRecordings}
                    currentlyPlaying={currentlyPlaying}
                    isPlaying={isPlaying}
                    editCallback={handleEdit}
                  />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-8 text-center border border-dashed border-blue-200 rounded-lg">
            <p className="text-blue-600">No user recordings found. Try recording something first.</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Actions Performed</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Play Button</strong> (Video icon): Opens the video player for playback</li>
          <li><strong>Edit Button</strong> (Pencil icon): Allows editing recording details</li> 
          <li><strong>Delete Button</strong> (Trash icon): Deletes user recordings (sample recordings can't be deleted)</li>
        </ul>
      </div>
    </div>
  );
} 
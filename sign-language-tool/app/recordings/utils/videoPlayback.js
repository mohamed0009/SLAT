/**
 * Helper functions for recordings page video playback
 */

/**
 * Plays a recording - either a video or audio file
 * @param {number} recordingId - The ID of the recording to play
 * @param {Array} recordingsData - The array of recordings data
 * @param {Function} toggleVideoPlayer - Function to open the video player
 * @param {Function} toast - Toast notification function
 * @returns {void}
 */
export function playRecording(recordingId, recordingsData, toggleVideoPlayer, toast) {
  // Find the recording
  const recording = recordingsData.find(r => r.id === recordingId);
  if (!recording) {
    console.error('Recording not found:', recordingId);
    return false;
  }
  
  console.log('Playing recording:', recording.id, recording.title);
  
  // For user recordings (ID > 5), use the video player
  if (recording.id > 5) {
    toggleVideoPlayer(recordingId);
    return true;
  }
  
  // For sample recordings, use the video player with sample content
  toggleVideoPlayer(recordingId);
  return true;
}

/**
 * Downloads a recording 
 * @param {number} recordingId - The ID of the recording to download
 * @param {Array} recordingsData - The array of recordings data
 * @param {Function} toast - Toast notification function
 * @returns {void}
 */
export function downloadRecording(recordingId, recordingsData, toast) {
  // Find the recording
  const recording = recordingsData.find(r => r.id === recordingId);
  if (!recording) {
    toast({
      title: "Error",
      description: "Recording not found",
      variant: "destructive",
    });
    return false;
  }
  
  console.log('Downloading recording:', recording.id, recording.title);
  
  // For sample recordings (IDs 1-5), show a sample message
  if (recording.id <= 5) {
    toast({
      title: "Sample Recording",
      description: "Sample recordings cannot be downloaded",
      variant: "destructive",
    });
    return false;
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
    return false;
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
    return true;
  } catch (error) {
    console.error('Error downloading recording:', error);
    toast({
      title: "Download Failed",
      description: "Could not download the recording",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Deletes a recording
 * @param {number} recordingId - The ID of the recording to delete
 * @param {Array} recordingsData - The array of recordings data
 * @param {Function} setUserRecordings - State setter for user recordings
 * @param {Function} toast - Toast notification function
 * @returns {boolean} Whether the deletion was successful
 */
export function deleteRecording(recordingId, recordingsData, setUserRecordings, toast) {
  try {
    // For sample recordings, just show a message
    const recording = recordingsData.find(r => r.id === recordingId);
    if (!recording) {
      console.error('Recording not found:', recordingId);
      return false;
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
        const updatedRecordings = recordings.filter((r) => r.id !== recordingId);
        // Save back to localStorage
        localStorage.setItem('userRecordings', JSON.stringify(updatedRecordings));
        // Update state
        setUserRecordings(updatedRecordings);
      }
      
      toast({
        title: "Recording Deleted",
        description: "Your recording has been deleted",
      });
      return true;
    } else {
      // Sample recording
      toast({
        title: "Cannot Delete",
        description: "Sample recordings cannot be deleted",
        variant: "destructive",
      });
      return false;
    }
  } catch (error) {
    console.error('Error deleting recording:', error);
    return false;
  }
} 
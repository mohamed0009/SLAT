// Set welcome message time and initialize conversation
document.addEventListener('DOMContentLoaded', function() {
  // Set current time in welcome message
  const welcomeTimeElement = document.getElementById('welcomeMessageTime');
  if (welcomeTimeElement) {
    const now = new Date();
    welcomeTimeElement.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  
  // Load previous conversations from local storage
  loadConversationsFromLocalStorage();
  
  // Initialize video and detection automatically
  initializeVideoAndDetection();
});

// Function to initialize video and start detection
async function initializeVideoAndDetection() {
  try {
    // Get video element
    const video = document.getElementById('video');
    if (!video) return;

    // Get user media
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Update camera status
    const cameraStatus = document.getElementById('cameraStatus');
    if (cameraStatus) {
      cameraStatus.textContent = 'Active';
      cameraStatus.className = 'status-value active';
    }

    // Update status indicator
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    if (statusIndicator && statusText) {
      statusIndicator.classList.add('detecting');
      statusText.textContent = 'Detection Active';
    }

    // Start detection loop
    startDetectionLoop();
  } catch (error) {
    console.error('Error initializing video:', error);
    // Update status to show error
    const cameraStatus = document.getElementById('cameraStatus');
    if (cameraStatus) {
      cameraStatus.textContent = 'Error';
      cameraStatus.className = 'status-value error';
    }
  }
}

// Function to handle the detection loop
function startDetectionLoop() {
  // Update FPS counter
  let frameCount = 0;
  let lastTime = performance.now();
  
  function updateFPS() {
    const now = performance.now();
    const delta = now - lastTime;
    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta);
      document.getElementById('fps').textContent = fps;
      frameCount = 0;
      lastTime = now;
    }
    frameCount++;
  }

  // Detection loop
  function detectionLoop() {
    updateFPS();
    
    // Add your detection logic here
    // This is where you would process the video frame and update the UI
    
    // Continue the loop
    requestAnimationFrame(detectionLoop);
  }

  // Start the detection loop
  detectionLoop();
}

// Function to send text message
function sendTextMessage() {
  const textInput = document.getElementById('textInput');
  const messageContainer = document.getElementById('messageContainer');
  
  if (!textInput || !messageContainer) return;
  
  const text = textInput.value.trim();
  if (text === '') return;
  
  // Create message bubble
  addMessage(text);
  
  // Clear input field
  textInput.value = '';
}

// Function to add a message to the container and save to localStorage
function addMessage(text, isIncoming = false, timestamp = null, isAudio = false, audioData = null) {
  const messageContainer = document.getElementById('messageContainer');
  if (!messageContainer) return;
  
  // Use provided timestamp or create new one
  const messageTime = timestamp || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  if (isAudio && audioData) {
    // Create audio message
    createAudioMessage(audioData, isIncoming, messageTime);
  } else {
    // Create text message elements
    const messageBubble = document.createElement('div');
    messageBubble.className = `message-bubble ${isIncoming ? 'incoming' : 'outgoing'}`;
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    const messageTimeElement = document.createElement('div');
    messageTimeElement.className = 'message-time';
    messageTimeElement.textContent = messageTime;
    
    // Assemble and add to container
    messageBubble.appendChild(messageText);
    messageBubble.appendChild(messageTimeElement);
    messageContainer.appendChild(messageBubble);
    
    // Save to localStorage
    saveMessageToLocalStorage({
      type: 'text',
      text: text,
      isIncoming: isIncoming,
      timestamp: messageTime
    });
  }
  
  // No scrolling needed since overflow is hidden
  // messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Create an audio message with waveform visualization
function createAudioMessage(audioData, isIncoming = false, timestamp = null) {
  const messageContainer = document.getElementById('messageContainer');
  if (!messageContainer) return;
  
  // Use provided timestamp or create new one
  const messageTime = timestamp || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  // Create audio message elements
  const audioMessage = document.createElement('div');
  audioMessage.className = `audio-message ${isIncoming ? 'incoming' : 'outgoing'}`;
  
  const audioBubble = document.createElement('div');
  audioBubble.className = 'audio-bubble';
  
  // Play button
  const playButton = document.createElement('button');
  playButton.className = 'audio-btn play-btn';
  playButton.innerHTML = '<i class="fas fa-play"></i>';
  
  // Waveform visualization
  const waveform = document.createElement('div');
  waveform.className = 'waveform';
  
  // Create random waveform bars for visualization
  const barCount = 30;
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement('div');
    bar.className = 'waveform-bar';
    
    // Create a more realistic waveform pattern
    let height;
    
    // Center bars taller, edges shorter for a natural waveform look
    const position = Math.abs(i - barCount/2) / (barCount/2); // 0 at center, 1 at edges
    const randomFactor = Math.random() * 0.5; // Add some randomness
    
    if (i % 3 === 0) {
      // Every third bar is taller
      height = Math.round(70 - position * 40 + randomFactor * 20);
    } else if (i % 2 === 0) {
      // Every second bar is medium height
      height = Math.round(50 - position * 30 + randomFactor * 15);
    } else {
      // Others are shorter
      height = Math.round(30 - position * 20 + randomFactor * 10);
    }
    
    // Ensure minimum height
    height = Math.max(height, 15);
    
    bar.style.height = `${height}%`;
    waveform.appendChild(bar);
  }
  
  // Audio time display
  const audioTimeElement = document.createElement('div');
  audioTimeElement.className = 'audio-time';
  audioTimeElement.textContent = audioData.duration || '0:00';
  
  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-audio-btn';
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.title = 'Delete recording';
  
  // Create and set up audio element
  const audioElement = document.createElement('audio');
  audioElement.setAttribute('src', audioData.url);
  audioElement.setAttribute('preload', 'metadata');
  
  // Event handling
  playButton.addEventListener('click', function() {
    if (audioElement.paused) {
      // Stop any other playing audio
      document.querySelectorAll('audio').forEach(audio => {
        if (audio !== audioElement) {
          audio.pause();
          audio.currentTime = 0;
          // Reset other play buttons
          const otherPlayBtn = audio.parentElement.querySelector('.play-btn');
          if (otherPlayBtn) {
            otherPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            otherPlayBtn.classList.remove('playing');
          }
        }
      });
      
      audioElement.play();
      playButton.innerHTML = '<i class="fas fa-pause"></i>';
      playButton.classList.add('playing');
      audioBubble.classList.add('playing');
      
      // Set up waveform animation with staggered effect
      const bars = waveform.querySelectorAll('.waveform-bar');
      bars.forEach((bar, index) => {
        // Store original height for reset
        const originalHeight = bar.style.height;
        bar.setAttribute('data-original-height', originalHeight);
        
        // Set index as CSS variable for staggered animation
        bar.style.setProperty('--index', index);
        
        // Add slight randomization to make the animation more dynamic
        const randomDelay = Math.random() * 0.2;
        bar.style.animationDelay = `${index * 0.03 + randomDelay}s`;
      });
    } else {
      audioElement.pause();
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      playButton.classList.remove('playing');
      audioBubble.classList.remove('playing');
      
      // Reset waveform
      const bars = waveform.querySelectorAll('.waveform-bar');
      bars.forEach(bar => {
        const originalHeight = bar.getAttribute('data-original-height');
        if (originalHeight) {
          bar.style.height = originalHeight;
        }
        bar.style.animationDelay = '0s';
      });
    }
  });
  
  // When audio ends
  audioElement.addEventListener('ended', function() {
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.classList.remove('playing');
    audioBubble.classList.remove('playing');
    
    // Reset waveform
    const bars = waveform.querySelectorAll('.waveform-bar');
    bars.forEach(bar => {
      const originalHeight = bar.getAttribute('data-original-height');
      if (originalHeight) {
        bar.style.height = originalHeight;
      }
      bar.style.animationDelay = '0s';
    });
  });
  
  // Delete audio
  deleteButton.addEventListener('click', function() {
    if (confirm('Delete this audio message?')) {
      // Stop audio if playing
      audioElement.pause();
      
      // Remove from DOM
      audioMessage.remove();
      
      // Remove from localStorage
      removeAudioMessageFromLocalStorage(audioData.url);
      
      // Delete from server
      if (audioData.filename) {
        fetch('/delete_recording/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: audioData.filename })
        })
        .then(response => response.json())
        .then(data => {
          if (!data.success) {
            console.error('Error deleting recording:', data.error);
          }
        })
        .catch(error => console.error('Error:', error));
      }
    }
  });
  
  // Show delete button on hover
  audioBubble.addEventListener('mouseenter', function() {
    deleteButton.style.opacity = '1';
  });
  
  audioBubble.addEventListener('mouseleave', function() {
    deleteButton.style.opacity = '0';
  });
  
  // Add timestamp outside the bubble
  const messageTimeElement = document.createElement('div');
  messageTimeElement.className = 'message-time';
  messageTimeElement.textContent = messageTime;
  
  // Assemble and add to bubble
  audioBubble.appendChild(playButton);
  audioBubble.appendChild(waveform);
  audioBubble.appendChild(audioTimeElement);
  audioBubble.appendChild(deleteButton);
  audioBubble.appendChild(audioElement);
  
  // Add to message
  audioMessage.appendChild(audioBubble);
  audioMessage.appendChild(messageTimeElement);
  
  // Add to container
  messageContainer.appendChild(audioMessage);
  
  // Save to localStorage
  saveMessageToLocalStorage({
    type: 'audio',
    url: audioData.url,
    filename: audioData.filename,
    duration: audioData.duration,
    isIncoming: isIncoming,
    timestamp: messageTime
  });
  
  // Auto-play if it's an incoming message and auto-replay is enabled
  if (isIncoming) {
    // Small delay to ensure UI is updated first
    setTimeout(() => {
      playButton.click();
    }, 300);
  }
  
  return audioMessage;
}

// Setup audio recording
function setupAudioRecording() {
  const recordButton = document.getElementById('recordButton');
  if (!recordButton) return;
  
  let mediaRecorder;
  let audioChunks = [];
  let isRecording = false;
  let startTime;
  
  // Recording timer elements
  const recordingTimer = document.createElement('div');
  recordingTimer.className = 'recording-timer';
  recordingTimer.style.display = 'none';
  recordButton.parentNode.insertBefore(recordingTimer, recordButton.nextSibling);
  
  // Record button click handler
  recordButton.addEventListener('click', function() {
    if (!isRecording) {
      // Request microphone access
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          isRecording = true;
          
          // Add recording state UI
          recordButton.classList.add('recording');
          recordButton.innerHTML = '<i class="fas fa-stop"></i>';
          recordingTimer.style.display = 'inline-block';
          
          // Create ripple animation when recording starts
          const ripple = document.createElement('div');
          ripple.className = 'recording-ripple';
          recordButton.appendChild(ripple);
          
          // After animation completes, remove the element
          setTimeout(() => {
            if (ripple && ripple.parentNode) {
              ripple.parentNode.removeChild(ripple);
            }
          }, 700);
          
          startTime = Date.now();
          
          // Start timer with animated display
          const timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            // Animated update
            recordingTimer.textContent = '';
            recordingTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          }, 1000);
          
          recordingTimer.textContent = '0:00';
          recordingTimer.dataset.timerInterval = timerInterval;
          
          // Initialize media recorder with higher audio quality
          const options = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 };
          try {
            mediaRecorder = new MediaRecorder(stream, options);
          } catch (e) {
            // Fallback if preferred options aren't supported
            mediaRecorder = new MediaRecorder(stream);
          }
          
          audioChunks = [];
          
          // Start recording
          mediaRecorder.start();
          
          // Collect audio chunks
          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });
          
          // Handle recording stop
          mediaRecorder.addEventListener('stop', () => {
            // Create audio blob
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            
            // Create form data to send to server
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');
            
            // Show a loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';
            recordButton.parentNode.insertBefore(loadingIndicator, recordButton.nextSibling);
            
            // Upload to server
            fetch('/save_audio/', {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              // Remove loading indicator
              if (loadingIndicator.parentNode) {
                loadingIndicator.parentNode.removeChild(loadingIndicator);
              }
              
              if (data.success) {
                // Calculate duration
                const duration = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                // Add a subtle fade-in effect for the new message
                const messageContainer = document.getElementById('messageContainer');
                const originalScrollHeight = messageContainer.scrollHeight;
                
                // Create audio message
                const newMessage = createAudioMessage({
                  url: data.recording.url,
                  filename: data.recording.filename,
                  duration: durationStr
                });
                
                // Apply entrance animation
                if (newMessage) {
                  newMessage.style.opacity = '0';
                  newMessage.style.transform = 'translateY(20px)';
                  
                  // Start the animation in the next frame
                  requestAnimationFrame(() => {
                    newMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    newMessage.style.opacity = '1';
                    newMessage.style.transform = 'translateY(0)';
                  });
                }
              } else {
                console.error('Error saving audio:', data.error);
                alert('Error saving recording. Please try again.');
              }
            })
            .catch(error => {
              // Remove loading indicator
              if (loadingIndicator.parentNode) {
                loadingIndicator.parentNode.removeChild(loadingIndicator);
              }
              
              console.error('Error:', error);
              alert('Error uploading recording. Please try again.');
            });
            
            // Reset UI
            clearInterval(recordingTimer.dataset.timerInterval);
            recordingTimer.style.display = 'none';
            
            // Stop all tracks to release microphone
            stream.getTracks().forEach(track => track.stop());
          });
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
          alert('Cannot access microphone. Please check permissions and try again.');
        });
    } else {
      // Stop recording with transition effect
      isRecording = false;
      recordButton.classList.add('stopping');
      
      // Transition animation before actually stopping
      setTimeout(() => {
        recordButton.classList.remove('recording', 'stopping');
        recordButton.innerHTML = '<i class="fas fa-microphone"></i>';
        
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      }, 300);
    }
  });
}

// Local Storage Functions for conversation persistence
function saveMessageToLocalStorage(message) {
  // Get existing conversations
  const conversations = getConversationsFromLocalStorage();
  
  // Add the new message
  conversations.push({
    ...message,
    id: Date.now() // Add a unique ID
  });
  
  // Keep only the last 100 messages to prevent localStorage from getting too full
  if (conversations.length > 100) {
    conversations.shift();
  }
  
  // Save back to localStorage
  localStorage.setItem('conversations', JSON.stringify(conversations));
}

function getConversationsFromLocalStorage() {
  const savedConversations = localStorage.getItem('conversations');
  return savedConversations ? JSON.parse(savedConversations) : [];
}

function loadConversationsFromLocalStorage() {
  const conversations = getConversationsFromLocalStorage();
  
  if (conversations.length > 0) {
    // Clear welcome message if we're loading saved conversations
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
      // Keep the welcome message
      const welcomeMessage = messageContainer.querySelector('.message-bubble.incoming');
      if (welcomeMessage) {
        messageContainer.innerHTML = '';
        messageContainer.appendChild(welcomeMessage);
      }
    }
    
    // Add each message in order
    conversations.forEach(message => {
      if (message.type === 'text') {
        addMessage(message.text, message.isIncoming, message.timestamp);
      } else if (message.type === 'audio') {
        createAudioMessage({
          url: message.url,
          filename: message.filename,
          duration: message.duration
        }, message.isIncoming, message.timestamp);
      }
    });
  }
}

function removeAudioMessageFromLocalStorage(audioUrl) {
  // Get existing conversations
  const conversations = getConversationsFromLocalStorage();
  
  // Filter out the audio message with the given URL
  const filteredConversations = conversations.filter(message => 
    !(message.type === 'audio' && message.url === audioUrl)
  );
  
  // Save back to localStorage
  localStorage.setItem('conversations', JSON.stringify(filteredConversations));
}

function clearConversationsFromLocalStorage() {
  localStorage.removeItem('conversations');
} 
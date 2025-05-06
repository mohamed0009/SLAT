// Global variables
let stream = null;
let isDetecting = false;
let detectionInterval = null;
let startTime;
let statusIndicator = null;
let statusText = null;
let video = null;
let startDetectionBtn = null;
let endDetectionBtn = null;
let handDetected = false;
let handPositionGuide = null;
let modelReady = false;

class SignLanguageDetector {
    constructor() {
        this.model = null;
        this.isDetecting = false;
        this.hands = null;
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.lastPrediction = null;
        this.lastConfidence = 0;
        this.detectionHistory = [];
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.detectionStartTime = 0;
    }

    async initialize() {
        try {
            // Initialize MediaPipe Hands
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            // Initialize video stream
            this.video = document.getElementById('video');
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.video.srcObject = stream;
            await this.video.play();

            // Set up canvas dimensions
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            // Initialize model
            await this.loadModel();

            // Start FPS counter
            this.startFpsCounter();

            // Update status
            this.updateStatus('ready', 'System Ready');
            return true;
        } catch (error) {
            console.error('Initialization error:', error);
            this.updateStatus('error', 'Initialization Failed');
            return false;
        }
    }

    async loadModel() {
        try {
            // Load model weights from server
            const response = await fetch('/detection/load_model/');
            if (!response.ok) {
                throw new Error('Failed to load model');
            }
            
            // Update status
            this.updateStatus('pending', 'Model Loading...');
            
            // Model will be loaded on the server side
            this.model = true; // Just a flag to indicate model is loaded
            
            this.updateStatus('ready', 'Model Loaded');
        } catch (error) {
            console.error('Model loading error:', error);
            this.updateStatus('error', 'Model Loading Failed');
        }
    }

    async startDetection() {
        if (!this.isDetecting) {
            this.isDetecting = true;
            this.detectionStartTime = performance.now();
            this.updateStatus('active', 'Detecting...');
            this.detectFrame();
        }
    }

    stopDetection() {
        this.isDetecting = false;
        this.updateStatus('ready', 'Detection Stopped');
    }

    async detectFrame() {
        if (!this.isDetecting) return;

        try {
            // Draw video frame to canvas
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

            // Get hand landmarks
            const results = await this.hands.send({ image: this.canvas });
            
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];
                
                // Convert landmarks to format expected by model
                const processedLandmarks = this.processLandmarks(landmarks);
                
                // Send landmarks to server for prediction
                const response = await fetch('/detection/predict/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ landmarks: processedLandmarks })
                });

                if (response.ok) {
                    const result = await response.json();
                    this.handlePrediction(result);
                }
            } else {
                this.updateResult('No hand detected', 0);
            }

            // Continue detection loop
            requestAnimationFrame(() => this.detectFrame());
        } catch (error) {
            console.error('Detection error:', error);
            this.updateStatus('error', 'Detection Error');
        }
    }

    processLandmarks(landmarks) {
        // Convert landmarks to array of [x, y, z] coordinates
        return landmarks.map(landmark => [
            landmark.x,
            landmark.y,
            landmark.z
        ]);
    }

    handlePrediction(result) {
        const { prediction, confidence } = result;
        
        // Update UI with prediction
        this.updateResult(prediction, confidence);
        
        // Add to history
        this.addToHistory(prediction, confidence);
        
        // Update metrics
        this.updateMetrics();
    }

    updateResult(prediction, confidence) {
        const resultElement = document.getElementById('result');
        const confidenceBar = document.getElementById('confidenceBar');
        const confidenceValue = document.getElementById('confidenceValue');
        
        resultElement.textContent = prediction;
        confidenceBar.style.width = `${confidence * 100}%`;
        confidenceValue.textContent = `${(confidence * 100).toFixed(1)}%`;
        
        if (confidence > 0.7) {
            resultElement.classList.add('detected');
        } else {
            resultElement.classList.remove('detected');
        }
    }

    addToHistory(prediction, confidence) {
        const historyList = document.getElementById('detectionHistory');
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="history-time">${timeString}</span>
            <span class="history-sign">${prediction}</span>
            <span class="history-confidence">${(confidence * 100).toFixed(1)}%</span>
        `;
        
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Keep only last 10 items
        while (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    updateMetrics() {
        const detectionTime = document.getElementById('detectionTime');
        const accuracy = document.getElementById('accuracy');
        const fpsElement = document.getElementById('fps');
        
        // Update detection time
        const currentTime = performance.now();
        const elapsedTime = currentTime - this.detectionStartTime;
        detectionTime.textContent = `${elapsedTime.toFixed(0)}ms`;
        
        // Update FPS
        fpsElement.textContent = this.fps.toFixed(1);
        
        // Update accuracy (example calculation)
        const avgConfidence = this.detectionHistory.reduce((sum, item) => sum + item.confidence, 0) / this.detectionHistory.length;
        accuracy.textContent = `${(avgConfidence * 100).toFixed(1)}%`;
    }

    startFpsCounter() {
        const updateFps = () => {
            const now = performance.now();
            const elapsed = now - this.lastFpsUpdate;
            
            if (elapsed >= 1000) {
                this.fps = (this.frameCount * 1000) / elapsed;
                this.frameCount = 0;
                this.lastFpsUpdate = now;
            }
            
            this.frameCount++;
            requestAnimationFrame(updateFps);
        };
        
        updateFps();
    }

    updateStatus(status, message) {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        statusIndicator.className = 'status-indicator';
        statusIndicator.classList.add(status);
        statusText.textContent = message;
        
        // Update system status
        document.getElementById('cameraStatus').textContent = status;
        document.getElementById('modelStatus').textContent = this.model ? 'Loaded' : 'Not Loaded';
        document.getElementById('processingStatus').textContent = this.isDetecting ? 'Active' : 'Idle';
    }
}

// Initialize detector when page loads
document.addEventListener('DOMContentLoaded', () => {
    const detector = new SignLanguageDetector();
    
    // Initialize system
    detector.initialize().then(success => {
        if (success) {
            // Set up control buttons
            document.getElementById('startDetectionBtn').addEventListener('click', () => {
                detector.startDetection();
            });
            
            document.getElementById('endDetectionBtn').addEventListener('click', () => {
                detector.stopDetection();
            });
        }
    });
});

// Function to show/hide hand guidance
function showHandPositionGuide(show) {
  if (!handPositionGuide) return;
  
  const videoWrapper = document.querySelector('.video-wrapper');
  
  if (show) {
    handPositionGuide.style.display = 'flex';
    if (videoWrapper) videoWrapper.classList.add('show-guide');
  } else {
    handPositionGuide.style.display = 'none';
    if (videoWrapper) videoWrapper.classList.remove('show-guide');
  }
}

// Main initialization function
function initializeDetection() {
  console.log('Initializing detection system...');
  
  // Initialize video elements
  video = document.getElementById('video');
  startDetectionBtn = document.getElementById('startDetectionBtn');
  endDetectionBtn = document.getElementById('endDetectionBtn');
  statusIndicator = document.getElementById('statusIndicator');
  statusText = document.getElementById('statusText');
  handPositionGuide = document.getElementById('handPositionGuide');
  
  if (!video || !startDetectionBtn || !endDetectionBtn) {
    console.error('Required elements not found');
    return;
  }
  
  // Set up button event listeners
  startDetectionBtn.addEventListener('click', startDetection);
  endDetectionBtn.addEventListener('click', stopDetection);
  
  // Initialize camera
  initializeCamera();
  
  // Check model status
  checkModelStatus();
}

// Initialize camera
async function initializeCamera() {
  try {
    console.log('Initializing camera...');
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      } 
    });
    
    if (video) {
      video.srcObject = stream;
      await video.play();
      
      // Enable start detection button once camera is ready
      if (startDetectionBtn) {
        startDetectionBtn.disabled = false;
      }
      
      updateStatus('ready', 'Camera Ready');
      console.log('Camera initialized successfully');
    }
  } catch (err) {
    console.error('Error accessing camera:', err);
    updateStatus('error', 'Camera Error');
    alert('Unable to access camera. Please check permissions and try again.');
  }
}

// Check if the model is properly loaded
function checkModelStatus() {
  console.log('Checking model status...');
  updateStatus('modelStatus', 'pending', 'Loading...');
  
  fetch('/api/model_info/')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Model info:', data);
      if (data.success && data.info.ready) {
        modelReady = true;
        updateStatus('modelStatus', 'active', 'Loaded');
        
        // Optional: Show model details
        const modelType = data.info.model_type || 'Unknown';
        const isFallback = data.info.is_fallback;
        
        if (isFallback) {
          updateStatus('modelStatus', 'pending', 'Fallback');
          console.warn('Using fallback model - accuracy may be reduced');
        }
      } else {
        modelReady = false;
        updateStatus('modelStatus', 'error', 'Error');
        console.error('Model not ready:', data.status || 'Unknown error');
      }
    })
    .catch(error => {
      console.error('Error checking model status:', error);
      modelReady = false;
      updateStatus('modelStatus', 'error', 'Error');
    });
}

// Helper function to update status elements with more detailed info
function updateStatus(status, text) {
  const statusIndicator = document.querySelector('.status-indicator');
  const statusText = document.querySelector('.status-text');
  
  if (statusIndicator && statusText) {
    // Remove all status classes
    statusIndicator.classList.remove('active', 'detecting', 'error');
    
    // Add appropriate class
    statusIndicator.classList.add(status);
    
    // Update text with animation
    statusText.style.opacity = '0';
    setTimeout(() => {
      statusText.textContent = text;
      statusText.style.opacity = '1';
    }, 200);
  }
}

// Process video frames for detection
function processFrame() {
  if (!isDetecting || !video || !modelReady) return;
  
  try {
    // Create canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Convert canvas to base64 image
    const imageData = canvas.toDataURL('image/jpeg');
    
    // Send frame for prediction
    fetch('/api/predict/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        updateResult(data.prediction, data.confidence);
        addToHistory(data.prediction, data.confidence);
      } else {
        console.error('Prediction error:', data.error);
        updateStatus('error', 'Prediction Error');
      }
    })
    .catch(error => {
      console.error('Error processing frame:', error);
      updateStatus('error', 'Processing Error');
    });
  } catch (error) {
    console.error('Error in processFrame:', error);
    updateStatus('error', 'Frame Error');
  }
}

// Update result display
function updateResult(action, confidence) {
  const resultText = document.querySelector('.result-text');
  const confidenceMeter = document.querySelector('.confidence-meter');
  
  if (resultText) {
    resultText.textContent = action;
    resultText.classList.add('detected');
    setTimeout(() => {
      resultText.classList.remove('detected');
    }, 500);
  }
  
  if (confidenceMeter) {
    const progress = confidenceMeter.querySelector('.progress');
    if (progress) {
      progress.style.width = `${confidence * 100}%`;
    }
  }
}

// Add detection to history
function addToHistory(sign, confidence) {
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  
  historyItem.innerHTML = `
    <span class="history-time">${timeString}</span>
    <span class="history-sign">${sign}</span>
    <span class="history-confidence">${confidence}%</span>
  `;
  
  const detectionHistory = document.getElementById('detectionHistory');
  if (detectionHistory) {
    // Add to the top of the list
    detectionHistory.prepend(historyItem);
    
    // Keep only the last 10 items
    if (detectionHistory.children.length > 10) {
      detectionHistory.removeChild(detectionHistory.lastChild);
    }
  }
}

// Initialize detection when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - initializing detection');
  initializeDetection();
}); 
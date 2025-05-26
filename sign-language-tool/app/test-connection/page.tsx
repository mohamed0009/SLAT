'use client';

import { useState, useEffect } from 'react';
import { backendApiService } from '../../services/backend-api';
import signLanguageApi from '../../services/api';
import { mediaPipeService } from '../../services/mediapipe-service';
import MediaPipeStatus from '../../components/MediaPipeStatus';

export default function TestConnection() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);
  const [mediaPipeStatus, setMediaPipeStatus] = useState<any>(null);

  useEffect(() => {
    testConnection();
    updateMediaPipeStatus();
  }, []);

  const updateMediaPipeStatus = () => {
    const status = mediaPipeService.getStatus();
    setMediaPipeStatus(status);
  };

  const testConnection = async () => {
    try {
      setConnectionStatus('Testing connection...');
      setError(null);

      // Test health endpoint
      console.log('Testing health endpoint...');
      const isHealthy = await backendApiService.checkHealth();
      console.log('Health check result:', isHealthy);

      if (isHealthy) {
        setConnectionStatus('✅ Connected to Django backend!');
        
        // Get model info
        const modelData = await backendApiService.getModelInfo();
        setModelInfo(modelData);
        
        // Test health endpoint directly
        try {
          const healthResponse = await signLanguageApi.healthCheck();
          setHealthStatus(healthResponse.data);
        } catch (healthError) {
          console.error('Health endpoint error:', healthError);
        }
      } else {
        setConnectionStatus('❌ Failed to connect to Django backend');
        setError('Backend API is not available');
      }
    } catch (err: any) {
      console.error('Connection test error:', err);
      setConnectionStatus('❌ Connection failed');
      setError(err.message || 'Unknown error occurred');
    }
  };

  const testPrediction = async () => {
    try {
      setError(null);
      console.log('Testing prediction endpoint...');
      
      // Test with mock landmarks
      const mockLandmarks = Array.from({ length: 21 }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        z: Math.random() * 0.1
      }));

      const result = await backendApiService.detectSignFromLandmarks(mockLandmarks);
      console.log('Prediction result:', result);
      
      if (result) {
        alert(`Prediction successful! Letter: ${result.letter}, Confidence: ${result.confidence.toFixed(2)}`);
      } else {
        alert('Prediction failed - check console for details');
      }
    } catch (err: any) {
      console.error('Prediction test error:', err);
      setError(`Prediction error: ${err.message}`);
    }
  };

  const testMediaPipe = async () => {
    try {
      setError(null);
      console.log('Testing MediaPipe...');
      
      // Create a test canvas
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      // Draw a simple test pattern
      if (ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(200, 150, 240, 180);
      }
      
      const result = await mediaPipeService.detectHandLandmarks(canvas);
      console.log('MediaPipe test result:', result);
      
      if (result) {
        alert(`MediaPipe test successful! Found ${result.landmarks.length} landmarks with confidence ${result.confidence.toFixed(2)}`);
      } else {
        alert('MediaPipe test failed - no landmarks detected');
      }
      
      updateMediaPipeStatus();
    } catch (err: any) {
      console.error('MediaPipe test error:', err);
      setError(`MediaPipe error: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Django Backend Connection Test</h1>
      
      <div className="space-y-6">
        {/* MediaPipe Status */}
        <MediaPipeStatus onRetry={updateMediaPipeStatus} />

        {/* Connection Status */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg mb-4">{connectionStatus}</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="space-x-2">
            <button 
              onClick={testConnection}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Test Connection
            </button>
            
            <button 
              onClick={testPrediction}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Test Prediction
            </button>
            
            <button 
              onClick={testMediaPipe}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Test MediaPipe
            </button>
          </div>
        </div>

        {/* Health Status */}
        {healthStatus && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">Health Status</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          </div>
        )}

        {/* Model Info */}
        {modelInfo && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">Model Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(modelInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* MediaPipe Status Details */}
        {mediaPipeStatus && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">MediaPipe Status Details</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(mediaPipeStatus, null, 2)}
            </pre>
          </div>
        )}

        {/* Backend Service Status */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Backend Service Status</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(backendApiService.getStatus(), null, 2)}
          </pre>
        </div>

        {/* API Endpoints */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Available API Endpoints</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><code>GET /app/api/health/</code> - Health check</li>
            <li><code>GET /app/api/model-info/</code> - Model information</li>
            <li><code>POST /app/api/detect-sign/</code> - Sign detection</li>
            <li><code>POST /app/predict/</code> - Prediction endpoint</li>
            <li><code>GET /app/get_recordings/</code> - Get recordings</li>
            <li><code>POST /app/record_audio/</code> - Record audio</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
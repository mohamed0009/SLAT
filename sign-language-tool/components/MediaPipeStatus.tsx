'use client';

import { useState, useEffect } from 'react';
import { mediaPipeService } from '../services/mediapipe-service';

interface MediaPipeStatusProps {
  onRetry?: () => void;
}

export default function MediaPipeStatus({ onRetry }: MediaPipeStatusProps) {
  const [status, setStatus] = useState<any>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const currentStatus = mediaPipeService.getStatus();
    setStatus(currentStatus);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const success = await mediaPipeService.retryInitialization();
      if (success) {
        console.log('MediaPipe retry successful');
      }
      updateStatus();
      if (onRetry) {
        onRetry();
      }
    } catch (error) {
      console.error('MediaPipe retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  if (!status) {
    return null;
  }

  const getStatusColor = () => {
    if (status.isInitialized) return 'text-green-600';
    if (status.fallbackMode) return 'text-yellow-600';
    if (status.isLoading) return 'text-blue-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (status.isInitialized) return '✅';
    if (status.fallbackMode) return '⚠️';
    if (status.isLoading) return '🔄';
    return '❌';
  };

  const getStatusMessage = () => {
    if (status.isInitialized) return 'MediaPipe initialized successfully';
    if (status.fallbackMode) return 'MediaPipe in fallback mode (using mock data)';
    if (status.isLoading) return 'Initializing MediaPipe...';
    return 'MediaPipe initialization failed';
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatusMessage()}
          </span>
        </div>
        
        {(!status.isInitialized && !status.isLoading) && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
      </div>

      {/* Detailed status for debugging */}
      <div className="mt-2 text-sm text-gray-600">
        <div>Attempts: {status.initializationAttempts}/{status.maxAttempts}</div>
        
        {status.lastError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <div className="font-medium text-red-800">Error Details:</div>
            <div className="text-red-700">{status.lastError.message}</div>
            <div className="text-xs text-red-600 mt-1">Type: {status.lastError.type}</div>
          </div>
        )}

        {status.fallbackMode && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="font-medium text-yellow-800">Fallback Mode Active</div>
            <div className="text-yellow-700">
              Using mock hand landmarks for testing. Some features may be limited.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
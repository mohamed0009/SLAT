'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Global error handler for MediaPipe errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Check if this is a MediaPipe-related error
      const errorMessage = args.join(' ');
      if (errorMessage.includes('MediaPipe') || 
          errorMessage.includes('mediapipe') ||
          errorMessage.includes('Failed to initialize')) {
        // Suppress MediaPipe errors and convert to debug
        console.debug('MediaPipe error suppressed:', ...args);
        return;
      }
      // Allow other errors to pass through
      originalConsoleError.apply(console, args);
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('MediaPipe') || 
          event.reason?.message?.includes('mediapipe') ||
          event.reason?.message?.includes('Failed to initialize')) {
        console.debug('MediaPipe promise rejection suppressed:', event.reason);
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
} 
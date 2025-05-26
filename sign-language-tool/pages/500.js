import React from 'react';

export default function Custom500() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
    }}>
      <div style={{
        backgroundColor: '#FEE2E2',
        padding: '16px',
        borderRadius: '50%',
        marginBottom: '24px'
      }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#DC2626" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </div>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '600' }}>
        500 - Server Error
      </h1>
      <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>
        Our server encountered an error. We're working on fixing the issue.
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer'
        }}
      >
        Return Home
      </button>
    </div>
  );
} 
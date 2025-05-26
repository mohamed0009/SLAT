import React from 'react';

export default function Custom404() {
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
        backgroundColor: '#E0F2FE',
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
          stroke="#0284C7" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      </div>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', fontWeight: '600' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px' }}>
        Sorry, we couldn't find the page you're looking for.
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
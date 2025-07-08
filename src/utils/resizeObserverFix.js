import React, { useRef, useState, useEffect, useCallback } from 'react';
/**
 * ResizeObserver Error Handler
 * Suppresses the common "ResizeObserver loop completed with undelivered notifications" error
 * that occurs with recharts ResponsiveContainer and similar components
 */

// Debounce utility for resize events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Suppress ResizeObserver errors
export const suppressResizeObserverErrors = () => {
  // Store original error handler
  const originalError = window.onerror;
  const originalUnhandledRejection = window.onunhandledrejection;

  // Override error handler to filter ResizeObserver errors
  window.onerror = (message, source, lineno, colno, error) => {
    // Check if error is related to ResizeObserver
    if (
      typeof message === 'string' && (message.includes('ResizeObserver loop completed with undelivered notifications') ||
       message.includes('ResizeObserver loop limit exceeded'))
    ) {
      // Suppress the error by returning true
      return true;
    }
    
    // Call original error handler for other errors
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Handle promise rejections that might contain ResizeObserver errors
  window.onunhandledrejection = (event) => {
    if (
      event?.reason?.message?.includes?.('ResizeObserver') ||
      event?.reason?.toString?.()?.includes?.('ResizeObserver')
    ) {
      event.preventDefault();
      return;
    }
    
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };
};

// Create a wrapper component for ResponsiveContainer to handle resize issues
export const createResizeObserverWrapper = (Component) => {
  return function WrappedComponent(props) {
    const containerRef = React.useRef(null);
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver(
        debounce((entries) => {
          if (entries[0]) {
            const { width, height } = entries[0].contentRect;
            setDimensions({ width, height });
          }
        }, 100) // 100ms debounce
      );

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    return (
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <Component {...props} width={dimensions.width} height={dimensions.height} />
      </div>
    );
  };
};

// Hook for debounced window resize
export const useDebounceResize = (callback, delay = 100) => {
  const debouncedCallback = React.useCallback(
    debounce(callback, delay),
    [callback, delay]
  );

  React.useEffect(() => {
    window.addEventListener('resize', debouncedCallback);
    return () => window.removeEventListener('resize', debouncedCallback);
  }, [debouncedCallback]);
};
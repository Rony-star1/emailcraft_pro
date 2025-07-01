import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const ErrorAlert = ({ message, onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible 
          ? 'translate-y-0 opacity-100 scale-100' :'-translate-y-2 opacity-0 scale-95'
        }
      `}
    >
      <div className="bg-error-50 border border-error-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          {/* Error Icon */}
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-error-100 rounded-full flex items-center justify-center">
              <Icon 
                name="AlertTriangle" 
                size={14} 
                className="text-error-600" 
              />
            </div>
          </div>

          {/* Error Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-error-800 mb-1">
              Authentication Error
            </h4>
            <p className="text-sm text-error-700">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="
                inline-flex rounded-md p-1.5 
                text-error-400 hover:text-error-600 
                hover:bg-error-100 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-error-600 focus:ring-offset-2 focus:ring-offset-error-50
              "
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="mt-3">
            <div className="bg-error-200 rounded-full h-1 overflow-hidden">
              <div 
                className="h-full bg-error-500 rounded-full transition-all ease-linear"
                style={{
                  width: isVisible ? '0%' : '100%',
                  transitionDuration: `${duration}ms`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
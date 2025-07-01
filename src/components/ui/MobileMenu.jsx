import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MobileMenu = ({ isOpen, onClose, navigationItems, currentPath }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActiveRoute = (path) => {
    return currentPath === path;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1020 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-64 bg-surface shadow-elevation-3 transform transition-transform animate-slide-in-left">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Mail" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-text-primary font-heading">
                EmailCraft Pro
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2"
              aria-label="Close navigation menu"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isActiveRoute(item.path)
                    ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                }`}
                aria-current={isActiveRoute(item.path) ? 'page' : undefined}
              >
                <Icon name={item.icon} size={20} />
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-text-muted mt-0.5">
                    {item.tooltip}
                  </span>
                </div>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => handleNavigation('/account-settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActiveRoute('/account-settings')
                  ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <Icon name="Settings" size={20} />
              <div className="flex flex-col">
                <span className="font-medium">Settings</span>
                <span className="text-xs text-text-muted mt-0.5">
                  Account configuration and preferences
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
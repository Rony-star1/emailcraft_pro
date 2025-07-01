import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const UserProfileDropdown = ({ user, isOpen, onToggle, onLogout }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleSettingsClick = () => {
    navigate('/account-settings');
    onToggle();
  };

  const handleLogoutClick = () => {
    onLogout();
    onToggle();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <Button
        variant="ghost"
        onClick={onToggle}
        className="flex items-center space-x-2 p-2 hover:bg-secondary-50 focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary-100 flex items-center justify-center">
          <Image
            src={user.avatar}
            alt={`${user.name} avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-text-primary truncate max-w-32">
            {user.name}
          </div>
          <div className="text-xs text-text-secondary truncate max-w-32">
            {user.email}
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface rounded-md shadow-elevation-3 border border-border z-1010 animate-fade-in">
          <div className="py-1">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary-100 flex items-center justify-center">
                  <Image
                    src={user.avatar}
                    alt={`${user.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-text-secondary truncate">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-micro focus:outline-none focus:bg-secondary-50"
                role="menuitem"
              >
                <Icon name="Settings" size={16} className="mr-3" />
                Account Settings
              </button>
              
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-2 text-sm text-error hover:bg-error-50 transition-micro focus:outline-none focus:bg-error-50"
                role="menuitem"
              >
                <Icon name="LogOut" size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
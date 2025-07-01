import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  const currentUser = {
    name: 'John Doe',
    lastLogin: new Date(Date.now() - 3600000)
  };

  const formatLastLogin = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-100 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            {getGreeting()}, {currentUser.name}! 👋
          </h1>
          <p className="text-text-secondary mb-4">
            Welcome back to your email marketing dashboard. Here's what's happening with your campaigns.
          </p>
          <div className="flex items-center space-x-1 text-sm text-text-muted">
            <Icon name="Clock" size={14} />
            <span>Last login: {formatLastLogin(currentUser.lastLogin)}</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full">
          <Icon name="TrendingUp" size={32} className="text-primary-600" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
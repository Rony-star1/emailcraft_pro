import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'campaign_sent',
      title: 'Summer Sale Campaign',
      description: 'Sent to 1,247 subscribers',
      timestamp: new Date(Date.now() - 300000),
      icon: 'Send',
      color: 'primary'
    },
    {
      id: 2,
      type: 'email_opened',
      title: 'Welcome Series - Email 2',
      description: '23 new opens in the last hour',
      timestamp: new Date(Date.now() - 900000),
      icon: 'Mail',
      color: 'success'
    },
    {
      id: 3,
      type: 'contact_added',
      title: 'New Subscribers',
      description: '5 new contacts added via signup form',
      timestamp: new Date(Date.now() - 1800000),
      icon: 'UserPlus',
      color: 'accent'
    },
    {
      id: 4,
      type: 'campaign_clicked',
      title: 'Product Launch Newsletter',
      description: '12 clicks on main CTA button',
      timestamp: new Date(Date.now() - 3600000),
      icon: 'MousePointer',
      color: 'warning'
    },
    {
      id: 5,
      type: 'unsubscribe',
      title: 'Unsubscribe Event',
      description: '2 contacts unsubscribed from Weekly Updates',
      timestamp: new Date(Date.now() - 7200000),
      icon: 'UserMinus',
      color: 'error'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'bg-success-50 text-success-600 border-success-100';
      case 'warning':
        return 'bg-warning-50 text-warning-600 border-warning-100';
      case 'error':
        return 'bg-error-50 text-error-600 border-error-100';
      case 'accent':
        return 'bg-accent-50 text-accent-600 border-accent-100';
      default:
        return 'bg-primary-50 text-primary-600 border-primary-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
          <button className="text-sm text-primary hover:text-primary-700 font-medium transition-micro">
            View All
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-secondary-50 transition-micro">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 ${getColorClasses(activity.color)}`}>
                <Icon name={activity.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {activity.title}
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
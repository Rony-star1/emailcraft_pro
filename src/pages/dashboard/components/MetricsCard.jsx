import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success-50 text-success-600 border-success-100';
      case 'warning':
        return 'bg-warning-50 text-warning-600 border-warning-100';
      case 'error':
        return 'bg-error-50 text-error-600 border-error-100';
      default:
        return 'bg-primary-50 text-primary-600 border-primary-100';
    }
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success-600';
    if (changeType === 'negative') return 'text-error-600';
    return 'text-text-secondary';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-standard">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-semibold text-text-primary mb-2">{value}</p>
          {change && (
            <div className="flex items-center space-x-1">
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={14} 
                className={getChangeColor()}
              />
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary',
    success: 'bg-success-100 text-success',
    accent: 'bg-accent-100 text-accent',
    warning: 'bg-warning-100 text-warning-600',
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-text-secondary mb-1">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
      <div className="mt-2 flex items-center text-sm">
        <Icon
          name={changeType === 'positive' ? 'ArrowUp' : 'ArrowDown'}
          size={16}
          className={`${changeType === 'positive' ? 'text-success' : 'text-error'} mr-1`}
        />
        <span className={`${changeType === 'positive' ? 'text-success' : 'text-error'} font-medium`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default MetricsCard;
import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsOverviewCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'primary' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-text-muted';
  };

  const getColorClasses = () => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary border-primary-100',
      success: 'bg-success-50 text-success border-success-100',
      warning: 'bg-warning-50 text-warning border-warning-100',
      error: 'bg-error-50 text-error border-error-100'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-standard">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
              <Icon name={icon} size={20} />
            </div>
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-text-primary">{value}</p>
            {subtitle && (
              <p className="text-sm text-text-muted">{subtitle}</p>
            )}
          </div>
        </div>

        {trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsOverviewCard;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ScheduleSettings = ({ scheduleType, onScheduleChange, scheduledDate, onDateChange, timezone, onTimezoneChange }) => {
  const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5' },
    { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 'UTC+0' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 'UTC+1' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 'UTC+9' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: 'UTC+11' }
  ];

  const scheduleOptions = [
    {
      value: 'immediate',
      title: 'Send Immediately',
      description: 'Send the campaign as soon as you click send',
      icon: 'Zap',
      recommended: false
    },
    {
      value: 'scheduled',
      title: 'Schedule for Later',
      description: 'Choose a specific date and time to send',
      icon: 'Calendar',
      recommended: true
    },
    {
      value: 'optimal',
      title: 'Optimal Send Time',
      description: 'AI determines the best time based on recipient behavior',
      icon: 'Brain',
      recommended: false
    }
  ];

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getOptimalSendTimes = () => {
    return [
      { time: '9:00 AM', day: 'Tuesday', engagement: '23%', reason: 'Highest open rates' },
      { time: '2:00 PM', day: 'Wednesday', engagement: '21%', reason: 'Peak engagement time' },
      { time: '10:00 AM', day: 'Thursday', engagement: '20%', reason: 'Best click-through rates' }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Schedule Options */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          When to Send
        </h3>
        
        <div className="space-y-4">
          {scheduleOptions.map((option) => (
            <div
              key={option.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                scheduleType === option.value
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
              }`}
              onClick={() => onScheduleChange(option.value)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon
                    name={scheduleType === option.value ? "CheckCircle" : "Circle"}
                    size={20}
                    className={scheduleType === option.value ? "text-primary" : "text-text-muted"}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name={option.icon} size={16} className="text-text-secondary" />
                    <h4 className="font-semibold text-text-primary">
                      {option.title}
                    </h4>
                    {option.recommended && (
                      <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Date/Time Settings */}
      {scheduleType === 'scheduled' && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Schedule Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Send Date & Time
              </label>
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => onDateChange(e.target.value)}
                min={getMinDateTime()}
                className="w-full"
              />
              {scheduledDate && (
                <p className="text-sm text-text-muted mt-2">
                  Scheduled for: {formatDateTime(scheduledDate)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Timezone
              </label>
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowTimezoneSelector(!showTimezoneSelector)}
                  className="w-full justify-between"
                  iconName="ChevronDown"
                  iconPosition="right"
                >
                  {timezones.find(tz => tz.value === timezone)?.label || 'Select Timezone'}
                </Button>
                
                {showTimezoneSelector && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-elevation-3 z-10 max-h-60 overflow-y-auto">
                    {timezones.map((tz) => (
                      <button
                        key={tz.value}
                        onClick={() => {
                          onTimezoneChange(tz.value);
                          setShowTimezoneSelector(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-secondary-50 transition-colors ${
                          timezone === tz.value ? 'bg-primary-50 text-primary' : 'text-text-primary'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{tz.label}</span>
                          <span className="text-sm text-text-muted">{tz.offset}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimal Send Time Suggestions */}
      {scheduleType === 'optimal' && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Icon name="Brain" size={20} />
            AI-Recommended Send Times
          </h3>
          
          <div className="space-y-3">
            <p className="text-sm text-text-secondary mb-4">
              Based on your audience's engagement patterns, here are the optimal send times:
            </p>
            
            {getOptimalSendTimes().map((suggestion, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg bg-gradient-to-r from-primary-50 to-accent-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text-primary">
                        {suggestion.day} at {suggestion.time}
                      </span>
                      <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                        {suggestion.engagement} engagement
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {suggestion.reason}
                    </p>
                  </div>
                  <Icon name="TrendingUp" size={20} className="text-success" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Additional Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Track Opens</h4>
              <p className="text-sm text-text-secondary">
                Monitor when recipients open your emails
              </p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Track Clicks</h4>
              <p className="text-sm text-text-secondary">
                Monitor link clicks within your emails
              </p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Auto-Unsubscribe</h4>
              <p className="text-sm text-text-secondary">
                Automatically include unsubscribe links
              </p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettings;
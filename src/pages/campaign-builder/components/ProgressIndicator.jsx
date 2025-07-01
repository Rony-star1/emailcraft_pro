import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentTab, completedTabs }) => {
  const steps = [
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'subject', label: 'Subject Line', icon: 'Type' },
    { id: 'recipients', label: 'Recipients', icon: 'Users' },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar' }
  ];

  const getStepStatus = (stepId) => {
    if (completedTabs.includes(stepId)) return 'completed';
    if (stepId === currentTab) return 'current';
    return 'pending';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white border-success';
      case 'current':
        return 'bg-primary text-white border-primary';
      default:
        return 'bg-secondary-100 text-text-muted border-border';
    }
  };

  const getConnectorClasses = (index) => {
    const nextStep = steps[index + 1];
    if (!nextStep) return '';
    
    const currentStatus = getStepStatus(steps[index].id);
    const nextStatus = getStepStatus(nextStep.id);
    
    if (currentStatus === 'completed') {
      return 'bg-success';
    }
    return 'bg-border';
  };

  const completionPercentage = (completedTabs.length / steps.length) * 100;

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Campaign Progress
        </h3>
        <div className="text-sm text-text-secondary">
          {completedTabs.length} of {steps.length} steps completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary-100 rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepClasses(status)}`}
                >
                  {status === 'completed' ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <Icon name={step.icon} size={20} />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    status === 'current' ? 'text-primary' : 
                    status === 'completed' ? 'text-success' : 'text-text-muted'
                  }`}>
                    {step.label}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${getConnectorClasses(index)}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Completion Status */}
      {completedTabs.length === steps.length && (
        <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-center gap-2 text-success-700">
            <Icon name="CheckCircle" size={20} />
            <span className="font-medium">
              Campaign is ready to send!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
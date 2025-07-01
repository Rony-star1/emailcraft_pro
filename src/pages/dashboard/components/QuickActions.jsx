import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      title: 'Create Campaign',
      description: 'Start a new email campaign',
      icon: 'Plus',
      variant: 'primary',
      onClick: () => navigate('/campaign-builder')
    },
    {
      id: 2,
      title: 'Manage Contacts',
      description: 'Add or organize your contacts',
      icon: 'Users',
      variant: 'secondary',
      onClick: () => navigate('/contact-management')
    },
    {
      id: 3,
      title: 'View Analytics',
      description: 'Check campaign performance',
      icon: 'BarChart3',
      variant: 'outline',
      onClick: () => navigate('/campaign-analytics')
    }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.onClick}
            iconName={action.icon}
            iconPosition="left"
            className="flex-col h-auto p-4 text-left justify-start"
            fullWidth
          >
            <div className="w-full">
              <div className="font-medium text-sm mb-1">{action.title}</div>
              <div className="text-xs opacity-80">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
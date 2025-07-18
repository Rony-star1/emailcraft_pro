import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Campaign',
      description: 'Start a new email campaign.',
      icon: 'MailPlus',
      color: 'primary',
      path: '/campaign-builder'
    },
    {
      title: 'Add Contacts',
      description: 'Import or add new contacts.',
      icon: 'UserPlus',
      color: 'accent',
      path: '/contact-management'
    },
    {
      title: 'View Reports',
      description: 'Analyze campaign performance.',
      icon: 'BarChart3',
      color: 'success',
      path: '/campaign-analytics'
    }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className={`group flex items-center p-4 rounded-lg transition-colors duration-300 bg-${action.color}-50 hover:bg-${action.color}-100 border border-${action.color}-100 hover:border-${action.color}-200 focus:outline-none focus:ring-2 focus:ring-${action.color}-500`}
          >
            <div className={`w-10 h-10 flex-shrink-0 rounded-full bg-white flex items-center justify-center mr-4`}>
              <Icon name={action.icon} size={20} className={`text-${action.color}`} />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">{action.title}</h4>
              <p className="text-sm text-text-secondary">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
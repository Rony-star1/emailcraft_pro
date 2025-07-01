import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactCard = ({ 
  contact, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  isExpanded, 
  onToggleExpand 
}) => {
  const getEngagementBadge = (status) => {
    const badges = {
      high: { color: 'bg-accent-100 text-accent-600', label: 'High' },
      medium: { color: 'bg-warning-100 text-warning-600', label: 'Medium' },
      low: { color: 'bg-secondary-100 text-secondary-600', label: 'Low' },
      none: { color: 'bg-error-100 text-error-600', label: 'None' }
    };
    
    const badge = badges[status] || badges.none;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-success-100 text-success-600', label: 'Active' },
      unsubscribed: { color: 'bg-error-100 text-error-600', label: 'Unsubscribed' },
      bounced: { color: 'bg-warning-100 text-warning-600', label: 'Bounced' }
    };
    
    const badge = badges[status] || badges.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="mt-1 rounded border-border focus:ring-primary focus:border-primary"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-text-primary truncate">{contact.name}</h3>
                <Button
                  variant="ghost"
                  onClick={onToggleExpand}
                  className="p-1 h-6 w-6 ml-2"
                >
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={14} 
                  />
                </Button>
              </div>
              <p className="text-sm text-text-secondary truncate mt-1">{contact.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusBadge(contact.status)}
                {getEngagementBadge(contact.engagement)}
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <div>
              <span className="text-xs font-medium text-text-secondary">Subscription Date:</span>
              <p className="text-sm text-text-primary">
                {new Date(contact.subscriptionDate).toLocaleDateString()}
              </p>
            </div>
            
            {contact.tags.length > 0 && (
              <div>
                <span className="text-xs font-medium text-text-secondary">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {contact.source && (
              <div>
                <span className="text-xs font-medium text-text-secondary">Source:</span>
                <p className="text-sm text-text-primary">{contact.source}</p>
              </div>
            )}

            {contact.lastActivity && (
              <div>
                <span className="text-xs font-medium text-text-secondary">Last Activity:</span>
                <p className="text-sm text-text-primary">
                  {new Date(contact.lastActivity).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-border">
          <Button
            variant="outline"
            onClick={onEdit}
            className="flex items-center space-x-1 text-sm px-3 py-1.5"
          >
            <Icon name="Edit2" size={14} />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            onClick={onDelete}
            className="flex items-center space-x-1 text-sm px-3 py-1.5 text-error border-error hover:bg-error-50"
          >
            <Icon name="Trash2" size={14} />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
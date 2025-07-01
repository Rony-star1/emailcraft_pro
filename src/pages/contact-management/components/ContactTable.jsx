import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ContactCard from './ContactCard';

const ContactTable = ({ 
  contacts, 
  selectedContacts, 
  onSelectContact, 
  onSelectAll, 
  onEditContact, 
  onDeleteContact,
  sortField,
  sortDirection,
  onSort,
  isMobile 
}) => {
  const [expandedContact, setExpandedContact] = useState(null);

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

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

  if (isMobile) {
    return (
      <div className="space-y-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            isSelected={selectedContacts.includes(contact.id)}
            onSelect={() => onSelectContact(contact.id)}
            onEdit={() => onEditContact(contact)}
            onDelete={() => onDeleteContact(contact.id)}
            isExpanded={expandedContact === contact.id}
            onToggleExpand={() => setExpandedContact(
              expandedContact === contact.id ? null : contact.id
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden shadow-elevation-1">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border focus:ring-primary focus:border-primary"
                />
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary p-0 h-auto"
                >
                  <span>Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('email')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary p-0 h-auto"
                >
                  <span>Email</span>
                  <Icon name={getSortIcon('email')} size={14} />
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('subscriptionDate')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary p-0 h-auto"
                >
                  <span>Subscription Date</span>
                  <Icon name={getSortIcon('subscriptionDate')} size={14} />
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-sm font-medium text-text-primary">Status</span>
              </th>
              <th className="text-left px-4 py-3">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('engagement')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary p-0 h-auto"
                >
                  <span>Engagement</span>
                  <Icon name={getSortIcon('engagement')} size={14} />
                </Button>
              </th>
              <th className="text-left px-4 py-3">
                <span className="text-sm font-medium text-text-primary">Tags</span>
              </th>
              <th className="w-24 px-4 py-3">
                <span className="text-sm font-medium text-text-primary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-secondary-50 transition-micro">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => onSelectContact(contact.id)}
                    className="rounded border-border focus:ring-primary focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-text-primary">{contact.name}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-text-secondary">{contact.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-text-secondary text-sm">
                    {new Date(contact.subscriptionDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(contact.status)}
                </td>
                <td className="px-4 py-3">
                  {getEngagementBadge(contact.engagement)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {contact.tags.length > 2 && (
                      <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-full">
                        +{contact.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      onClick={() => onEditContact(contact)}
                      className="p-1 h-8 w-8"
                      title="Edit contact"
                    >
                      <Icon name="Edit2" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => onDeleteContact(contact.id)}
                      className="p-1 h-8 w-8 text-error hover:text-error hover:bg-error-50"
                      title="Delete contact"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;
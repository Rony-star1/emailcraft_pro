import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ContactFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedSegment, 
  onSegmentChange, 
  selectedStatus, 
  onStatusChange, 
  selectedEngagement, 
  onEngagementChange, 
  onClearFilters,
  totalContacts,
  filteredCount 
}) => {
  const segments = [
    { value: 'all', label: 'All Segments' },
    { value: 'newsletter', label: 'Newsletter Subscribers' },
    { value: 'customers', label: 'Customers' },
    { value: 'prospects', label: 'Prospects' },
    { value: 'vip', label: 'VIP Members' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'unsubscribed', label: 'Unsubscribed' },
    { value: 'bounced', label: 'Bounced' }
  ];

  const engagementLevels = [
    { value: 'all', label: 'All Engagement' },
    { value: 'high', label: 'High Engagement' },
    { value: 'medium', label: 'Medium Engagement' },
    { value: 'low', label: 'Low Engagement' },
    { value: 'none', label: 'No Engagement' }
  ];

  const hasActiveFilters = searchTerm || selectedSegment !== 'all' || selectedStatus !== 'all' || selectedEngagement !== 'all';

  return (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="search"
              placeholder="Search contacts by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={selectedSegment}
            onChange={(e) => onSegmentChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:ring-primary focus:border-primary bg-surface"
          >
            {segments.map((segment) => (
              <option key={segment.value} value={segment.value}>
                {segment.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:ring-primary focus:border-primary bg-surface"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={selectedEngagement}
            onChange={(e) => onEngagementChange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm focus:ring-primary focus:border-primary bg-surface"
          >
            {engagementLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-sm px-3"
            >
              <Icon name="X" size={14} />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-sm text-text-secondary">
          Showing {filteredCount} of {totalContacts} contacts
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-primary-50 text-primary text-xs rounded-full">
              Filtered
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ContactFilters;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RecipientSelector = ({ selectedLists, onListChange, selectedSegments, onSegmentChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const contactLists = [
    {
      id: 'list-1',
      name: 'Newsletter Subscribers',
      count: 1247,
      lastUpdated: '2024-01-15',
      tags: ['newsletter', 'general'],
      description: 'General newsletter subscribers from website signup'
    },
    {
      id: 'list-2',
      name: 'Premium Customers',
      count: 342,
      lastUpdated: '2024-01-14',
      tags: ['premium', 'customers'],
      description: 'Customers who have purchased premium products'
    },
    {
      id: 'list-3',
      name: 'Webinar Attendees',
      count: 856,
      lastUpdated: '2024-01-13',
      tags: ['webinar', 'engaged'],
      description: 'People who attended our recent webinars'
    },
    {
      id: 'list-4',
      name: 'Trial Users',
      count: 523,
      lastUpdated: '2024-01-12',
      tags: ['trial', 'prospects'],
      description: 'Users currently on free trial'
    },
    {
      id: 'list-5',
      name: 'Blog Subscribers',
      count: 2103,
      lastUpdated: '2024-01-11',
      tags: ['blog', 'content'],
      description: 'Subscribers to our blog content'
    }
  ];

  const segmentOptions = [
    { id: 'active-30', label: 'Active in last 30 days', count: 892 },
    { id: 'high-engagement', label: 'High engagement rate', count: 456 },
    { id: 'new-subscribers', label: 'New subscribers (last 7 days)', count: 123 },
    { id: 'never-opened', label: 'Never opened emails', count: 234 },
    { id: 'location-us', label: 'Located in US', count: 1567 },
    { id: 'location-eu', label: 'Located in EU', count: 678 }
  ];

  const filteredLists = contactLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleListSelection = (listId) => {
    const newSelection = selectedLists.includes(listId)
      ? selectedLists.filter(id => id !== listId)
      : [...selectedLists, listId];
    onListChange(newSelection);
  };

  const toggleSegmentSelection = (segmentId) => {
    const newSelection = selectedSegments.includes(segmentId)
      ? selectedSegments.filter(id => id !== segmentId)
      : [...selectedSegments, segmentId];
    onSegmentChange(newSelection);
  };

  const getTotalRecipients = () => {
    const selectedListsData = contactLists.filter(list => selectedLists.includes(list.id));
    const baseCount = selectedListsData.reduce((sum, list) => sum + list.count, 0);
    
    // Apply segment filters (simplified calculation)
    const segmentMultiplier = selectedSegments.length > 0 ? 0.7 : 1;
    return Math.floor(baseCount * segmentMultiplier);
  };

  const selectAllLists = () => {
    const allListIds = filteredLists.map(list => list.id);
    onListChange(allListIds);
  };

  const clearAllLists = () => {
    onListChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-1">
              Campaign Recipients
            </h3>
            <p className="text-primary-700">
              {getTotalRecipients().toLocaleString()} contacts will receive this email
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {selectedLists.length}
            </div>
            <div className="text-sm text-primary-700">
              Lists Selected
            </div>
          </div>
        </div>
      </div>

      {/* Contact Lists */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Contact Lists
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAllLists}
              iconName="CheckSquare"
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllLists}
              iconName="Square"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <Input
              type="search"
              placeholder="Search contact lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lists */}
        <div className="space-y-3">
          {filteredLists.map((list) => (
            <div
              key={list.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedLists.includes(list.id)
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
              }`}
              onClick={() => toggleListSelection(list.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Icon
                      name={selectedLists.includes(list.id) ? "CheckSquare" : "Square"}
                      size={20}
                      className={selectedLists.includes(list.id) ? "text-primary" : "text-text-muted"}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-1">
                      {list.name}
                    </h4>
                    <p className="text-sm text-text-secondary mb-2">
                      {list.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {list.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-text-primary">
                    {list.count.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-muted">
                    contacts
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    Updated {list.lastUpdated}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segmentation Filters */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Audience Segments
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            iconName={showFilters ? "ChevronUp" : "ChevronDown"}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary mb-4">
              Apply additional filters to refine your audience
            </p>
            {segmentOptions.map((segment) => (
              <div
                key={segment.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedSegments.includes(segment.id)
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                }`}
                onClick={() => toggleSegmentSelection(segment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon
                      name={selectedSegments.includes(segment.id) ? "CheckSquare" : "Square"}
                      size={16}
                      className={selectedSegments.includes(segment.id) ? "text-primary" : "text-text-muted"}
                    />
                    <span className="text-sm font-medium text-text-primary">
                      {segment.label}
                    </span>
                  </div>
                  <span className="text-sm text-text-muted">
                    {segment.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          iconName="Upload"
          onClick={() => console.log('Import contacts')}
        >
          Import Contacts
        </Button>
        <Button
          variant="outline"
          iconName="Users"
          onClick={() => console.log('Manage lists')}
        >
          Manage Lists
        </Button>
        <Button
          variant="outline"
          iconName="Filter"
          onClick={() => console.log('Create segment')}
        >
          Create Segment
        </Button>
      </div>
    </div>
  );
};

export default RecipientSelector;
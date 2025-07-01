import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CampaignComparisonTable = () => {
  const [sortField, setSortField] = useState('sentDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale 2024',
      sentDate: '2024-01-15',
      recipients: 2450,
      delivered: 2398,
      opens: 1078,
      clicks: 324,
      unsubscribes: 12,
      bounces: 52,
      openRate: 45.0,
      clickRate: 13.5,
      unsubscribeRate: 0.5,
      bounceRate: 2.1,
      status: 'completed'
    },
    {
      id: 2,
      name: 'Product Launch Newsletter',
      sentDate: '2024-01-12',
      recipients: 1850,
      delivered: 1823,
      opens: 892,
      clicks: 267,
      unsubscribes: 8,
      bounces: 27,
      openRate: 48.9,
      clickRate: 14.6,
      unsubscribeRate: 0.4,
      bounceRate: 1.5,
      status: 'completed'
    },
    {
      id: 3,
      name: 'Weekly Digest #47',
      sentDate: '2024-01-10',
      recipients: 3200,
      delivered: 3145,
      opens: 1258,
      clicks: 377,
      unsubscribes: 15,
      bounces: 55,
      openRate: 40.0,
      clickRate: 12.0,
      unsubscribeRate: 0.5,
      bounceRate: 1.7,
      status: 'completed'
    },
    {
      id: 4,
      name: 'Holiday Special Offer',
      sentDate: '2024-01-08',
      recipients: 4100,
      delivered: 4021,
      opens: 2011,
      clicks: 603,
      unsubscribes: 18,
      bounces: 79,
      openRate: 50.0,
      clickRate: 15.0,
      unsubscribeRate: 0.4,
      bounceRate: 1.9,
      status: 'completed'
    },
    {
      id: 5,
      name: 'Customer Feedback Survey',
      sentDate: '2024-01-05',
      recipients: 1200,
      delivered: 1178,
      opens: 471,
      clicks: 94,
      unsubscribes: 5,
      bounces: 22,
      openRate: 40.0,
      clickRate: 8.0,
      unsubscribeRate: 0.4,
      bounceRate: 1.8,
      status: 'completed'
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectCampaign = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(filteredCampaigns.map(c => c.id));
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'sentDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success-100 text-success border-success-200', label: 'Completed' },
      sending: { color: 'bg-warning-100 text-warning border-warning-200', label: 'Sending' },
      draft: { color: 'bg-secondary-100 text-secondary border-secondary-200', label: 'Draft' }
    };

    const config = statusConfig[status] || statusConfig.completed;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPerformanceIndicator = (value, type) => {
    let threshold;
    switch (type) {
      case 'openRate':
        threshold = { good: 25, excellent: 40 };
        break;
      case 'clickRate':
        threshold = { good: 3, excellent: 10 };
        break;
      case 'bounceRate':
        threshold = { good: 5, excellent: 2 };
        break;
      default:
        return null;
    }

    let color = 'text-error';
    if (type === 'bounceRate') {
      if (value <= threshold.excellent) color = 'text-success';
      else if (value <= threshold.good) color = 'text-warning';
    } else {
      if (value >= threshold.excellent) color = 'text-success';
      else if (value >= threshold.good) color = 'text-warning';
    }

    return (
      <span className={`font-medium ${color}`}>
        {value}%
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">Campaign Comparison</h3>
            <p className="text-sm text-text-muted">Compare performance across your email campaigns</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            {selectedCampaigns.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                iconName="BarChart3"
              >
                Compare Selected ({selectedCampaigns.length})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border focus:ring-primary"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>Campaign</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('sentDate')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>Sent Date</span>
                  <Icon name={getSortIcon('sentDate')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('recipients')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>Recipients</span>
                  <Icon name={getSortIcon('recipients')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('openRate')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>Open Rate</span>
                  <Icon name={getSortIcon('openRate')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('clickRate')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>Click Rate</span>
                  <Icon name={getSortIcon('clickRate')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('bounceRate')}
                  className="flex items-center space-x-1 text-xs font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary"
                >
                  <span>Bounce Rate</span>
                  <Icon name={getSortIcon('bounceRate')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Status</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-secondary-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCampaigns.includes(campaign.id)}
                    onChange={() => handleSelectCampaign(campaign.id)}
                    className="rounded border-border focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{campaign.name}</div>
                    <div className="text-xs text-text-muted">
                      {formatNumber(campaign.delivered)} delivered
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {formatDate(campaign.sentDate)}
                </td>
                <td className="px-6 py-4 text-sm text-text-primary font-medium">
                  {formatNumber(campaign.recipients)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {getPerformanceIndicator(campaign.openRate, 'openRate')}
                  <div className="text-xs text-text-muted">
                    {formatNumber(campaign.opens)} opens
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {getPerformanceIndicator(campaign.clickRate, 'clickRate')}
                  <div className="text-xs text-text-muted">
                    {formatNumber(campaign.clicks)} clicks
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {getPerformanceIndicator(campaign.bounceRate, 'bounceRate')}
                  <div className="text-xs text-text-muted">
                    {formatNumber(campaign.bounces)} bounces
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(campaign.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      className="p-1"
                      title="View details"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      className="p-1"
                      title="Export data"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      className="p-1"
                      title="Duplicate campaign"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No campaigns found</h3>
          <p className="text-text-muted">
            {searchTerm ? 'Try adjusting your search terms' : 'No campaigns available to display'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignComparisonTable;
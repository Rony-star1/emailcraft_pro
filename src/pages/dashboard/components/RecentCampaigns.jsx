import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentCampaigns = () => {
  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale 2024',
      subject: 'Get 30% Off Everything - Limited Time!',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      sentDate: new Date(Date.now() - 86400000),
      recipients: 1247,
      openRate: 28.4,
      clickRate: 6.2,
      status: 'sent'
    },
    {
      id: 2,
      name: 'Welcome Series - Part 2',
      subject: 'Here are your next steps...',
      thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?w=400&h=300&fit=crop',
      sentDate: new Date(Date.now() - 172800000),
      recipients: 892,
      openRate: 31.2,
      clickRate: 7.8,
      status: 'sent'
    },
    {
      id: 3,
      name: 'Product Launch Newsletter',
      subject: 'Introducing Our Latest Innovation',
      thumbnail: 'https://images.pixabay.com/photo/2016/11/29/06/18/home-office-1867761_1280.jpg?w=400&h=300&fit=crop',
      sentDate: new Date(Date.now() - 259200000),
      recipients: 2156,
      openRate: 24.9,
      clickRate: 5.3,
      status: 'sent'
    },
    {
      id: 4,
      name: 'Weekly Newsletter #47',
      subject: 'This Week in Email Marketing',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      sentDate: new Date(Date.now() - 604800000),
      recipients: 1834,
      openRate: 26.7,
      clickRate: 4.9,
      status: 'sent'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'text-success-600 bg-success-50';
      case 'draft':
        return 'text-warning-600 bg-warning-50';
      case 'scheduled':
        return 'text-primary-600 bg-primary-50';
      default:
        return 'text-text-secondary bg-secondary-50';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Recent Campaigns</h3>
          <Button
            variant="ghost"
            iconName="ArrowRight"
            iconPosition="right"
            onClick={() => {}}
            className="text-sm"
          >
            View All
          </Button>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="p-4 hover:bg-secondary-50 transition-micro">
            <div className="flex items-start space-x-4">
              {/* Campaign Thumbnail */}
              <div className="w-16 h-12 rounded-md overflow-hidden bg-secondary-100 flex-shrink-0">
                <Image
                  src={campaign.thumbnail}
                  alt={`${campaign.name} preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Campaign Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {campaign.name}
                    </h4>
                    <p className="text-sm text-text-secondary truncate mt-1">
                      {campaign.subject}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-text-muted">
                      <span>{formatDate(campaign.sentDate)}</span>
                      <span>{campaign.recipients.toLocaleString()} recipients</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
                
                {/* Performance Metrics */}
                <div className="flex items-center space-x-6 mt-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Mail" size={14} className="text-text-muted" />
                    <span className="text-sm text-text-secondary">
                      {campaign.openRate}% opens
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MousePointer" size={14} className="text-text-muted" />
                    <span className="text-sm text-text-secondary">
                      {campaign.clickRate}% clicks
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Action Menu */}
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  iconName="MoreVertical"
                  onClick={() => {}}
                  className="p-2"
                  aria-label="Campaign options"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCampaigns;
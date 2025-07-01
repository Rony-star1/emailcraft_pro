import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PreviewModal = ({ isOpen, onClose, content, subjectLine }) => {
  const [viewMode, setViewMode] = useState('desktop');

  if (!isOpen) return null;

  const mockSenderInfo = {
    name: 'EmailCraft Pro',
    email: 'noreply@emailcraftpro.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  const formatPreviewContent = (htmlContent) => {
    if (!htmlContent) return '<p>No content to preview</p>';
    
    // Add basic email styling
    const styledContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        ${htmlContent}
      </div>
    `;
    
    return styledContent;
  };

  const viewModes = [
    { id: 'desktop', label: 'Desktop', icon: 'Monitor' },
    { id: 'mobile', label: 'Mobile', icon: 'Smartphone' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-elevation-4 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Email Preview
            </h2>
            <div className="flex bg-secondary-100 rounded-lg p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === mode.id
                      ? 'bg-surface text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name={mode.icon} size={16} />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            iconName="X"
            className="p-2"
            title="Close preview"
          />
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className={`mx-auto transition-all duration-300 ${
            viewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
          }`}>
            {/* Email Header */}
            <div className="bg-secondary-50 border border-border rounded-t-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary">
                  <img
                    src={mockSenderInfo.avatar}
                    alt={mockSenderInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary">
                    {mockSenderInfo.name}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {mockSenderInfo.email}
                  </div>
                </div>
                <div className="text-xs text-text-muted">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <div className="border-l-4 border-primary pl-3">
                <h3 className="font-semibold text-text-primary text-lg">
                  {subjectLine || 'No subject line'}
                </h3>
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-surface border-x border-b border-border rounded-b-lg">
              <div 
                className="p-6"
                dangerouslySetInnerHTML={{ 
                  __html: formatPreviewContent(content) 
                }}
              />
              
              {/* Email Footer */}
              <div className="border-t border-border p-4 bg-secondary-50">
                <div className="text-xs text-text-muted text-center space-y-2">
                  <p>
                    You received this email because you subscribed to our newsletter.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button className="text-primary hover:underline">
                      Unsubscribe
                    </button>
                    <span>•</span>
                    <button className="text-primary hover:underline">
                      Update Preferences
                    </button>
                    <span>•</span>
                    <button className="text-primary hover:underline">
                      View in Browser
                    </button>
                  </div>
                  <p>
                    EmailCraft Pro, 123 Marketing St, Digital City, DC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-secondary-50">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="Info" size={16} />
            <span>
              This is a preview. Actual email appearance may vary across email clients.
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => console.log('Send test email')}
              iconName="Send"
            >
              Send Test
            </Button>
            <Button
              variant="primary"
              onClick={onClose}
            >
              Continue Editing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EmailPreferencesSection = () => {
  const [preferences, setPreferences] = useState({
    defaultSenderName: "John from EmailCraft",
    defaultSenderEmail: "john@emailcraft.com",
    defaultReplyTo: "john@emailcraft.com",
    emailSignature: `Best regards,\nJohn Doe\nEmailCraft Solutions\n📧 john@emailcraft.com\n📱 +1 (555) 123-4567`,
    trackOpens: true,
    trackClicks: true,
    enableUnsubscribe: true,
    doubleOptIn: true,
    sendWelcomeEmail: true,
    campaignNotifications: true,
    weeklyReports: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Email preferences updated successfully');
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <h5 className="text-sm font-medium text-text-primary">{label}</h5>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          enabled ? 'bg-primary' : 'bg-secondary-300'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1 p-6">
      <h3 className="text-xl font-bold text-text-primary mb-6">Email Preferences</h3>
      <div className="space-y-8">
        {/* Default Sender Settings */}
        <div>
          <h4 className="text-md font-medium text-text-primary mb-4">Default Sender Settings</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Default Sender Name</label>
                <Input
                  type="text"
                  value={preferences.defaultSenderName}
                  onChange={(e) => handleInputChange('defaultSenderName', e.target.value)}
                  placeholder="Enter sender name"
                />
                <p className="text-xs text-text-muted mt-1">This will appear as the "From" name in emails</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Default Sender Email</label>
                <Input
                  type="email"
                  value={preferences.defaultSenderEmail}
                  onChange={(e) => handleInputChange('defaultSenderEmail', e.target.value)}
                  placeholder="Enter sender email"
                />
                <p className="text-xs text-text-muted mt-1">This will appear as the "From" email address</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Default Reply-To Email</label>
              <Input
                type="email"
                value={preferences.defaultReplyTo}
                onChange={(e) => handleInputChange('defaultReplyTo', e.target.value)}
                placeholder="Enter reply-to email"
              />
              <p className="text-xs text-text-muted mt-1">Where replies will be sent (can be different from sender email)</p>
            </div>
          </div>
        </div>

        {/* Email Signature */}
        <div>
          <h4 className="text-md font-medium text-text-primary mb-4">Default Email Signature</h4>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Signature Template</label>
            <textarea
              value={preferences.emailSignature}
              onChange={(e) => handleInputChange('emailSignature', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
              placeholder="Enter your default email signature"
            />
            <p className="text-xs text-text-muted mt-1">This signature will be automatically added to your emails</p>
          </div>
        </div>

        {/* Tracking Settings */}
        <div>
          <h4 className="text-md font-medium text-text-primary mb-4">Email Tracking</h4>
          <div className="space-y-1 divide-y divide-border">
            <ToggleSwitch
              enabled={preferences.trackOpens}
              onToggle={() => handleToggle('trackOpens')}
              label="Track Email Opens"
              description="Monitor when recipients open your emails for analytics"
            />
            <ToggleSwitch
              enabled={preferences.trackClicks}
              onToggle={() => handleToggle('trackClicks')}
              label="Track Link Clicks"
              description="Monitor when recipients click links in your emails"
            />
            <ToggleSwitch
              enabled={preferences.enableUnsubscribe}
              onToggle={() => handleToggle('enableUnsubscribe')}
              label="Include Unsubscribe Link"
              description="Automatically add unsubscribe links to all emails (required by law)"
            />
          </div>
        </div>

        {/* Subscription Settings */}
        <div>
          <h4 className="text-md font-medium text-text-primary mb-4">Subscription Management</h4>
          <div className="space-y-1 divide-y divide-border">
            <ToggleSwitch
              enabled={preferences.doubleOptIn}
              onToggle={() => handleToggle('doubleOptIn')}
              label="Double Opt-In"
              description="Require new subscribers to confirm their email address"
            />
            <ToggleSwitch
              enabled={preferences.sendWelcomeEmail}
              onToggle={() => handleToggle('sendWelcomeEmail')}
              label="Send Welcome Email"
              description="Automatically send a welcome email to new subscribers"
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h4 className="text-md font-medium text-text-primary mb-4">Notification Preferences</h4>
          <div className="space-y-1 divide-y divide-border">
            <ToggleSwitch
              enabled={preferences.campaignNotifications}
              onToggle={() => handleToggle('campaignNotifications')}
              label="Campaign Notifications"
              description="Get notified when campaigns are sent or completed"
            />
            <ToggleSwitch
              enabled={preferences.weeklyReports}
              onToggle={() => handleToggle('weeklyReports')}
              label="Weekly Performance Reports"
              description="Receive weekly summaries of your campaign performance"
            />
            <ToggleSwitch
              enabled={preferences.systemUpdates}
              onToggle={() => handleToggle('systemUpdates')}
              label="System Updates"
              description="Get notified about platform updates and new features"
            />
            <ToggleSwitch
              enabled={preferences.marketingEmails}
              onToggle={() => handleToggle('marketingEmails')}
              label="Marketing Communications"
              description="Receive tips, best practices, and promotional content"
            />
          </div>
        </div>

        {/* Email Templates */}
        <div>
          <h4 className="text-md font-medium text-text-primary mb-4">Quick Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-text-primary">Welcome Email</h5>
                <Button variant="ghost" size="sm" iconName="Edit">
                  Edit
                </Button>
              </div>
              <p className="text-sm text-text-secondary">Default template for new subscriber welcome emails</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-text-primary">Newsletter Template</h5>
                <Button variant="ghost" size="sm" iconName="Edit">
                  Edit
                </Button>
              </div>
              <p className="text-sm text-text-secondary">Standard template for newsletter campaigns</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-text-primary">Promotional Email</h5>
                <Button variant="ghost" size="sm" iconName="Edit">
                  Edit
                </Button>
              </div>
              <p className="text-sm text-text-secondary">Template for promotional and marketing campaigns</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-text-primary">Event Invitation</h5>
                <Button variant="ghost" size="sm" iconName="Edit">
                  Edit
                </Button>
              </div>
              <p className="text-sm text-text-secondary">Template for event invitations and announcements</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            variant="primary"
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save Email Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferencesSection;
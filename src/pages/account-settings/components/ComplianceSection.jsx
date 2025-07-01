import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ComplianceSection = ({ isOpen, onToggle }) => {
  const [complianceSettings, setComplianceSettings] = useState({
    gdprEnabled: true,
    canSpamEnabled: true,
    doubleOptIn: true,
    consentTracking: true,
    dataRetentionDays: 365,
    unsubscribeText: "If you no longer wish to receive these emails, you can unsubscribe at any time.",
    companyName: "EmailCraft Solutions",
    companyAddress: "123 Business St, Suite 100, New York, NY 10001",
    privacyPolicyUrl: "https://emailcraft.com/privacy",
    termsOfServiceUrl: "https://emailcraft.com/terms",
    contactEmail: "privacy@emailcraft.com",
    dpoEmail: "dpo@emailcraft.com",
    region: "US"
  });

  const [isSaving, setIsSaving] = useState(false);

  const regions = [
    { code: 'US', name: 'United States', laws: ['CAN-SPAM Act'] },
    { code: 'EU', name: 'European Union', laws: ['GDPR'] },
    { code: 'CA', name: 'Canada', laws: ['CASL'] },
    { code: 'AU', name: 'Australia', laws: ['Spam Act 2003'] },
    { code: 'UK', name: 'United Kingdom', laws: ['GDPR', 'PECR'] }
  ];

  const handleInputChange = (field, value) => {
    setComplianceSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field) => {
    setComplianceSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Compliance settings updated successfully');
  };

  const getRegionLaws = (regionCode) => {
    const region = regions.find(r => r.code === regionCode);
    return region ? region.laws : [];
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description, required = false }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h5 className="text-sm font-medium text-text-primary">{label}</h5>
          {required && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error-100 text-error">
              Required
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        disabled={required}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          enabled ? 'bg-primary' : required ? 'bg-secondary-200' : 'bg-secondary-300'
        } ${required ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-t-lg"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Compliance Settings</h3>
            <p className="text-sm text-text-secondary">Configure legal compliance and data protection</p>
          </div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={20} 
          className={`text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mt-6 space-y-8">
            {/* Region Selection */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Primary Operating Region</h4>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Select your primary region</label>
                <select
                  value={complianceSettings.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {regions.map(region => (
                    <option key={region.code} value={region.code}>
                      {region.name} ({region.laws.join(', ')})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-muted mt-1">
                  This determines which compliance laws apply to your email campaigns
                </p>
              </div>
            </div>

            {/* Applicable Laws */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Applicable Laws</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getRegionLaws(complianceSettings.region).map(law => (
                  <div key={law} className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="CheckCircle" size={16} className="text-primary" />
                      <h5 className="font-medium text-text-primary">{law}</h5>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {law === 'GDPR' && 'General Data Protection Regulation - EU data protection law'}
                      {law === 'CAN-SPAM Act' && 'US law regulating commercial email messages'}
                      {law === 'CASL' && 'Canada\'s Anti-Spam Legislation'}
                      {law === 'Spam Act 2003' && 'Australian anti-spam legislation'}
                      {law === 'PECR' && 'Privacy and Electronic Communications Regulations'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Features */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Compliance Features</h4>
              <div className="space-y-1 divide-y divide-border">
                <ToggleSwitch
                  enabled={complianceSettings.gdprEnabled}
                  onToggle={() => handleToggle('gdprEnabled')}
                  label="GDPR Compliance"
                  description="Enable GDPR-compliant data handling and consent management"
                  required={complianceSettings.region === 'EU' || complianceSettings.region === 'UK'}
                />
                <ToggleSwitch
                  enabled={complianceSettings.canSpamEnabled}
                  onToggle={() => handleToggle('canSpamEnabled')}
                  label="CAN-SPAM Compliance"
                  description="Ensure compliance with US CAN-SPAM Act requirements"
                  required={complianceSettings.region === 'US'}
                />
                <ToggleSwitch
                  enabled={complianceSettings.doubleOptIn}
                  onToggle={() => handleToggle('doubleOptIn')}
                  label="Double Opt-In"
                  description="Require email confirmation for new subscribers"
                />
                <ToggleSwitch
                  enabled={complianceSettings.consentTracking}
                  onToggle={() => handleToggle('consentTracking')}
                  label="Consent Tracking"
                  description="Track and log subscriber consent for compliance audits"
                />
              </div>
            </div>

            {/* Data Retention */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Data Retention</h4>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Data Retention Period (Days)</label>
                <Input
                  type="number"
                  value={complianceSettings.dataRetentionDays}
                  onChange={(e) => handleInputChange('dataRetentionDays', parseInt(e.target.value))}
                  min={30}
                  max={2555}
                  className="w-32"
                />
                <p className="text-xs text-text-muted mt-1">
                  How long to retain subscriber data after unsubscription (30-2555 days)
                </p>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Company Information</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Company Name</label>
                    <Input
                      type="text"
                      value={complianceSettings.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Contact Email</label>
                    <Input
                      type="email"
                      value={complianceSettings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="Enter contact email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Company Address</label>
                  <Input
                    type="text"
                    value={complianceSettings.companyAddress}
                    onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                    placeholder="Enter complete company address"
                    required
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Required by CAN-SPAM Act and other regulations
                  </p>
                </div>
                {(complianceSettings.gdprEnabled) && (
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Data Protection Officer Email</label>
                    <Input
                      type="email"
                      value={complianceSettings.dpoEmail}
                      onChange={(e) => handleInputChange('dpoEmail', e.target.value)}
                      placeholder="Enter DPO email address"
                    />
                    <p className="text-xs text-text-muted mt-1">
                      Required for GDPR compliance if processing large amounts of personal data
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Legal Pages */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Legal Pages</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Privacy Policy URL</label>
                    <Input
                      type="url"
                      value={complianceSettings.privacyPolicyUrl}
                      onChange={(e) => handleInputChange('privacyPolicyUrl', e.target.value)}
                      placeholder="https://yoursite.com/privacy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Terms of Service URL</label>
                    <Input
                      type="url"
                      value={complianceSettings.termsOfServiceUrl}
                      onChange={(e) => handleInputChange('termsOfServiceUrl', e.target.value)}
                      placeholder="https://yoursite.com/terms"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Unsubscribe Settings */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Unsubscribe Settings</h4>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Unsubscribe Text</label>
                <textarea
                  value={complianceSettings.unsubscribeText}
                  onChange={(e) => handleInputChange('unsubscribeText', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                  placeholder="Enter unsubscribe text"
                />
                <p className="text-xs text-text-muted mt-1">
                  This text will appear in the unsubscribe section of your emails
                </p>
              </div>
            </div>

            {/* Compliance Status */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Compliance Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-success-50 border border-success-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="CheckCircle" size={20} className="text-success" />
                    <h5 className="font-medium text-text-primary">Email Compliance</h5>
                  </div>
                  <p className="text-sm text-text-secondary">
                    All required fields completed and compliance features enabled
                  </p>
                </div>
                <div className="bg-warning-50 border border-warning-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="AlertTriangle" size={20} className="text-warning-600" />
                    <h5 className="font-medium text-text-primary">Data Retention</h5>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Review data retention settings for your region
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                variant="primary"
                onClick={handleSave}
                loading={isSaving}
                iconName="Shield"
                iconPosition="left"
              >
                Save Compliance Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceSection;
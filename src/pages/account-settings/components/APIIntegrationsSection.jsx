import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const APIIntegrationsSection = ({ isOpen, onToggle }) => {
  const [integrations, setIntegrations] = useState({
    sendgrid: {
      name: 'SendGrid',
      description: 'Email delivery service for transactional and marketing emails',
      icon: 'Mail',
      connected: true,
      apiKey: 'SG.************************************',
      status: 'active',
      lastSync: '2024-12-15T10:30:00Z'
    },
    amazonses: {
      name: 'Amazon SES',
      description: 'Amazon Simple Email Service for reliable email delivery',
      icon: 'Cloud',
      connected: false,
      apiKey: '',
      status: 'disconnected',
      lastSync: null
    },
    openai: {
      name: 'OpenAI',
      description: 'AI-powered subject line generation and content optimization',
      icon: 'Brain',
      connected: true,
      apiKey: 'sk-************************************',
      status: 'active',
      lastSync: '2024-12-15T09:45:00Z'
    },
    huggingface: {
      name: 'Hugging Face',
      description: 'Alternative AI service for natural language processing',
      icon: 'Zap',
      connected: false,
      apiKey: '',
      status: 'disconnected',
      lastSync: null
    }
  });

  const [editingIntegration, setEditingIntegration] = useState(null);
  const [newApiKey, setNewApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (integrationKey) => {
    if (!newApiKey.trim()) return;
    
    setIsConnecting(true);
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => ({
      ...prev,
      [integrationKey]: {
        ...prev[integrationKey],
        connected: true,
        apiKey: newApiKey.substring(0, 10) + '*'.repeat(24),
        status: 'active',
        lastSync: new Date().toISOString()
      }
    }));
    
    setIsConnecting(false);
    setEditingIntegration(null);
    setNewApiKey('');
    console.log(`${integrations[integrationKey].name} connected successfully`);
  };

  const handleDisconnect = (integrationKey) => {
    setIntegrations(prev => ({
      ...prev,
      [integrationKey]: {
        ...prev[integrationKey],
        connected: false,
        apiKey: '',
        status: 'disconnected',
        lastSync: null
      }
    }));
    console.log(`${integrations[integrationKey].name} disconnected`);
  };

  const handleTestConnection = async (integrationKey) => {
    console.log(`Testing ${integrations[integrationKey].name} connection...`);
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`${integrations[integrationKey].name} connection test successful`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success-100';
      case 'error': return 'text-error bg-error-100';
      case 'warning': return 'text-warning-600 bg-warning-100';
      default: return 'text-text-muted bg-secondary-100';
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-t-lg"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
            <Icon name="Plug" size={20} className="text-warning-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">API Integrations</h3>
            <p className="text-sm text-text-secondary">Manage third-party service connections</p>
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
          <div className="mt-6 space-y-6">
            {/* Integration Cards */}
            {Object.entries(integrations).map(([key, integration]) => (
              <div key={key} className="border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      integration.connected ? 'bg-success-100' : 'bg-secondary-100'
                    }`}>
                      <Icon 
                        name={integration.icon} 
                        size={24} 
                        className={integration.connected ? 'text-success' : 'text-text-muted'}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-text-primary">{integration.name}</h4>
                      <p className="text-sm text-text-secondary">{integration.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        integration.status === 'active' ? 'bg-success' : 
                        integration.status === 'error' ? 'bg-error' : 
                        integration.status === 'warning' ? 'bg-warning-500' : 'bg-text-muted'
                      }`} />
                      {integration.status === 'active' ? 'Connected' : 
                       integration.status === 'error' ? 'Error' : 
                       integration.status === 'warning' ? 'Warning' : 'Disconnected'}
                    </span>
                  </div>
                </div>

                {integration.connected ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">API Key</label>
                        <p className="text-sm text-text-primary font-mono bg-secondary-50 px-3 py-2 rounded border">
                          {integration.apiKey}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Last Sync</label>
                        <p className="text-sm text-text-primary">
                          {formatLastSync(integration.lastSync)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleTestConnection(key)}
                        iconName="RefreshCw"
                        iconPosition="left"
                        size="sm"
                      >
                        Test Connection
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingIntegration(key);
                          setNewApiKey('');
                        }}
                        iconName="Edit"
                        iconPosition="left"
                        size="sm"
                      >
                        Update API Key
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDisconnect(key)}
                        iconName="Unlink"
                        iconPosition="left"
                        size="sm"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editingIntegration === key ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-2">API Key</label>
                          <Input
                            type="password"
                            value={newApiKey}
                            onChange={(e) => setNewApiKey(e.target.value)}
                            placeholder={`Enter your ${integration.name} API key`}
                          />
                          <p className="text-xs text-text-muted mt-1">
                            Your API key will be encrypted and stored securely
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            variant="primary"
                            onClick={() => handleConnect(key)}
                            loading={isConnecting}
                            disabled={!newApiKey.trim()}
                            iconName="Link"
                            iconPosition="left"
                          >
                            Connect
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setEditingIntegration(null);
                              setNewApiKey('');
                            }}
                            disabled={isConnecting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-text-secondary">
                          Connect your {integration.name} account to enable this integration
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => setEditingIntegration(key)}
                          iconName="Plus"
                          iconPosition="left"
                        >
                          Connect
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Integration Help */}
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-2">Integration Help</h4>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <p><strong>SendGrid/Amazon SES:</strong> Required for sending emails. At least one email service must be connected.</p>
                    <p><strong>OpenAI/Hugging Face:</strong> Optional AI services for subject line generation and content optimization.</p>
                    <p><strong>API Keys:</strong> All API keys are encrypted and stored securely. You can update or remove them at any time.</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      iconName="ExternalLink"
                      iconPosition="right"
                      size="sm"
                    >
                      View Integration Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Integration Usage (Last 30 Days)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-text-primary">Email Delivery</h5>
                    <Icon name="Mail" size={16} className="text-text-muted" />
                  </div>
                  <p className="text-2xl font-bold text-primary">2,847</p>
                  <p className="text-sm text-text-secondary">Emails sent via SendGrid</p>
                </div>
                <div className="bg-surface border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-text-primary">AI Generations</h5>
                    <Icon name="Brain" size={16} className="text-text-muted" />
                  </div>
                  <p className="text-2xl font-bold text-accent">156</p>
                  <p className="text-sm text-text-secondary">Subject lines generated via OpenAI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIIntegrationsSection;
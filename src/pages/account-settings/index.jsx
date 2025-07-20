import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import ProfileSection from './components/ProfileSection';
import BillingSection from './components/BillingSection';
import EmailPreferencesSection from './components/EmailPreferencesSection';
import SecuritySection from './components/SecuritySection';
import Icon from '../../components/AppIcon';

const AccountSettings = () => {
  const [openSections, setOpenSections] = useState({
    profile: true,
    billing: false,
    emailPreferences: false,
    security: false
  });

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (sectionKey) => {
    if (isMobileView) {
      // On mobile, only allow one section open at a time
      setOpenSections(prev => {
        const newState = Object.keys(prev).reduce((acc, key) => {
          acc[key] = key === sectionKey ? !prev[key] : false;
          return acc;
        }, {});
        return newState;
      });
    } else {
      // On desktop, allow multiple sections open
      setOpenSections(prev => ({
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }));
    }
  };

  const settingsSections = [
    {
      key: 'profile',
      component: ProfileSection,
      title: 'Profile Information',
      description: 'Manage your business profile and sender details'
    },
    {
      key: 'billing',
      component: BillingSection,
      title: 'Billing & Subscription',
      description: 'Manage your subscription and payment details'
    },
    {
      key: 'emailPreferences',
      component: EmailPreferencesSection,
      title: 'Email Preferences',
      description: 'Configure default email settings and notifications'
    },
    {
      key: 'security',
      component: SecuritySection,
      title: 'Security Settings',
      description: 'Manage password and account security'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Account Settings</h1>
                <p className="text-text-secondary">
                  Manage your profile, billing, preferences, and platform configuration
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Account Status</p>
                  <p className="font-semibold text-text-primary">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <Icon name="CreditCard" size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Current Plan</p>
                  <p className="font-semibold text-text-primary">Starter</p>
                </div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Contacts</p>
                  <p className="font-semibold text-text-primary">347/1000</p>
                </div>
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={16} className="text-warning-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Security</p>
                  <p className="font-semibold text-text-primary">2FA Off</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {settingsSections.map(({ key, component: Component }) => (
              <Component
                key={key}
                isOpen={openSections[key]}
                onToggle={() => toggleSection(key)}
              />
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-primary-50 border border-primary-100 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="HelpCircle" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Need Help?</h3>
                <p className="text-text-secondary mb-4">
                  If you have questions about your account settings or need assistance with configuration, 
                  our support team is here to help.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-700 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    Contact Support
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-surface text-text-primary border border-border rounded-md hover:bg-secondary-50 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Icon name="Book" size={16} className="mr-2" />
                    View Documentation
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-surface text-text-primary border border-border rounded-md hover:bg-secondary-50 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Icon name="Video" size={16} className="mr-2" />
                    Watch Tutorials
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-text-secondary">
                <p>&copy; {new Date().getFullYear()} EmailCraft Pro. All rights reserved.</p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <button className="text-text-secondary hover:text-text-primary transition-micro">
                  Privacy Policy
                </button>
                <button className="text-text-secondary hover:text-text-primary transition-micro">
                  Terms of Service
                </button>
                <button className="text-text-secondary hover:text-text-primary transition-micro">
                  Support
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
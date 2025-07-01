import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialRegistration = ({ onSocialRegister, isLoading }) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome',
      color: 'text-red-600',
      bgColor: 'hover:bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  const handleSocialClick = (provider) => {
    if (!isLoading) {
      onSocialRegister(provider.toLowerCase());
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-surface text-text-muted">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.name}
            variant="outline"
            onClick={() => handleSocialClick(provider.name)}
            disabled={isLoading}
            className={`flex items-center justify-center space-x-2 py-3 ${provider.bgColor} ${provider.borderColor} transition-micro`}
          >
            <Icon 
              name={provider.icon} 
              size={18} 
              className={provider.color}
            />
            <span className="font-medium">{provider.name}</span>
          </Button>
        ))}
      </div>

      <p className="text-xs text-text-muted text-center mt-4">
        By signing up with social media, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default SocialRegistration;
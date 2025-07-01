import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialLogin = ({ onSocialLogin, isLoading }) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: 'Chrome', // Using Chrome as closest approximation to Google icon
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50',
      borderColor: 'border-red-200 hover:border-red-300'
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50',
      borderColor: 'border-blue-200 hover:border-blue-300'
    }
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => (
        <Button
          key={provider.name}
          variant="outline"
          size="lg"
          fullWidth
          disabled={isLoading}
          onClick={() => onSocialLogin(provider.name)}
          className={`
            relative overflow-hidden group
            ${provider.bgColor} 
            ${provider.borderColor}
            transition-all duration-200 
            hover:shadow-md 
            hover:scale-[1.02]
            border-2
          `}
        >
          <div className="flex items-center justify-center space-x-3">
            <Icon 
              name={provider.icon} 
              size={20} 
              className={provider.color}
            />
            <span className="font-medium text-text-primary">
              Continue with {provider.name}
            </span>
          </div>
          
          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600"></div>
        </Button>
      ))}

      {/* Alternative social options for smaller screens */}
      <div className="sm:hidden">
        <div className="text-center text-xs text-text-muted mb-3">
          Or sign in with
        </div>
        <div className="flex justify-center space-x-4">
          {socialProviders.map((provider) => (
            <button
              key={`mobile-${provider.name}`}
              disabled={isLoading}
              onClick={() => onSocialLogin(provider.name)}
              className={`
                w-12 h-12 rounded-full border-2 
                ${provider.borderColor} 
                ${provider.bgColor}
                flex items-center justify-center
                transition-all duration-200
                hover:shadow-lg hover:scale-110
                active:scale-95
              `}
            >
              <Icon 
                name={provider.icon} 
                size={24} 
                className={provider.color}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="text-center mt-4">
        <p className="text-xs text-text-muted flex items-center justify-center space-x-1">
          <Icon name="Shield" size={12} />
          <span>Secure authentication powered by OAuth 2.0</span>
        </p>
      </div>
    </div>
  );
};

export default SocialLogin;
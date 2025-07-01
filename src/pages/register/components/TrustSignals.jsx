import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-level Security',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Users',
      title: '10,000+ Happy Users',
      description: 'Join thousands of successful marketers'
    },
    {
      icon: 'Award',
      title: 'GDPR Compliant',
      description: 'Fully compliant with international privacy laws'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Vegan Fitness Coach',
      content: `EmailCraft Pro helped me increase my open rates by 40%. The AI subject lines are game-changing!`,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Indie Game Developer',
      content: `Perfect for niche marketing. Finally found a tool that understands my audience.`,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {trustFeatures.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name={feature.icon} size={20} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-text-muted">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary text-center">
          What our users say
        </h3>
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-secondary-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary-100 flex-shrink-0">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name} avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary mb-2">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium text-text-primary">
                      {testimonial.name}
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Lock" size={16} className="text-success" />
          <span className="text-xs text-text-muted">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-xs text-text-muted">GDPR Ready</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs text-text-muted">SOC 2 Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
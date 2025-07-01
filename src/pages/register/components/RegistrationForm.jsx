import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    nicheMarket: '',
    gdprConsent: false,
    canSpamConsent: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const nicheMarkets = [
    { value: '', label: 'Select your niche market' },
    { value: 'vegan-fitness', label: 'Vegan Fitness Coaching' },
    { value: 'indie-gaming', label: 'Indie Game Development' },
    { value: 'artisan-crafts', label: 'Artisan Crafts & Handmade' },
    { value: 'sustainable-living', label: 'Sustainable Living' },
    { value: 'digital-nomad', label: 'Digital Nomad Services' },
    { value: 'pet-care', label: 'Specialized Pet Care' },
    { value: 'wellness-coaching', label: 'Wellness & Life Coaching' },
    { value: 'tech-education', label: 'Tech Education & Tutorials' },
    { value: 'creative-services', label: 'Creative Services' },
    { value: 'other', label: 'Other' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.nicheMarket) {
      newErrors.nicheMarket = 'Please select your niche market';
    }

    if (!formData.gdprConsent) {
      newErrors.gdprConsent = 'Please accept the privacy policy';
    }

    if (!formData.canSpamConsent) {
      newErrors.canSpamConsent = 'Please acknowledge the CAN-SPAM compliance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-error';
    if (passwordStrength < 50) return 'bg-warning';
    if (passwordStrength < 75) return 'bg-accent';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-text-primary mb-2">
          Business Name *
        </label>
        <Input
          type="text"
          id="businessName"
          name="businessName"
          placeholder="Enter your business name"
          value={formData.businessName}
          onChange={handleInputChange}
          className={`w-full ${errors.businessName ? 'border-error focus:ring-error' : ''}`}
          required
        />
        {errors.businessName && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.businessName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          Email Address *
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full ${errors.email ? 'border-error focus:ring-error' : ''}`}
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
          Password *
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pr-10 ${errors.password ? 'border-error focus:ring-error' : ''}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-muted">Password strength:</span>
              <span className={`text-xs font-medium ${
                passwordStrength < 25 ? 'text-error' :
                passwordStrength < 50 ? 'text-warning' :
                passwordStrength < 75 ? 'text-accent' : 'text-success'
              }`}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full pr-10 ${errors.confirmPassword ? 'border-error focus:ring-error' : ''}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Niche Market Selection */}
      <div>
        <label htmlFor="nicheMarket" className="block text-sm font-medium text-text-primary mb-2">
          Niche Market *
        </label>
        <select
          id="nicheMarket"
          name="nicheMarket"
          value={formData.nicheMarket}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-micro ${
            errors.nicheMarket ? 'border-error focus:ring-error' : 'border-border'
          }`}
          required
        >
          {nicheMarkets.map(market => (
            <option key={market.value} value={market.value}>
              {market.label}
            </option>
          ))}
        </select>
        {errors.nicheMarket && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.nicheMarket}
          </p>
        )}
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start">
          <Input
            type="checkbox"
            id="gdprConsent"
            name="gdprConsent"
            checked={formData.gdprConsent}
            onChange={handleInputChange}
            className="mt-1"
            required
          />
          <label htmlFor="gdprConsent" className="ml-3 text-sm text-text-secondary">
            I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to the processing of my personal data in accordance with GDPR regulations.
          </label>
        </div>
        {errors.gdprConsent && (
          <p className="text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.gdprConsent}
          </p>
        )}

        <div className="flex items-start">
          <Input
            type="checkbox"
            id="canSpamConsent"
            name="canSpamConsent"
            checked={formData.canSpamConsent}
            onChange={handleInputChange}
            className="mt-1"
            required
          />
          <label htmlFor="canSpamConsent" className="ml-3 text-sm text-text-secondary">
            I acknowledge compliance with CAN-SPAM Act requirements and agree to receive marketing communications. You can unsubscribe at any time.
          </label>
        </div>
        {errors.canSpamConsent && (
          <p className="text-sm text-error flex items-center">
            <Icon name="AlertCircle" size={14} className="mr-1" />
            {errors.canSpamConsent}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        className="mt-8"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
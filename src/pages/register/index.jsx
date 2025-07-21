import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import SocialRegistration from './components/SocialRegistration';
import TrustSignals from './components/TrustSignals';
import SuccessModal from './components/SuccessModal';

const Register = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth();

  // Mock credentials for testing
  const mockCredentials = {
    businessName: 'Test Business',
    email: 'test@example.com',
    password: 'TestPass123!',
    nicheMarket: 'vegan-fitness'
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleRegistration = async (formData) => {
    clearError();
    
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        nicheMarket: formData.nicheMarket
      });
      
      if (result.success) {
        console.log('Registration successful');
        
        // Set registered email for success modal
        setRegisteredEmail(formData.email);
        
        // Show success modal
        setShowSuccessModal(true);
      }
      // Error handling is managed by the auth context
      
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleSocialRegistration = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Registering with ${provider}`);
      
      // Mock successful social registration
      setRegisteredEmail(`user@${provider.toLowerCase()}.com`);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error(`${provider} registration failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // In a real app, you might redirect to a verification page
    // For now, we'll redirect to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Icon name="Mail" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-text-primary font-heading">
                EmailCraft Pro
              </span>
            </div>

            {/* Login Link */}
            <Link
              to="/dashboard"
              className="text-sm text-text-secondary hover:text-text-primary transition-micro flex items-center space-x-1"
            >
              <span>Already have an account?</span>
              <span className="text-primary font-medium">Sign in</span>
              <Icon name="ArrowRight" size={14} className="text-primary" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Create Your Account
            </h1>
            <p className="text-text-secondary">
              Join thousands of successful niche marketers and start growing your email campaigns with AI-powered optimization.
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-surface rounded-xl shadow-elevation-2 border border-border p-6 mb-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon name="AlertCircle" size={20} className="text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={clearError}
                      className="inline-flex text-red-400 hover:text-red-600 focus:outline-none focus:text-red-600"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <RegistrationForm 
              onSubmit={handleRegistration}
              isLoading={isLoading}
            />
          </div>

          {/* Social Registration */}
          <div className="bg-surface rounded-xl shadow-elevation-2 border border-border p-6 mb-8">
            <SocialRegistration 
              onSocialRegister={handleSocialRegistration}
              isLoading={isLoading}
            />
          </div>

          {/* Trust Signals */}
          <div className="bg-surface rounded-xl shadow-elevation-2 border border-border p-6">
            <TrustSignals />
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-xs text-text-muted">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
            
            {/* Mock Credentials Info */}
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-accent-600 font-medium mb-1">
                Demo Credentials (for testing):
              </p>
              <div className="text-xs text-accent-600 space-y-1">
                <p>Business: {mockCredentials.businessName}</p>
                <p>Email: {mockCredentials.email}</p>
                <p>Password: {mockCredentials.password}</p>
                <p>Niche: {mockCredentials.nicheMarket}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        email={registeredEmail}
      />
    </div>
  );
};

export default Register;

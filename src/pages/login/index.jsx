import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { apiClient, apiHelpers } from '../../utils/api';
import LoginForm from './components/LoginForm';
import SocialLogin from './components/SocialLogin';
import ErrorAlert from './components/ErrorAlert';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await apiClient.auth.login(formData);
      apiHelpers.setAuthToken(data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Logging in with ${provider}`);
      
      // Mock successful social login
      navigate('/dashboard');
      
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      setError(`Failed to login with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // In a real app, this would navigate to forgot password page
    alert('Forgot password functionality would be implemented here');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse-subtle"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center shadow-lg">
                <Icon name="Mail" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-white font-heading">
                EmailCraft Pro
              </span>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="text-sm text-white/80 hover:text-white transition-all duration-200 flex items-center space-x-1 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20"
            >
              <span>Need an account?</span>
              <span className="text-white font-medium">Sign up</span>
              <Icon name="ArrowRight" size={14} className="text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              Welcome Back
            </h1>
            <p className="text-white/80 text-lg">
              Sign in to your EmailCraft Pro account and continue growing your campaigns.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-elevation-4 border border-white/20 p-8 mb-6">
            {/* Error Alert */}
            {error && (
              <div className="mb-6">
                <ErrorAlert 
                  message={error} 
                  onClose={() => setError('')} 
                />
              </div>
            )}

            {/* Login Form */}
            <LoginForm 
              onSubmit={handleLogin}
              isLoading={isLoading}
              rememberMe={rememberMe}
              onRememberMeChange={setRememberMe}
              onForgotPassword={handleForgotPassword}
            />

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-secondary font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <SocialLogin 
              onSocialLogin={handleSocialLogin}
              isLoading={isLoading}
            />
          </div>

          {/* Demo Credentials */}
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 text-center">
            <p className="text-white/90 font-medium mb-2 text-sm">
              Demo Credentials
            </p>
            <div className="text-white/70 text-xs space-y-1">
              <p>Email: test@example.com</p>
              <p>Password: TestPass123!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <div className="text-white/60 text-xs space-y-2">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-white/80 hover:text-white underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-white/80 hover:text-white underline">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
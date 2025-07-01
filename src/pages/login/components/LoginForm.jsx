import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ 
  onSubmit, 
  isLoading, 
  rememberMe, 
  onRememberMeChange, 
  onForgotPassword 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const watchedFields = watch();

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-text-primary"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Mail" size={18} className="text-text-muted" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={`pl-10 transition-all duration-200 ${
              errors.email 
                ? 'border-error focus:ring-error/20 focus:border-error' :'focus:ring-primary/20 focus:border-primary'
            }`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.email.message}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-text-primary"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={18} className="text-text-muted" />
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className={`pl-10 pr-10 transition-all duration-200 ${
              errors.password 
                ? 'border-error focus:ring-error/20 focus:border-error' :'focus:ring-primary/20 focus:border-primary'
            }`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'EyeOff' : 'Eye'} 
              size={18} 
            />
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.password.message}</span>
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer group">
          <Input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className="rounded focus:ring-primary/20 focus:border-primary text-primary"
          />
          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
            Remember me
          </span>
        </label>

        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-primary-700 font-medium transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={!isValid || isLoading}
        className="bg-gradient-to-r from-primary to-primary-700 hover:from-primary-600 hover:to-primary-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      {/* Form Progress Indicator */}
      <div className="flex justify-center space-x-1">
        {['email', 'password'].map((field) => (
          <div
            key={field}
            className={`h-1 w-8 rounded-full transition-all duration-300 ${
              watchedFields[field] && !errors[field]
                ? 'bg-gradient-to-r from-primary to-primary-600' :'bg-border'
            }`}
          />
        ))}
      </div>
    </form>
  );
};

export default LoginForm;
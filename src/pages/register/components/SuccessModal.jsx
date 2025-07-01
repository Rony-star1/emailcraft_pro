import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessModal = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  const handleResendEmail = () => {
    // Mock resend functionality
    console.log('Resending verification email to:', email);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-elevation-4 rounded-xl">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Account Created Successfully!
            </h3>

            {/* Description */}
            <p className="text-text-secondary mb-6">
              We've sent a verification email to <strong>{email}</strong>. 
              Please check your inbox and click the verification link to activate your account.
            </p>

            {/* Email Icon */}
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <Icon name="Mail" size={24} className="text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">
                    Check your email
                  </p>
                  <p className="text-xs text-text-muted">
                    Verification link sent
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={onClose}
              >
                Got it, thanks!
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={handleResendEmail}
                className="text-sm"
              >
                Didn't receive the email? Resend
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-text-muted mt-4">
              Can't find the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySection = ({ isOpen, onToggle }) => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordLastChanged: '2024-11-15T10:30:00Z',
    activeSessions: 3,
    backupCodes: []
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCodeUrl] = useState('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/EmailCraft%20Pro:john@emailcraft.com?secret=JBSWY3DPEHPK3PXP&issuer=EmailCraft%20Pro');

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2024-12-15T14:30:00Z',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '2024-12-15T12:15:00Z',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on MacOS',
      location: 'Brooklyn, NY',
      lastActive: '2024-12-14T18:45:00Z',
      current: false
    }
  ];

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      console.log('Passwords do not match');
      return;
    }
    
    setIsChangingPassword(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSecuritySettings(prev => ({
      ...prev,
      passwordLastChanged: new Date().toISOString()
    }));
    console.log('Password changed successfully');
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (twoFactorStep === 1) {
      setTwoFactorStep(2);
    } else if (twoFactorStep === 2) {
      // Verify code
      if (verificationCode === '123456') {
        setSecuritySettings(prev => ({
          ...prev,
          twoFactorEnabled: true,
          backupCodes: ['ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345']
        }));
        setTwoFactorStep(3);
      } else {
        console.log('Invalid verification code');
      }
    }
    setIsEnabling2FA(false);
  };

  const handleDisable2FA = async () => {
    setSecuritySettings(prev => ({
      ...prev,
      twoFactorEnabled: false,
      backupCodes: []
    }));
    setTwoFactorStep(1);
    setVerificationCode('');
    console.log('Two-factor authentication disabled');
  };

  const handleRevokeSession = (sessionId) => {
    console.log(`Revoking session ${sessionId}`);
  };

  const handleToggle = (field) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString();
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return { strength: 'weak', color: 'bg-error' };
    if (password.length < 10) return { strength: 'medium', color: 'bg-warning-500' };
    return { strength: 'strong', color: 'bg-success' };
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <h5 className="text-sm font-medium text-text-primary">{label}</h5>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          enabled ? 'bg-primary' : 'bg-secondary-300'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-t-lg"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
            <Icon name="Lock" size={20} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Security Settings</h3>
            <p className="text-sm text-text-secondary">Manage password and account security</p>
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
          <div className="mt-6 space-y-8">
            {/* Password Change */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Change Password</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary mb-4">
                    Last changed: {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  {passwordForm.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-secondary-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${getPasswordStrength(passwordForm.newPassword).color}`}
                            style={{ width: passwordForm.newPassword.length < 6 ? '33%' : passwordForm.newPassword.length < 10 ? '66%' : '100%' }}
                          />
                        </div>
                        <span className="text-xs text-text-secondary capitalize">
                          {getPasswordStrength(passwordForm.newPassword).strength}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handlePasswordChange}
                    loading={isChangingPassword}
                    disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                    iconName="Key"
                    iconPosition="left"
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Two-Factor Authentication</h4>
              {!securitySettings.twoFactorEnabled ? (
                <div className="space-y-4">
                  {twoFactorStep === 1 && (
                    <div>
                      <div className="bg-warning-50 border border-warning-100 rounded-lg p-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <Icon name="Shield" size={20} className="text-warning-600 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-text-primary">Enhance Your Account Security</h5>
                            <p className="text-sm text-text-secondary mt-1">
                              Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your phone.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        onClick={handleEnable2FA}
                        loading={isEnabling2FA}
                        iconName="Smartphone"
                        iconPosition="left"
                      >
                        Enable Two-Factor Authentication
                      </Button>
                    </div>
                  )}

                  {twoFactorStep === 2 && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h5 className="font-medium text-text-primary mb-2">Scan QR Code</h5>
                        <p className="text-sm text-text-secondary mb-4">
                          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        <div className="inline-block p-4 bg-white border border-border rounded-lg">
                          <img src={qrCodeUrl} alt="QR Code for 2FA setup" className="w-48 h-48" />
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                          Manual entry key: JBSWY3DPEHPK3PXP
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Verification Code</label>
                        <Input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="text-center text-lg tracking-widest"
                        />
                        <p className="text-xs text-text-muted mt-1">
                          Enter the 6-digit code from your authenticator app
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="ghost"
                          onClick={() => setTwoFactorStep(1)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleEnable2FA}
                          loading={isEnabling2FA}
                          disabled={verificationCode.length !== 6}
                        >
                          Verify & Enable
                        </Button>
                      </div>
                    </div>
                  )}

                  {twoFactorStep === 3 && (
                    <div className="space-y-4">
                      <div className="bg-success-50 border border-success-100 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                          <div>
                            <h5 className="font-medium text-text-primary">Two-Factor Authentication Enabled</h5>
                            <p className="text-sm text-text-secondary mt-1">
                              Your account is now protected with two-factor authentication.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-text-primary mb-2">Backup Codes</h5>
                        <p className="text-sm text-text-secondary mb-3">
                          Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
                        </p>
                        <div className="bg-secondary-50 border border-border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-sm">
                            {securitySettings.backupCodes.map((code, index) => (
                              <div key={index} className="text-text-primary">{code}</div>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <Button variant="ghost" iconName="Download">
                            Download Codes
                          </Button>
                          <Button variant="ghost" iconName="Copy">
                            Copy Codes
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-success-50 border border-success-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon name="CheckCircle" size={20} className="text-success" />
                        <div>
                          <h5 className="font-medium text-text-primary">Two-Factor Authentication Enabled</h5>
                          <p className="text-sm text-text-secondary">Your account is protected with 2FA</p>
                        </div>
                      </div>
                      <Button
                        variant="danger"
                        onClick={handleDisable2FA}
                        size="sm"
                      >
                        Disable
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-text-primary mb-2">Backup Codes</h5>
                    <p className="text-sm text-text-secondary mb-3">
                      You have {securitySettings.backupCodes.length} unused backup codes remaining.
                    </p>
                    <Button variant="ghost" iconName="RefreshCw">
                      Generate New Codes
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Security Preferences */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Security Preferences</h4>
              <div className="space-y-1 divide-y divide-border">
                <ToggleSwitch
                  enabled={securitySettings.loginNotifications}
                  onToggle={() => handleToggle('loginNotifications')}
                  label="Login Notifications"
                  description="Get notified when someone signs in to your account"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">Session Timeout</label>
                <select
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                  className="w-48 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={240}>4 hours</option>
                  <option value={480}>8 hours</option>
                </select>
                <p className="text-xs text-text-muted mt-1">
                  Automatically sign out after this period of inactivity
                </p>
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <h4 className="text-md font-medium text-text-primary mb-4">Active Sessions</h4>
              <div className="space-y-3">
                {activeSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <Icon name="Monitor" size={20} className="text-text-secondary" />
                      </div>
                      <div>
                        <h5 className="font-medium text-text-primary flex items-center space-x-2">
                          <span>{session.device}</span>
                          {session.current && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary">
                              Current
                            </span>
                          )}
                        </h5>
                        <p className="text-sm text-text-secondary">
                          {session.location} • {formatLastActive(session.lastActive)}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        onClick={() => handleRevokeSession(session.id)}
                        size="sm"
                        iconName="X"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="danger" iconName="LogOut">
                  Sign Out All Other Sessions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySection;
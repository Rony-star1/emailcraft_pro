import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileSection = ({ isOpen, onToggle }) => {
  const [profileData, setProfileData] = useState({
    businessName: "EmailCraft Solutions",
    firstName: "John",
    lastName: "Doe",
    email: "john@emailcraft.com",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    senderName: "John from EmailCraft",
    senderEmail: "john@emailcraft.com",
    companyAddress: "123 Business St, Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    // Show success toast (would be implemented with toast system)
    console.log('Profile updated successfully');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data (in real app, would fetch from server)
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary-50 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-t-lg"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Profile Information</h3>
            <p className="text-sm text-text-secondary">Manage your business profile and sender details</p>
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
          <div className="mt-6">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Business Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Business Name</label>
                      <p className="text-text-primary">{profileData.businessName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Timezone</label>
                      <p className="text-text-primary">
                        {timezones.find(tz => tz.value === profileData.timezone)?.label}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                      <p className="text-text-primary">{profileData.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                      <p className="text-text-primary">{profileData.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                      <p className="text-text-primary">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                      <p className="text-text-primary">{profileData.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Sender Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Default Sender Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Sender Name</label>
                      <p className="text-text-primary">{profileData.senderName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Sender Email</label>
                      <p className="text-text-primary">{profileData.senderEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Business Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-1">Address</label>
                      <p className="text-text-primary">{profileData.companyAddress}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                      <p className="text-text-primary">{profileData.city}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                      <p className="text-text-primary">{profileData.state}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">ZIP Code</label>
                      <p className="text-text-primary">{profileData.zipCode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
                      <p className="text-text-primary">{profileData.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-6">
                {/* Business Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Business Name</label>
                      <Input
                        type="text"
                        value={profileData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Enter business name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Timezone</label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {timezones.map(tz => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                      <Input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                      <Input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Sender Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Default Sender Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Sender Name</label>
                      <Input
                        type="text"
                        value={profileData.senderName}
                        onChange={(e) => handleInputChange('senderName', e.target.value)}
                        placeholder="Enter sender name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Sender Email</label>
                      <Input
                        type="email"
                        value={profileData.senderEmail}
                        onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                        placeholder="Enter sender email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">Business Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-2">Address</label>
                      <Input
                        type="text"
                        value={profileData.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        placeholder="Enter business address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">City</label>
                      <Input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">State</label>
                      <Input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">ZIP Code</label>
                      <Input
                        type="text"
                        value={profileData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="Enter ZIP code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Country</label>
                      <Input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Enter country"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={isSaving}
                    iconName="Save"
                    iconPosition="left"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
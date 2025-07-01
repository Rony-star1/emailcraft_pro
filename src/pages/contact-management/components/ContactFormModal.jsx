import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactFormModal = ({ isOpen, onClose, onSave, contact = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tags: '',
    source: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && contact) {
        setFormData({
          name: contact.name || '',
          email: contact.email || '',
          tags: contact.tags ? contact.tags.join(', ') : '',
          source: contact.source || '',
          notes: contact.notes || ''
        });
      } else {
        setFormData({
          name: '',
          email: '',
          tags: '',
          source: '',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, isEditing, contact]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      };

      await onSave(contactData);
      handleClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save contact. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      tags: '',
      source: '',
      notes: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg shadow-elevation-4 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {isEditing ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Full Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
              className={errors.name ? 'border-error focus:border-error focus:ring-error' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={errors.email ? 'border-error focus:border-error focus:ring-error' : ''}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-text-primary mb-1">
              Tags
            </label>
            <Input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas"
            />
            <p className="mt-1 text-xs text-text-muted">
              Separate multiple tags with commas (e.g., customer, vip, newsletter)
            </p>
          </div>

          {/* Source */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-text-primary mb-1">
              Source
            </label>
            <select
              id="source"
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary bg-surface"
            >
              <option value="">Select source</option>
              <option value="Website">Website</option>
              <option value="Social Media">Social Media</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Event">Event</option>
              <option value="Referral">Referral</option>
              <option value="Manual Entry">Manual Entry</option>
              <option value="CSV Import">CSV Import</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-text-primary mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about this contact"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary bg-surface resize-none"
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error-600" />
                <span className="text-sm text-error-700">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              iconName={isEditing ? "Save" : "UserPlus"}
              iconPosition="left"
            >
              {isEditing ? 'Update Contact' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;
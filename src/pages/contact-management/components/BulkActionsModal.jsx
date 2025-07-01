import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BulkActionsModal = ({ 
  isOpen, 
  onClose, 
  selectedContacts, 
  actionType, // 'edit' or 'delete'
  onConfirm 
}) => {
  const [formData, setFormData] = useState({
    addTags: '',
    removeTags: '',
    changeSource: '',
    changeStatus: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (actionType === 'delete') {
        await onConfirm({ action: 'delete' });
      } else {
        const updates = {};
        
        if (formData.addTags) {
          updates.addTags = formData.addTags.split(',').map(tag => tag.trim()).filter(Boolean);
        }
        
        if (formData.removeTags) {
          updates.removeTags = formData.removeTags.split(',').map(tag => tag.trim()).filter(Boolean);
        }
        
        if (formData.changeSource) {
          updates.source = formData.changeSource;
        }
        
        if (formData.changeStatus) {
          updates.status = formData.changeStatus;
        }

        await onConfirm({ action: 'edit', updates });
      }
      
      handleClose();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      addTags: '',
      removeTags: '',
      changeSource: '',
      changeStatus: ''
    });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg shadow-elevation-4 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">
            {actionType === 'delete' ? 'Delete Contacts' : 'Edit Contacts'}
          </h2>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center space-x-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {selectedContacts.length} contacts selected
              </span>
            </div>
          </div>

          {actionType === 'delete' ? (
            <div className="space-y-4">
              <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-error-700 mb-1">Confirm Deletion</h4>
                    <p className="text-sm text-error-600">
                      This action cannot be undone. The selected contacts will be permanently removed from your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Add Tags */}
              <div>
                <label htmlFor="addTags" className="block text-sm font-medium text-text-primary mb-1">
                  Add Tags
                </label>
                <Input
                  id="addTags"
                  type="text"
                  value={formData.addTags}
                  onChange={(e) => setFormData(prev => ({ ...prev, addTags: e.target.value }))}
                  placeholder="Enter tags to add (comma-separated)"
                />
              </div>

              {/* Remove Tags */}
              <div>
                <label htmlFor="removeTags" className="block text-sm font-medium text-text-primary mb-1">
                  Remove Tags
                </label>
                <Input
                  id="removeTags"
                  type="text"
                  value={formData.removeTags}
                  onChange={(e) => setFormData(prev => ({ ...prev, removeTags: e.target.value }))}
                  placeholder="Enter tags to remove (comma-separated)"
                />
              </div>

              {/* Change Source */}
              <div>
                <label htmlFor="changeSource" className="block text-sm font-medium text-text-primary mb-1">
                  Change Source
                </label>
                <select
                  id="changeSource"
                  value={formData.changeSource}
                  onChange={(e) => setFormData(prev => ({ ...prev, changeSource: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary bg-surface"
                >
                  <option value="">Keep current source</option>
                  <option value="Website">Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Email Campaign">Email Campaign</option>
                  <option value="Event">Event</option>
                  <option value="Referral">Referral</option>
                  <option value="Manual Entry">Manual Entry</option>
                  <option value="CSV Import">CSV Import</option>
                </select>
              </div>

              {/* Change Status */}
              <div>
                <label htmlFor="changeStatus" className="block text-sm font-medium text-text-primary mb-1">
                  Change Status
                </label>
                <select
                  id="changeStatus"
                  value={formData.changeStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, changeStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-primary focus:border-primary bg-surface"
                >
                  <option value="">Keep current status</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="bounced">Bounced</option>
                </select>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant={actionType === 'delete' ? 'danger' : 'primary'}
            onClick={actionType === 'delete' ? handleSubmit : undefined}
            type={actionType === 'edit' ? 'submit' : 'button'}
            loading={isSubmitting}
            iconName={actionType === 'delete' ? 'Trash2' : 'Save'}
            iconPosition="left"
          >
            {actionType === 'delete' ? 'Delete Contacts' : 'Apply Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsModal;
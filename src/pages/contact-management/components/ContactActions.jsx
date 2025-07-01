import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContactActions = ({ 
  selectedContacts, 
  onAddContact, 
  onImportCSV, 
  onExportContacts, 
  onBulkDelete, 
  onBulkEdit,
  totalContacts 
}) => {
  const hasSelectedContacts = selectedContacts.length > 0;

  return (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="primary"
            onClick={onAddContact}
            iconName="UserPlus"
            iconPosition="left"
            className="flex items-center justify-center sm:justify-start"
          >
            Add Contact
          </Button>
          
          <Button
            variant="outline"
            onClick={onImportCSV}
            iconName="Upload"
            iconPosition="left"
            className="flex items-center justify-center sm:justify-start"
          >
            Import CSV
          </Button>
          
          <Button
            variant="ghost"
            onClick={onExportContacts}
            iconName="Download"
            iconPosition="left"
            className="flex items-center justify-center sm:justify-start"
            disabled={totalContacts === 0}
          >
            Export
          </Button>
        </div>

        {/* Bulk Actions */}
        {hasSelectedContacts && (
          <div className="flex items-center space-x-2 p-3 bg-primary-50 rounded-md border border-primary-100">
            <span className="text-sm font-medium text-primary">
              {selectedContacts.length} selected
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                onClick={onBulkEdit}
                className="p-1 h-8 w-8 text-primary hover:bg-primary-100"
                title="Edit selected contacts"
              >
                <Icon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                onClick={onBulkDelete}
                className="p-1 h-8 w-8 text-error hover:bg-error-50"
                title="Delete selected contacts"
              >
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Contact Count Summary */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>Total Contacts: {totalContacts}</span>
          <span className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>Limit: 500 contacts</span>
          </span>
        </div>
        
        {totalContacts > 400 && (
          <div className="mt-2 p-2 bg-warning-50 border border-warning-200 rounded-md">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-warning-600" />
              <span className="text-xs text-warning-700">
                Approaching contact limit ({totalContacts}/500)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactActions;
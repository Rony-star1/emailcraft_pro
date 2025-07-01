import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CSVImportModal = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setErrors(['Please select a CSV file']);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(['File size must be less than 5MB']);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    processFile(selectedFile);
  };

  const processFile = (file) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          setErrors(['CSV file is empty']);
          setIsProcessing(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['name', 'email'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          setErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
          setIsProcessing(false);
          return;
        }

        const contacts = [];
        const validationErrors = [];
        
        for (let i = 1; i < Math.min(lines.length, 501); i++) { // Limit to 500 contacts
          const values = lines[i].split(',').map(v => v.trim());
          const contact = {};
          
          headers.forEach((header, index) => {
            contact[header] = values[index] || '';
          });

          // Validate email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(contact.email)) {
            validationErrors.push(`Row ${i + 1}: Invalid email format`);
            continue;
          }

          // Validate name
          if (!contact.name || contact.name.length < 2) {
            validationErrors.push(`Row ${i + 1}: Name is required and must be at least 2 characters`);
            continue;
          }

          contacts.push({
            name: contact.name,
            email: contact.email,
            tags: contact.tags ? contact.tags.split(';').map(t => t.trim()) : [],
            source: contact.source || 'CSV Import'
          });
        }

        if (lines.length > 501) {
          validationErrors.push('Only first 500 contacts will be imported');
        }

        setPreview({
          totalRows: lines.length - 1,
          validContacts: contacts.length,
          contacts: contacts.slice(0, 5), // Show first 5 for preview
          headers: headers
        });

        setErrors(validationErrors);
        setIsProcessing(false);
      } catch (error) {
        setErrors(['Error processing CSV file. Please check the format.']);
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    if (preview && preview.validContacts > 0) {
      onImport(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setErrors([]);
    setIsProcessing(false);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">Import Contacts from CSV</h2>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!file ? (
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary hover:bg-primary-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Icon name="Upload" size={48} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Drop your CSV file here
                </h3>
                <p className="text-text-secondary mb-4">
                  or click to browse files
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Requirements */}
              <div className="bg-secondary-50 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2">CSV Requirements:</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Required columns: name, email</li>
                  <li>• Optional columns: tags (semicolon-separated), source</li>
                  <li>• Maximum 500 contacts per import</li>
                  <li>• File size limit: 5MB</li>
                  <li>• First row should contain column headers</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <Icon name="FileText" size={20} className="text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{file.name}</p>
                  <p className="text-sm text-text-secondary">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                {isProcessing && (
                  <Icon name="Loader2" size={20} className="animate-spin text-primary" />
                )}
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-error-700 mb-1">Validation Issues:</h4>
                      <ul className="text-sm text-error-600 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="space-y-4">
                  <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="CheckCircle" size={16} className="text-success-600" />
                      <span className="font-medium text-success-700">
                        {preview.validContacts} valid contacts found
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-text-primary mb-3">Preview (first 5 contacts):</h4>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary-50">
                          <tr>
                            <th className="text-left p-3 font-medium">Name</th>
                            <th className="text-left p-3 font-medium">Email</th>
                            <th className="text-left p-3 font-medium">Tags</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {preview.contacts.map((contact, index) => (
                            <tr key={index}>
                              <td className="p-3">{contact.name}</td>
                              <td className="p-3">{contact.email}</td>
                              <td className="p-3">
                                {contact.tags.length > 0 ? contact.tags.join(', ') : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          {preview && preview.validContacts > 0 && (
            <Button
              variant="primary"
              onClick={handleImport}
              iconName="Upload"
              iconPosition="left"
            >
              Import {preview.validContacts} Contacts
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ExportDataPanel = () => {
  const [exportType, setExportType] = useState('csv');
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedMetrics, setSelectedMetrics] = useState(['opens', 'clicks', 'bounces']);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const exportTypes = [
    { value: 'csv', label: 'CSV File', icon: 'FileText', description: 'Comma-separated values for spreadsheets' },
    { value: 'excel', label: 'Excel File', icon: 'FileSpreadsheet', description: 'Microsoft Excel format with charts' },
    { value: 'pdf', label: 'PDF Report', icon: 'FileImage', description: 'Formatted report with visualizations' }
  ];

  const dateRanges = [
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'thisyear', label: 'This year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const availableMetrics = [
    { key: 'opens', label: 'Opens', description: 'Email open rates and counts' },
    { key: 'clicks', label: 'Clicks', description: 'Link click rates and counts' },
    { key: 'bounces', label: 'Bounces', description: 'Bounce rates and reasons' },
    { key: 'unsubscribes', label: 'Unsubscribes', description: 'Unsubscribe rates and counts' },
    { key: 'geography', label: 'Geography', description: 'Geographic distribution of opens' },
    { key: 'devices', label: 'Devices', description: 'Device and client analytics' },
    { key: 'timing', label: 'Timing', description: 'Send time optimization data' },
    { key: 'engagement', label: 'Engagement', description: 'Overall engagement metrics' }
  ];

  const handleMetricToggle = (metricKey) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey)
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would trigger the actual export
    console.log('Exporting data:', {
      type: exportType,
      dateRange,
      customStartDate,
      customEndDate,
      metrics: selectedMetrics
    });
    
    setIsExporting(false);
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Export completed successfully!');
  };

  const getEstimatedSize = () => {
    const baseSize = selectedMetrics.length * 0.5; // MB per metric
    const multiplier = dateRange === 'thisyear' ? 12 : dateRange === 'last90days' ? 3 : 1;
    return (baseSize * multiplier).toFixed(1);
  };

  const getEstimatedRows = () => {
    const baseRows = 100; // campaigns per month
    const multiplier = dateRange === 'thisyear' ? 12 : dateRange === 'last90days' ? 3 : 1;
    return (baseRows * multiplier).toLocaleString();
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon name="Download" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Export Analytics Data</h3>
          <p className="text-sm text-text-muted">Download your campaign data for external analysis</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Export Format</label>
          <div className="grid sm:grid-cols-3 gap-3">
            {exportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setExportType(type.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  exportType === type.value
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-secondary-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon name={type.icon} size={20} className={exportType === type.value ? 'text-primary' : 'text-text-secondary'} />
                  <span className="font-medium text-text-primary">{type.label}</span>
                </div>
                <p className="text-xs text-text-muted">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Date Range</label>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {dateRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  placeholder="Start date"
                />
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  placeholder="End date"
                />
              </div>
            )}
          </div>
        </div>

        {/* Metrics Selection */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Include Metrics ({selectedMetrics.length} selected)
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {availableMetrics.map((metric) => (
              <label
                key={metric.key}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-secondary-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.key)}
                  onChange={() => handleMetricToggle(metric.key)}
                  className="mt-0.5 rounded border-border focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-text-primary">{metric.label}</div>
                  <div className="text-xs text-text-muted">{metric.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Summary */}
        <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
          <h4 className="font-medium text-text-primary mb-3 flex items-center space-x-2">
            <Icon name="Info" size={16} />
            <span>Export Summary</span>
          </h4>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-text-muted">Estimated size:</span>
              <div className="font-medium text-text-primary">{getEstimatedSize()} MB</div>
            </div>
            <div>
              <span className="text-text-muted">Estimated rows:</span>
              <div className="font-medium text-text-primary">{getEstimatedRows()}</div>
            </div>
            <div>
              <span className="text-text-muted">Format:</span>
              <div className="font-medium text-text-primary">
                {exportTypes.find(t => t.value === exportType)?.label}
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-text-muted">
            <Icon name="Shield" size={14} className="inline mr-1" />
            Your data is exported securely and never shared with third parties
          </div>
          
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={selectedMetrics.length === 0 || isExporting}
            loading={isExporting}
            iconName="Download"
            className="sm:w-auto w-full"
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportDataPanel;
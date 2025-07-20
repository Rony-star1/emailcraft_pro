import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ContentEditor from './components/ContentEditor';
import SubjectLineGenerator from './components/SubjectLineGenerator';
import RecipientSelector from './components/RecipientSelector';
import ScheduleSettings from './components/ScheduleSettings';
import PreviewModal from './components/PreviewModal';
import ProgressIndicator from './components/ProgressIndicator';

const CampaignBuilder = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [campaignName, setCampaignName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Content state
  const [emailContent, setEmailContent] = useState('');
  
  // Subject line state
  const [subjectLine, setSubjectLine] = useState('');
  
  // Recipients state
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  
  // Schedule state
  const [scheduleType, setScheduleType] = useState('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  // Progress tracking
  const [completedTabs, setCompletedTabs] = useState([]);

  const tabs = [
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'subject', label: 'Subject Line', icon: 'Type' },
    { id: 'recipients', label: 'Recipients', icon: 'Users' },
    { id: 'schedule', label: 'Schedule', icon: 'Calendar' }
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      if (campaignName || emailContent || subjectLine) {
        setIsSaving(true);
        setTimeout(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        }, 1000);
      }
    };

    const timer = setTimeout(autoSave, 2000);
    return () => clearTimeout(timer);
  }, [campaignName, emailContent, subjectLine, selectedLists, scheduleType]);

  // Update completed tabs based on content
  useEffect(() => {
    const completed = [];
    
    if (emailContent.trim()) completed.push('content');
    if (subjectLine.trim()) completed.push('subject');
    if (selectedLists.length > 0) completed.push('recipients');
    if (scheduleType === 'immediate' || (scheduleType === 'scheduled' && scheduledDate)) {
      completed.push('schedule');
    }
    
    setCompletedTabs(completed);
  }, [emailContent, subjectLine, selectedLists, scheduleType, scheduledDate]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1500);
  };

  const handleSendCampaign = () => {
    if (completedTabs.length === tabs.length) {
      console.log('Sending campaign...', {
        name: campaignName,
        content: emailContent,
        subject: subjectLine,
        lists: selectedLists,
        schedule: scheduleType,
        scheduledDate: scheduledDate
      });
    }
  };

  const canSend = completedTabs.length === tabs.length && campaignName.trim();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <ContentEditor
            content={emailContent}
            onChange={setEmailContent}
            onPreview={() => setShowPreview(true)}
          />
        );
      case 'subject':
        return (
          <SubjectLineGenerator
            subjectLine={subjectLine}
            onChange={setSubjectLine}
          />
        );
      case 'recipients':
        return (
          <RecipientSelector
            selectedLists={selectedLists}
            onListChange={setSelectedLists}
            selectedSegments={selectedSegments}
            onSegmentChange={setSelectedSegments}
          />
        );
      case 'schedule':
        return (
          <ScheduleSettings
            scheduleType={scheduleType}
            onScheduleChange={setScheduleType}
            scheduledDate={scheduledDate}
            onDateChange={setScheduledDate}
            timezone={timezone}
            onTimezoneChange={setTimezone}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  Campaign Builder
                </h1>
                <p className="text-text-secondary">
                  Create and configure your email campaign with AI-powered optimization
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {lastSaved && (
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Icon name="Clock" size={14} />
                    <span>
                      Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  loading={isSaving}
                  iconName="Save"
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(true)}
                  iconName="Eye"
                >
                  Preview
                </Button>
                
                <Button
                  variant="primary"
                  onClick={handleSendCampaign}
                  disabled={!canSend}
                  iconName="Send"
                >
                  Send Campaign
                </Button>
              </div>
            </div>
            
            {/* Campaign Name */}
            <div className="mt-6">
              <Input
                type="text"
                placeholder="Enter campaign name..."
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="text-lg font-medium"
              />
            </div>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator
            currentTab={activeTab}
            completedTabs={completedTabs}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-lg p-4 sticky top-24">
                <h3 className="font-semibold text-text-primary mb-4">
                  Campaign Steps
                </h3>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const isCompleted = completedTabs.includes(tab.id);
                    const isCurrent = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                          isCurrent
                            ? 'bg-primary text-white'
                            : isCompleted
                            ? 'bg-success-50 text-success-700 hover:bg-success-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <Icon name="CheckCircle" size={18} />
                          ) : (
                            <Icon name={tab.icon} size={18} />
                          )}
                        </div>
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
                
                {/* Mobile Tab Navigation */}
                <div className="lg:hidden mt-6 pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1].id);
                        }
                      }}
                      disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                      iconName="ChevronLeft"
                      className="flex-1"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                        if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1].id);
                        }
                      }}
                      disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
                      iconName="ChevronRight"
                      iconPosition="right"
                      className="flex-1"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-surface border border-border rounded-lg p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={emailContent}
        subjectLine={subjectLine}
      />
    </div>
  );
};

export default CampaignBuilder;
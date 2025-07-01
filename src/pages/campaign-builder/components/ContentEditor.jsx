import React, { useState, useRef, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContentEditor = ({ content, onChange, onPreview }) => {
  const [activeFormat, setActiveFormat] = useState({});
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const editorRef = useRef(null);

  const templates = [
    {
      id: 'newsletter',
      name: 'Newsletter',
      preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop',
      content: `<h2>Weekly Newsletter</h2>\n<p>Dear Subscriber,</p>\n<p>Here's what's new this week...</p>\n<p>Best regards,<br>Your Team</p>`
    },
    {
      id: 'promotion',
      name: 'Promotion',
      preview: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?w=300&h=200&fit=crop',
      content: `<h2>Special Offer - 50% Off!</h2>\n<p>Limited time offer on all products.</p>\n<p>Use code: SAVE50</p>\n<p>Shop now and save big!</p>`
    },
    {
      id: 'announcement',
      name: 'Announcement',
      preview: 'https://images.pixabay.com/photo/2016/11/29/06/15/plans-1867745_1280.jpg?w=300&h=200&fit=crop',
      content: `<h2>Important Announcement</h2>\n<p>We're excited to share some news with you...</p>\n<p>Stay tuned for more updates!</p>`
    }
  ];

  const formatButtons = [
    { name: 'Bold', icon: 'Bold', command: 'bold' },
    { name: 'Italic', icon: 'Italic', command: 'italic' },
    { name: 'Underline', icon: 'Underline', command: 'underline' },
    { name: 'Link', icon: 'Link', command: 'createLink' }
  ];

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleFormat = (command) => {
    if (command === 'createLink') {
      setShowLinkDialog(true);
      return;
    }
    
    document.execCommand(command, false, null);
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = {};
    formatButtons.forEach(button => {
      if (button.command !== 'createLink') {
        formats[button.command] = document.queryCommandState(button.command);
      }
    });
    setActiveFormat(formats);
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      document.execCommand('insertHTML', false, `<a href="${linkUrl}" target="_blank">${linkText}</a>`);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      handleContentChange();
    }
  };

  const applyTemplate = (template) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = template.content;
      onChange(template.content);
      setSelectedTemplate(template.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Gallery */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Email Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
              }`}
              onClick={() => applyTemplate(template)}
            >
              <div className="aspect-video bg-secondary-100 overflow-hidden">
                <img
                  src={template.preview}
                  alt={`${template.name} template preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-medium text-text-primary">{template.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="border border-border rounded-lg">
        <div className="flex items-center gap-2 p-3 border-b border-border bg-secondary-50">
          {formatButtons.map((button) => (
            <Button
              key={button.command}
              variant={activeFormat[button.command] ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleFormat(button.command)}
              iconName={button.icon}
              className="p-2"
              title={button.name}
            />
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            iconName="Eye"
            className="p-2"
            title="Preview"
          />
        </div>

        {/* Editor Content */}
        <div
          ref={editorRef}
          contentEditable
          className="min-h-96 p-4 focus:outline-none"
          onInput={handleContentChange}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          style={{ lineHeight: '1.6' }}
          placeholder="Start typing your email content..."
        />
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Link Text
                </label>
                <Input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  URL
                </label>
                <Input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={insertLink}
                  disabled={!linkUrl || !linkText}
                  className="flex-1"
                >
                  Insert Link
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                    setLinkText('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
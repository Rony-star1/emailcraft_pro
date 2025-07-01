import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SubjectLineGenerator = ({ subjectLine, onChange }) => {
  const [niches, setNiches] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('engagement');
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSubject, setCustomSubject] = useState(subjectLine || '');

  const campaignGoals = [
    { value: 'engagement', label: 'Increase Engagement', icon: 'Heart' },
    { value: 'sales', label: 'Drive Sales', icon: 'ShoppingCart' },
    { value: 'awareness', label: 'Brand Awareness', icon: 'Eye' },
    { value: 'retention', label: 'Customer Retention', icon: 'Users' },
    { value: 'newsletter', label: 'Newsletter', icon: 'Mail' }
  ];

  const mockSuggestions = {
    engagement: [
      { text: "🔥 Don't Miss Out: Your Weekly Dose of [Niche] Insights", prediction: 85 },
      { text: "Breaking: The [Niche] Trend Everyone's Talking About", prediction: 78 },
      { text: "Your [Niche] Journey Just Got More Exciting", prediction: 72 },
      { text: "Inside Scoop: What [Niche] Experts Don't Want You to Know", prediction: 81 },
      { text: "Transform Your [Niche] Game in 5 Minutes", prediction: 76 }
    ],
    sales: [
      { text: "Flash Sale: 50% Off All [Niche] Products Today Only", prediction: 92 },
      { text: "Last Chance: Your [Niche] Cart is Waiting", prediction: 88 },
      { text: "Exclusive Deal for [Niche] Enthusiasts Like You", prediction: 84 },
      { text: "Limited Time: Premium [Niche] Bundle at 70% Off", prediction: 89 },
      { text: "Your [Niche] Wishlist Items Are Now on Sale", prediction: 86 }
    ],
    awareness: [
      { text: "Meet the Future of [Niche]: Revolutionary Changes Ahead", prediction: 79 },
      { text: "Why [Niche] Leaders Choose Our Platform", prediction: 74 },
      { text: "The [Niche] Revolution Starts Here", prediction: 77 },
      { text: "Discover What Makes Us Different in [Niche]", prediction: 71 },
      { text: "Join 10,000+ [Niche] Professionals Who Trust Us", prediction: 83 }
    ],
    retention: [
      { text: "We Miss You! Here's What's New in [Niche]", prediction: 87 },
      { text: "Your [Niche] Community Has Been Asking About You", prediction: 82 },
      { text: "Come Back and Get 30% Off Your Next [Niche] Purchase", prediction: 90 },
      { text: "Special Offer Just for Returning [Niche] Members", prediction: 85 },
      { text: "Your [Niche] Journey Continues Here", prediction: 78 }
    ],
    newsletter: [
      { text: "This Week in [Niche]: Top Stories & Insights", prediction: 75 },
      { text: "Your Weekly [Niche] Roundup is Here", prediction: 73 },
      { text: "5 [Niche] Trends You Can't Afford to Miss", prediction: 80 },
      { text: "Weekly [Niche] Digest: What You Need to Know", prediction: 76 },
      { text: "Your [Niche] Update: Fresh Insights Inside", prediction: 78 }
    ]
  };

  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const goalSuggestions = mockSuggestions[campaignGoal] || mockSuggestions.engagement;
      const processedSuggestions = goalSuggestions.map(suggestion => ({
        ...suggestion,
        text: niches ? suggestion.text.replace(/\[Niche\]/g, niches) : suggestion.text.replace(/\[Niche\]/g, 'Your Business')
      }));
      
      setSuggestions(processedSuggestions);
      setIsGenerating(false);
    }, 2000);
  };

  const selectSuggestion = (suggestion) => {
    setCustomSubject(suggestion.text);
    onChange(suggestion.text);
  };

  const handleCustomSubjectChange = (e) => {
    const value = e.target.value;
    setCustomSubject(value);
    onChange(value);
  };

  const getPredictionColor = (prediction) => {
    if (prediction >= 85) return 'text-success';
    if (prediction >= 75) return 'text-warning';
    return 'text-error';
  };

  const getPredictionBg = (prediction) => {
    if (prediction >= 85) return 'bg-success-50 border-success-200';
    if (prediction >= 75) return 'bg-warning-50 border-warning-200';
    return 'bg-error-50 border-error-200';
  };

  return (
    <div className="space-y-6">
      {/* AI Configuration */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Icon name="Sparkles" size={20} />
          AI Subject Line Generator
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Target Niche/Audience
            </label>
            <Input
              type="text"
              value={niches}
              onChange={(e) => setNiches(e.target.value)}
              placeholder="e.g., Vegan Fitness Coaches, Indie Game Developers"
              className="w-full"
            />
            <p className="text-xs text-text-muted mt-1">
              Describe your target audience for personalized suggestions
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Campaign Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {campaignGoals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setCampaignGoal(goal.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    campaignGoal === goal.value
                      ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300 text-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon name={goal.icon} size={16} />
                    <span className="text-sm font-medium">{goal.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={generateSuggestions}
            loading={isGenerating}
            iconName="Sparkles"
            className="w-full sm:w-auto"
          >
            {isGenerating ? 'Generating...' : 'Generate Subject Lines'}
          </Button>
        </div>
      </div>

      {/* Generated Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            AI-Generated Suggestions
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  customSubject === suggestion.text
                    ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                } ${getPredictionBg(suggestion.prediction)}`}
                onClick={() => selectSuggestion(suggestion)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-text-primary font-medium mb-2">
                      {suggestion.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">
                        Predicted Open Rate:
                      </span>
                      <span className={`text-xs font-semibold ${getPredictionColor(suggestion.prediction)}`}>
                        {suggestion.prediction}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {customSubject === suggestion.text && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectSuggestion(suggestion);
                      }}
                      iconName="Plus"
                      className="p-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Subject Line */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Subject Line
        </h3>
        <div className="space-y-3">
          <Input
            type="text"
            value={customSubject}
            onChange={handleCustomSubjectChange}
            placeholder="Enter your email subject line"
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">
              Character count: {customSubject.length}/100
            </span>
            {customSubject.length > 50 && (
              <span className="text-warning">
                Consider shorter subject lines for better mobile display
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectLineGenerator;
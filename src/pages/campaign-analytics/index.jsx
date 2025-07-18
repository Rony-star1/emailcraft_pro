import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MetricsOverviewCard from './components/MetricsOverviewCard';
import PerformanceChart from './components/PerformanceChart';
import HeatMapVisualization from './components/HeatMapVisualization';
import CampaignComparisonTable from './components/CampaignComparisonTable';
import ExportDataPanel from './components/ExportDataPanel';

const CampaignAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock analytics data
  const overviewMetrics = [
    {
      title: 'Total Campaigns Sent',
      value: '24',
      subtitle: 'This month',
      icon: 'Mail',
      trend: 'up',
      trendValue: '+12%',
      color: 'primary'
    },
    {
      title: 'Average Open Rate',
      value: '45.2%',
      subtitle: '2,847 total opens',
      icon: 'Eye',
      trend: 'up',
      trendValue: '+3.2%',
      color: 'success'
    },
    {
      title: 'Average Click Rate',
      value: '13.8%',
      subtitle: '892 total clicks',
      icon: 'MousePointer',
      trend: 'up',
      trendValue: '+1.8%',
      color: 'primary'
    },
    {
      title: 'Unsubscribe Rate',
      value: '0.4%',
      subtitle: '28 unsubscribes',
      icon: 'UserMinus',
      trend: 'down',
      trendValue: '-0.1%',
      color: 'error'
    }
  ];

  const timeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    // In a real app, this would trigger data refetch
    console.log('Timeframe changed to:', timeframe);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-secondary-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-secondary-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-secondary-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Campaign Analytics</h1>
              <p className="text-text-muted">
                Comprehensive performance insights to optimize your email marketing effectiveness
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {/* Timeframe Selector */}
              <div className="flex bg-secondary-50 rounded-lg p-1">
                {timeframeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedTimeframe === option.value ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handleTimeframeChange(option.value)}
                    className="px-3 py-1.5 text-sm"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                loading={refreshing}
                iconName="RefreshCw"
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overviewMetrics.map((metric, index) => (
              <MetricsOverviewCard
                key={index}
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                icon={metric.icon}
                trend={metric.trend}
                trendValue={metric.trendValue}
                color={metric.color}
              />
            ))}
          </div>

          {/* Performance Chart */}
          <div className="mb-8">
            <PerformanceChart />
          </div>

          {/* Heat Map Visualization */}
          <div className="mb-8">
            <HeatMapVisualization />
          </div>

          {/* Campaign Comparison Table */}
          <div className="mb-8">
            <CampaignComparisonTable />
          </div>

          {/* Export Data Panel */}
          <div className="mb-8">
            <ExportDataPanel />
          </div>

          {/* Additional Insights Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Insights */}
            <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Quick Insights</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-success-50 rounded-lg border border-success-100">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Best Performing Day</p>
                    <p className="text-xs text-text-muted">Friday campaigns show 15% higher open rates</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-warning-50 rounded-lg border border-warning-100">
                  <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Optimization Opportunity</p>
                    <p className="text-xs text-text-muted">Consider A/B testing subject lines for better engagement</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                  <Icon name="Target" size={16} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Audience Insight</p>
                    <p className="text-xs text-text-muted">Mobile opens account for 68% of total engagement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { action: 'Campaign "Summer Sale 2024" completed', time: '2 hours ago', icon: 'Mail' },
                  { action: 'New subscriber from contact form', time: '4 hours ago', icon: 'UserPlus' },
                  { action: 'Weekly report generated', time: '1 day ago', icon: 'FileText' },
                  { action: 'Campaign "Product Launch" sent', time: '2 days ago', icon: 'Send' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                      <Icon name={activity.icon} size={14} className="text-text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">{activity.action}</p>
                      <p className="text-xs text-text-muted">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                iconName="ArrowRight"
                iconPosition="right"
                className="mt-4"
              >
                View All Activity
              </Button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-6 border-t border-border">
            <div className="text-sm text-text-muted">
              Last updated: {new Date().toLocaleString()}
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                iconName="HelpCircle"
                size="sm"
              >
                Help & Support
              </Button>
              <Button
                variant="primary"
                iconName="Plus"
                size="sm"
              >
                Create New Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
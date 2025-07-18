import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/ui/NavigationBar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import WelcomeHeader from './components/WelcomeHeader';
import MetricsCard from './components/MetricsCard';
import QuickActions from './components/QuickActions';
import OpenRateChart from './components/OpenRateChart';
import ActivityFeed from './components/ActivityFeed';
import RecentCampaigns from './components/RecentCampaigns';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalCampaigns: 0,
    openRate: 0,
    activeSubscribers: 0,
    recentPerformance: 0
  });

  // Simulate data loading
  useEffect(() => {
    const loadDashboardData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        totalCampaigns: 47,
        openRate: 28.4,
        activeSubscribers: 3247,
        recentPerformance: 12.3
      });
      
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const MetricsSkeleton = () => (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-secondary-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-secondary-200 rounded w-16 mb-2"></div>
          <div className="h-4 bg-secondary-200 rounded w-20"></div>
        </div>
        <div className="w-12 h-12 bg-secondary-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbTrail />
          
          <WelcomeHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {isLoading ? (
                  <>
                    <MetricsSkeleton />
                    <MetricsSkeleton />
                    <MetricsSkeleton />
                    <MetricsSkeleton />
                  </>
                ) : (
                  <>
                    <MetricsCard
                      title="Total Campaigns"
                      value={metrics.totalCampaigns.toString()}
                      change="+3 this month"
                      changeType="positive"
                      icon="Send"
                      color="primary"
                    />
                    <MetricsCard
                      title="Average Open Rate"
                      value={`${metrics.openRate}%`}
                      change="+2.1% vs last month"
                      changeType="positive"
                      icon="MailOpen"
                      color="success"
                    />
                    <MetricsCard
                      title="Active Subscribers"
                      value={metrics.activeSubscribers.toLocaleString()}
                      change="+127 this week"
                      changeType="positive"
                      icon="Users"
                      color="accent"
                    />
                    <MetricsCard
                      title="Click Rate"
                      value={`${metrics.recentPerformance}%`}
                      change="+0.8% vs last month"
                      changeType="positive"
                      icon="MousePointerClick"
                      color="warning"
                    />
                  </>
                )}
              </div>
              <OpenRateChart />
              <RecentCampaigns />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <QuickActions />
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
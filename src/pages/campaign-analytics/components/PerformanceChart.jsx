import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { debounce } from '../../../utils/resizeObserverFix';

import Button from '../../../components/ui/Button';

const PerformanceChart = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetrics, setSelectedMetrics] = useState(['opens', 'clicks']);

  const chartData = [
    { date: '2024-01-01', opens: 45, clicks: 12, bounces: 3, unsubscribes: 1 },
    { date: '2024-01-02', opens: 52, clicks: 18, bounces: 2, unsubscribes: 0 },
    { date: '2024-01-03', opens: 38, clicks: 9, bounces: 4, unsubscribes: 2 },
    { date: '2024-01-04', opens: 61, clicks: 22, bounces: 1, unsubscribes: 1 },
    { date: '2024-01-05', opens: 48, clicks: 15, bounces: 3, unsubscribes: 0 },
    { date: '2024-01-06', opens: 55, clicks: 19, bounces: 2, unsubscribes: 1 },
    { date: '2024-01-07', opens: 42, clicks: 11, bounces: 5, unsubscribes: 2 }
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const metrics = [
    { key: 'opens', label: 'Opens', color: '#2563EB' },
    { key: 'clicks', label: 'Clicks', color: '#10B981' },
    { key: 'bounces', label: 'Bounces', color: '#F59E0B' },
    { key: 'unsubscribes', label: 'Unsubscribes', color: '#DC2626' }
  ];

  const toggleMetric = useCallback((metricKey) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  }, []);

  const formatTooltipValue = useCallback((value, name) => {
    return [value, name.charAt(0).toUpperCase() + name.slice(1)];
  }, []);

  const formatXAxisLabel = useCallback((tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  // Memoize chart configuration to prevent unnecessary re-renders
  const chartConfig = useMemo(() => ({
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  }), []);

  // Debounced resize handler
  const handleResize = useMemo(
    () => debounce(() => {
      // Force re-render if needed
      // This is handled by ResponsiveContainer internally
    }, 150),
    []
  );

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Performance Over Time</h3>
          <p className="text-sm text-text-muted">Track your campaign metrics across different time periods</p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Time Range Selector */}
          <div className="flex bg-secondary-50 rounded-lg p-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
                className="px-3 py-1.5 text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map((metric) => (
          <Button
            key={metric.key}
            variant={selectedMetrics.includes(metric.key) ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleMetric(metric.key)}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: metric.color }}
            />
            <span>{metric.label}</span>
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer 
          width="100%" 
          height="100%"
          debounce={150}
          onResize={handleResize}
        >
          <LineChart data={chartData} {...chartConfig}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis stroke="#64748B" fontSize={12} />
            <Tooltip 
              formatter={formatTooltipValue}
              labelStyle={{ color: '#1E293B' }}
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}
            />
            <Legend />
            
            {selectedMetrics.map((metricKey) => {
              const metric = metrics.find(m => m.key === metricKey);
              return (
                <Line
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ fill: metric.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: metric.color, strokeWidth: 2 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
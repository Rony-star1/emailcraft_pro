import React, { useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Local debounce utility
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const OpenRateChart = () => {
  const chartData = [
    { date: '2024-01-01', openRate: 18.5, clicks: 3.2 },
    { date: '2024-01-02', openRate: 22.1, clicks: 4.1 },
    { date: '2024-01-03', openRate: 19.8, clicks: 3.8 },
    { date: '2024-01-04', openRate: 25.3, clicks: 5.2 },
    { date: '2024-01-05', openRate: 21.7, clicks: 4.5 },
    { date: '2024-01-06', openRate: 28.4, clicks: 6.1 },
    { date: '2024-01-07', openRate: 24.9, clicks: 5.3 },
    { date: '2024-01-08', openRate: 26.2, clicks: 5.8 },
    { date: '2024-01-09', openRate: 23.6, clicks: 4.9 },
    { date: '2024-01-10', openRate: 29.1, clicks: 6.4 },
    { date: '2024-01-11', openRate: 27.8, clicks: 6.0 },
    { date: '2024-01-12', openRate: 31.2, clicks: 7.1 },
    { date: '2024-01-13', openRate: 28.9, clicks: 6.3 },
    { date: '2024-01-14', openRate: 33.4, clicks: 7.8 }
  ];

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-text-primary mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  }, [formatDate]);

  // Memoize chart configuration
  const chartConfig = useMemo(() => ({
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  }), []);

  // Debounced resize handler
  const handleResize = useMemo(
    () => debounce(() => {
      // Resize handling is managed by ResponsiveContainer
    }, 150),
    []
  );

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Open Rate Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-text-secondary">Open Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-text-secondary">Click Rate</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer 
          width="100%" 
          height="100%"
          debounce={150}
          onResize={handleResize}
        >
          <LineChart data={chartData} {...chartConfig}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="openRate" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              name="Open Rate"
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="var(--color-accent)" 
              strokeWidth={2}
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
              name="Click Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OpenRateChart;
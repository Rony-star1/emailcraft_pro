import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeatMapVisualization = () => {
  const [selectedView, setSelectedView] = useState('hourly');

  const hourlyData = [
    { hour: '12 AM', mon: 15, tue: 12, wed: 18, thu: 14, fri: 22, sat: 28, sun: 25 },
    { hour: '1 AM', mon: 8, tue: 6, wed: 10, thu: 7, fri: 12, sat: 18, sun: 15 },
    { hour: '2 AM', mon: 5, tue: 4, wed: 6, thu: 3, fri: 8, sat: 12, sun: 10 },
    { hour: '3 AM', mon: 3, tue: 2, wed: 4, thu: 2, fri: 5, sat: 8, sun: 6 },
    { hour: '4 AM', mon: 2, tue: 1, wed: 3, thu: 1, fri: 4, sat: 6, sun: 4 },
    { hour: '5 AM', mon: 4, tue: 3, wed: 5, thu: 3, fri: 7, sat: 9, sun: 7 },
    { hour: '6 AM', mon: 12, tue: 10, wed: 15, thu: 11, fri: 18, sat: 14, sun: 12 },
    { hour: '7 AM', mon: 25, tue: 22, wed: 28, thu: 24, fri: 32, sat: 20, sun: 18 },
    { hour: '8 AM', mon: 45, tue: 42, wed: 48, thu: 44, fri: 52, sat: 25, sun: 22 },
    { hour: '9 AM', mon: 65, tue: 62, wed: 68, thu: 64, fri: 72, sat: 35, sun: 32 },
    { hour: '10 AM', mon: 58, tue: 55, wed: 62, thu: 58, fri: 65, sat: 42, sun: 38 },
    { hour: '11 AM', mon: 52, tue: 48, wed: 55, thu: 51, fri: 58, sat: 45, sun: 41 },
    { hour: '12 PM', mon: 48, tue: 45, wed: 52, thu: 47, fri: 55, sat: 48, sun: 44 },
    { hour: '1 PM', mon: 42, tue: 38, wed: 45, thu: 41, fri: 48, sat: 52, sun: 48 },
    { hour: '2 PM', mon: 38, tue: 35, wed: 42, thu: 38, fri: 45, sat: 55, sun: 52 },
    { hour: '3 PM', mon: 35, tue: 32, wed: 38, thu: 35, fri: 42, sat: 58, sun: 55 },
    { hour: '4 PM', mon: 32, tue: 28, wed: 35, thu: 32, fri: 38, sat: 62, sun: 58 },
    { hour: '5 PM', mon: 28, tue: 25, wed: 32, thu: 28, fri: 35, sat: 65, sun: 62 },
    { hour: '6 PM', mon: 35, tue: 32, wed: 38, thu: 35, fri: 42, sat: 68, sun: 65 },
    { hour: '7 PM', mon: 42, tue: 38, wed: 45, thu: 42, fri: 48, sat: 72, sun: 68 },
    { hour: '8 PM', mon: 38, tue: 35, wed: 42, thu: 38, fri: 45, sat: 65, sun: 62 },
    { hour: '9 PM', mon: 32, tue: 28, wed: 35, thu: 32, fri: 38, sat: 58, sun: 55 },
    { hour: '10 PM', mon: 25, tue: 22, wed: 28, thu: 25, fri: 32, sat: 48, sun: 45 },
    { hour: '11 PM', mon: 18, tue: 15, wed: 22, thu: 18, fri: 25, sat: 35, sun: 32 }
  ];

  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getIntensityColor = (value) => {
    if (value === 0) return 'bg-secondary-100';
    if (value <= 10) return 'bg-primary-100';
    if (value <= 20) return 'bg-primary-200';
    if (value <= 30) return 'bg-primary-300';
    if (value <= 40) return 'bg-primary-400';
    if (value <= 50) return 'bg-primary-500';
    if (value <= 60) return 'bg-primary-600';
    return 'bg-primary-700';
  };

  const getIntensityLabel = (value) => {
    if (value === 0) return 'No activity';
    if (value <= 20) return 'Low activity';
    if (value <= 40) return 'Moderate activity';
    if (value <= 60) return 'High activity';
    return 'Very high activity';
  };

  const getBestTimes = () => {
    const allValues = hourlyData.flatMap(row => 
      days.map(day => ({ hour: row.hour, day, value: row[day] }))
    );
    
    return allValues
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(item => ({
        time: `${dayLabels[days.indexOf(item.day)]} ${item.hour}`,
        rate: `${item.value}%`
      }));
  };

  const bestTimes = getBestTimes();

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Engagement Heat Map</h3>
          <p className="text-sm text-text-muted">Optimal send times based on audience engagement patterns</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={selectedView === 'hourly' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('hourly')}
            iconName="Clock"
          >
            Hourly
          </Button>
          <Button
            variant={selectedView === 'daily' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('daily')}
            iconName="Calendar"
          >
            Daily
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Heat Map */}
        <div className="lg:col-span-3">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Day Headers */}
              <div className="flex mb-2">
                <div className="w-16 flex-shrink-0"></div>
                {dayLabels.map((day) => (
                  <div key={day} className="w-12 text-center text-xs font-medium text-text-secondary">
                    {day}
                  </div>
                ))}
              </div>

              {/* Heat Map Grid */}
              <div className="space-y-1">
                {hourlyData.map((row) => (
                  <div key={row.hour} className="flex items-center">
                    <div className="w-16 text-xs text-text-secondary text-right pr-2 flex-shrink-0">
                      {row.hour}
                    </div>
                    {days.map((day) => (
                      <div
                        key={`${row.hour}-${day}`}
                        className={`w-12 h-8 mx-0.5 rounded ${getIntensityColor(row[day])} 
                          hover:ring-2 hover:ring-primary hover:ring-opacity-50 cursor-pointer
                          transition-all duration-200 flex items-center justify-center`}
                        title={`${dayLabels[days.indexOf(day)]} ${row.hour}: ${row[day]}% open rate - ${getIntensityLabel(row[day])}`}
                      >
                        <span className="text-xs font-medium text-white opacity-0 hover:opacity-100 transition-opacity">
                          {row[day]}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center mt-4 space-x-2">
                <span className="text-xs text-text-muted">Less</span>
                {[0, 10, 20, 30, 40, 50, 60, 70].map((value) => (
                  <div
                    key={value}
                    className={`w-3 h-3 rounded ${getIntensityColor(value)}`}
                  />
                ))}
                <span className="text-xs text-text-muted">More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Times Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Target" size={18} className="text-primary" />
              <h4 className="font-semibold text-text-primary">Best Send Times</h4>
            </div>
            
            <div className="space-y-3">
              {bestTimes.map((time, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-text-primary">{time.time}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{time.rate}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-primary-200">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                iconName="Calendar"
              >
                Schedule Campaign
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 space-y-3">
            <div className="bg-success-50 rounded-lg p-3 border border-success-100">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Peak Hour</span>
              </div>
              <p className="text-lg font-semibold text-text-primary mt-1">Fri 9 AM</p>
              <p className="text-xs text-text-muted">72% open rate</p>
            </div>

            <div className="bg-warning-50 rounded-lg p-3 border border-warning-100">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingDown" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">Low Activity</span>
              </div>
              <p className="text-lg font-semibold text-text-primary mt-1">3-5 AM</p>
              <p className="text-xs text-text-muted">Avoid sending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMapVisualization;
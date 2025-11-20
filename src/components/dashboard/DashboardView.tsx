
import React from 'react';
import { CycleCalendar } from '@/components/ui/CycleCalendar';
import { useCycle } from '@/context/CycleContext';
import { PredictionConfidence } from '@/components/cycle/PredictionConfidence';
import { StatsCards } from './StatsCards';
import { DailySummary } from './DailySummary';

export const DashboardView: React.FC = () => {
  const { 
    pregnancyMode,
    adaptivePrediction
  } = useCycle();

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <StatsCards />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div>
          <h2 className="text-xl font-medium mb-3">Calendar</h2>
          <CycleCalendar />
        </div>

        {/* Daily Summary and Prediction Confidence */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-3">Daily Summary</h2>
            <DailySummary />
          </div>
          
          {/* Prediction Confidence */}
          {adaptivePrediction && !pregnancyMode && (
            <div>
              <h2 className="text-xl font-medium mb-3">Prediction Intelligence</h2>
              <PredictionConfidence prediction={adaptivePrediction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

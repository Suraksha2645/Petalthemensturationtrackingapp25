import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { PeriodTrackingView } from '@/components/period/PeriodTrackingView';
import { SymptomTrackingView } from '@/components/symptoms/SymptomTrackingView';
import { PregnancyModeView } from '@/components/pregnancy/PregnancyModeView';
import { HealthInsightsView } from '@/components/insights/HealthInsightsView';
import { useCycle } from '@/context/CycleContext';

interface IndexProps {
  activeView?: 'dashboard' | 'period' | 'symptoms' | 'pregnancy' | 'insights';
}

const Index = ({ activeView }: IndexProps) => {
  const location = useLocation();
  const { pregnancyMode } = useCycle();
  
  // Determine which view to show based on props or URL
  const getView = () => {
    // If activeView prop is provided, use that
    if (activeView) {
      return activeView;
    }
    
    // Otherwise determine from URL path
    const path = location.pathname;
    if (path === '/period' || path === '/pregnancy') return 'period';
    if (path === '/symptoms') return 'symptoms';
    if (path === '/insights') return 'insights';
    
    // Default to dashboard
    return 'dashboard';
  };
  
  const currentView = getView();
  
  // Get title based on current view
  const getTitle = () => {
    switch(currentView) {
      case 'period': return pregnancyMode ? 'Pregnancy Tracker' : 'Period & Fertility Tracking';
      case 'symptoms': return 'Symptom Tracking';
      case 'insights': return 'Health & Education Insights';
      default: return undefined; // No title for dashboard
    }
  };
  
  // Render the appropriate view
  const renderView = () => {
    switch(currentView) {
      case 'period':
        return <PeriodTrackingView />;
      case 'symptoms':
        return <SymptomTrackingView />;
      case 'insights':
        return <HealthInsightsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <PageContainer title={getTitle()}>
      {renderView()}
    </PageContainer>
  );
};

export default Index;


import React from 'react';
import { Navbar } from './Navbar';
import { format, addDays } from 'date-fns';
import { useCycle } from '@/context/CycleContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, Droplet, Bell, Baby } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  title 
}) => {
  const { daysUntilNextPeriod, fertilityWindow, cycleData, calculatePhase, currentDate, pregnancyMode } = useCycle();
  
  const currentPhase = calculatePhase(currentDate);

  // Effect to show toast notifications for upcoming periods
  useEffect(() => {
    // Only show reminder if we have cycle data, not in pregnancy mode, and period is 2-3 days away
    if (cycleData.startDate && !pregnancyMode && daysUntilNextPeriod !== null && 
        (daysUntilNextPeriod === 2 || daysUntilNextPeriod === 3)) {
      toast(`Period reminder`, {
        description: `Your period is expected to start in ${daysUntilNextPeriod} days`,
        icon: <Bell className="h-4 w-4 text-cycle-pink" />,
        duration: 6000,
        position: 'top-center',
      });
    }
  }, [cycleData.startDate, daysUntilNextPeriod, pregnancyMode]);
  
  const getPhaseDisplay = () => {
    if (pregnancyMode) {
      return {
        title: "Pregnancy Mode",
        description: "Tracking your pregnancy journey",
        icon: <Baby className="h-5 w-5 text-cycle-pink" />,
        bgColor: "bg-cycle-pink/10",
        borderColor: "border-cycle-pink",
        textColor: "text-cycle-pink"
      };
    }
    
    switch (currentPhase) {
      case 'period':
        return {
          title: "Period Phase",
          description: "Focus on self-care and rest",
          icon: <Droplet className="h-5 w-5 text-cycle-pink" />,
          bgColor: "bg-cycle-pink/10",
          borderColor: "border-cycle-pink",
          textColor: "text-cycle-pink"
        };
      case 'fertile':
        return {
          title: "Fertile Window",
          description: "High chance of conception",
          icon: <CalendarDays className="h-5 w-5 text-cycle-purple" />,
          bgColor: "bg-cycle-lavender/10",
          borderColor: "border-cycle-purple",
          textColor: "text-cycle-purple"
        };
      case 'ovulation':
        return {
          title: "Ovulation Day",
          description: "Peak fertility",
          icon: <CalendarDays className="h-5 w-5 text-cycle-purple" />,
          bgColor: "bg-cycle-purple/10",
          borderColor: "border-cycle-purple",
          textColor: "text-cycle-purple"
        };
      case 'regular':
        return {
          title: "Luteal Phase",
          description: "Post-ovulation phase",
          icon: <CalendarDays className="h-5 w-5 text-gray-500" />,
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
          textColor: "text-gray-700"
        };
      default:
        return {
          title: "Tracking Mode",
          description: "Log your cycle data to see predictions",
          icon: <CalendarDays className="h-5 w-5 text-gray-500" />,
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
          textColor: "text-gray-700"
        };
    }
  };
  
  const phaseInfo = getPhaseDisplay();
  
  return (
    <div className="min-h-screen flex flex-col bg-background bg-gradient-to-br from-background to-accent/5">
      <Navbar />
      <main className="flex-1 pb-24 px-4">
        <div className="cycle-container animate-fade-in max-w-6xl mx-auto">
          {/* Phase Banner - Always visible at the top */}
          {cycleData.startDate && (
            <div className={`mt-6 p-4 rounded-lg ${phaseInfo.bgColor} ${phaseInfo.borderColor} border flex items-center`}>
              <div className={`mr-4 p-2 rounded-full ${phaseInfo.bgColor} border ${phaseInfo.borderColor}`}>
                {phaseInfo.icon}
              </div>
              <div>
                <h2 className={`font-medium ${phaseInfo.textColor}`}>{phaseInfo.title}</h2>
                <p className="text-sm text-gray-600">{phaseInfo.description}</p>
              </div>
              
              {currentPhase === 'period' && daysUntilNextPeriod !== null && (
                <div className="ml-auto text-right">
                  <span className="text-sm text-gray-500">Next period in</span>
                  <p className="font-medium text-cycle-pink">{daysUntilNextPeriod} days</p>
                </div>
              )}
              
              {fertilityWindow?.isWithinFertileWindow && (
                <div className="ml-auto text-right">
                  <span className="text-sm text-gray-500">Fertility</span>
                  <p className="font-medium text-cycle-purple">{fertilityWindow.fertilityPercentage}%</p>
                </div>
              )}
            </div>
          )}
          
          {title && (
            <h1 className="text-3xl font-bold mt-8 mb-6 text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </h1>
          )}
          
          {/* Cycle Prediction Alerts */}
          {cycleData.startDate && (
            <div className="mb-6">
              {/* Period reminder alert (2-3 days before) */}
              {daysUntilNextPeriod !== null && 
               (daysUntilNextPeriod === 2 || daysUntilNextPeriod === 3) && 
               currentPhase !== 'period' && 
               !pregnancyMode && (
                <Alert className="bg-cycle-pink/10 border-cycle-pink mb-3">
                  <Bell className="h-4 w-4 text-cycle-pink" />
                  <AlertTitle className="text-cycle-pink">Period Coming Soon</AlertTitle>
                  <AlertDescription>
                    Your period is expected to start in {daysUntilNextPeriod} days, on {' '}
                    <span className="font-medium">{format(addDays(new Date(), daysUntilNextPeriod), 'MMMM d')}</span>.
                    Time to prepare!
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Existing period alerts */}
              {daysUntilNextPeriod !== null && daysUntilNextPeriod <= 7 && 
               daysUntilNextPeriod > 3 && 
               currentPhase !== 'period' && 
               !pregnancyMode && (
                <Alert className="bg-cycle-pink/10 border-cycle-pink mb-3">
                  <CalendarDays className="h-4 w-4 text-cycle-pink" />
                  <AlertTitle className="text-cycle-pink">Period Coming Soon</AlertTitle>
                  <AlertDescription>
                    Your next period is predicted to start in {daysUntilNextPeriod} days, on {' '}
                    <span className="font-medium">{format(addDays(new Date(), daysUntilNextPeriod), 'MMMM d')}</span>.
                  </AlertDescription>
                </Alert>
              )}
              
              {fertilityWindow?.isWithinFertileWindow && !pregnancyMode && currentPhase !== 'period' && (
                <Alert className="bg-cycle-purple/10 border-cycle-purple mb-3">
                  <CalendarDays className="h-4 w-4 text-cycle-purple" />
                  <AlertTitle className="text-cycle-purple">
                    {fertilityWindow.isOvulationDay ? 'Peak Fertility Day' : 'Fertile Window'}
                  </AlertTitle>
                  <AlertDescription>
                    {fertilityWindow.isOvulationDay
                      ? "Today is your predicted ovulation day."
                      : "You are currently in your fertile window."}
                    {" "} Fertility level: <span className="font-medium">{fertilityWindow.fertilityPercentage}%</span>
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Ensure null checks for fertilityWindow and its properties */}
              {fertilityWindow && 
               fertilityWindow.daysUntilFertileWindow !== null && 
               fertilityWindow.daysUntilFertileWindow <= 3 && 
               fertilityWindow.daysUntilFertileWindow > 0 && 
               !pregnancyMode && 
               currentPhase !== 'period' && 
               currentPhase !== 'fertile' && 
               currentPhase !== 'ovulation' && (
                <Alert className="bg-cycle-lavender/10 border-cycle-lavender">
                  <CalendarDays className="h-4 w-4 text-cycle-purple" />
                  <AlertTitle className="text-cycle-purple">Fertile Window Approaching</AlertTitle>
                  <AlertDescription>
                    Your fertile window will begin in {fertilityWindow.daysUntilFertileWindow} days, on {' '}
                    <span className="font-medium">
                      {format(addDays(new Date(), fertilityWindow.daysUntilFertileWindow), 'MMMM d')}
                    </span>.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          {children}
        </div>
      </main>
      <div className="h-16 lg:h-0">
        {/* Space for mobile navigation */}
      </div>
    </div>
  );
};

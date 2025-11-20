
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO, isSameDay } from 'date-fns';
import { useCycle, CyclePhase } from '@/context/CycleContext';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { CalendarX } from 'lucide-react';

export const CycleCalendar: React.FC = () => {
  const { 
    currentDate, 
    setCurrentDate, 
    cycleData, 
    calculatePhase,
    symptomLogs,
    logPeriodDay,
    predictedCycles,
    fertilityWindow
  } = useCycle();

  const selectDay = (day: Date | undefined) => {
    if (day) {
      setCurrentDate(format(day, 'yyyy-MM-dd'));
    }
  };

  // Determine if a day has symptoms logged
  const hasSymptoms = (date: string) => {
    return symptomLogs.some(log => log.date === date);
  };

  // Check if a day is a predicted period day
  const isPredictedPeriodDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return predictedCycles.some(cycle => {
      const start = parseISO(cycle.periodStartDate);
      const end = parseISO(cycle.periodEndDate);
      const current = parseISO(dateStr);
      return current >= start && current <= end;
    });
  };

  // Check if a day is a predicted fertile day
  const isPredictedFertileDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return predictedCycles.some(cycle => {
      const start = parseISO(cycle.fertileWindowStart);
      const end = parseISO(cycle.fertileWindowEnd);
      const current = parseISO(dateStr);
      return current >= start && current <= end && !isSameDay(current, parseISO(cycle.ovulationDate));
    });
  };

  // Check if a day is a predicted ovulation day
  const isPredictedOvulationDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return predictedCycles.some(cycle => {
      return isSameDay(parseISO(dateStr), parseISO(cycle.ovulationDate));
    });
  };

  // Custom styling for different cycle phases
  const dayStyle = (date: Date, isSelected: boolean) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const phase = calculatePhase(dateStr);
    const hasSymptomsLogged = hasSymptoms(dateStr);
    const isPredictedPeriod = isPredictedPeriodDay(date);
    const isPredictedFertile = isPredictedFertileDay(date);
    const isPredictedOvulation = isPredictedOvulationDay(date);
    
    const baseClasses = "relative";
    let phaseClasses = "";
    
    // Apply different styles based on the cycle phase
    switch (phase) {
      case 'period':
        phaseClasses = "bg-cycle-pink text-white hover:bg-cycle-pink/90";
        break;
      case 'fertile':
        phaseClasses = "bg-cycle-lavender text-cycle-purple hover:bg-cycle-lavender/90";
        break;
      case 'ovulation':
        phaseClasses = "bg-cycle-purple text-white hover:bg-cycle-purple/90";
        break;
      default:
        if (isPredictedPeriod) {
          phaseClasses = "bg-cycle-pink/30 text-cycle-pink hover:bg-cycle-pink/40";
        } else if (isPredictedOvulation) {
          phaseClasses = "bg-cycle-purple/30 text-cycle-purple hover:bg-cycle-purple/40";
        } else if (isPredictedFertile) {
          phaseClasses = "bg-cycle-lavender/30 text-cycle-purple hover:bg-cycle-lavender/40";
        } else {
          phaseClasses = isSelected 
            ? "bg-cycle-lightPink text-cycle-pink" 
            : "hover:bg-cycle-lightPink/50";
        }
    }

    return cn(
      baseClasses,
      phaseClasses,
      isSelected && "ring-2 ring-primary",
      hasSymptomsLogged && "after:content-['•'] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2"
    );
  };

  // Handle period toggling directly in the calendar
  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setCurrentDate(dateStr);
  };

  // New handler for clicking/toggling period days
  const togglePeriodDay = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const dateStr = format(new Date(currentDate), 'yyyy-MM-dd');
    const isCurrentlyPeriod = calculatePhase(dateStr) === 'period';
    
    logPeriodDay(dateStr, !isCurrentlyPeriod);
    
    // Show feedback to the user
    if (isCurrentlyPeriod) {
      toast({ 
        title: "Period day removed",
        description: `Removed period tracking for ${format(new Date(dateStr), 'MMMM d')}`
      });
    } else {
      toast({ 
        title: "Period day added",
        description: `Added period tracking for ${format(new Date(dateStr), 'MMMM d')}` 
      });
    }
  };

  // New function to remove all period days
  const removePeriodDays = () => {
    if (!cycleData.startDate || !cycleData.endDate) return;
    
    // Get all period days in the current cycle
    const start = new Date(cycleData.startDate);
    const end = new Date(cycleData.endDate);
    
    // Ask for confirmation
    const confirmed = window.confirm(`Are you sure you want to remove all period days from ${format(start, 'MMMM d')} to ${format(end, 'MMMM d')}?`);
    
    if (confirmed) {
      // Remove each period day one by one
      let current = new Date(start);
      while (current <= end) {
        const dateStr = format(current, 'yyyy-MM-dd');
        logPeriodDay(dateStr, false);
        current.setDate(current.getDate() + 1);
      }
      
      toast({
        title: "Period data removed",
        description: "All period days have been removed from your calendar"
      });
    }
  };

  const renderDayContents = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const phase = calculatePhase(dateStr);
    const isSelected = dateStr === currentDate;
    
    return (
      <div className="flex items-center justify-center w-full h-full">
        {date.getDate()}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <Calendar
        mode="single"
        selected={new Date(currentDate)}
        onSelect={selectDay}
        className="rounded-md p-3 pointer-events-auto"
        modifiers={{
          selected: (date) => format(date, 'yyyy-MM-dd') === currentDate,
          period: (date) => calculatePhase(format(date, 'yyyy-MM-dd')) === 'period',
          fertile: (date) => calculatePhase(format(date, 'yyyy-MM-dd')) === 'fertile',
          ovulation: (date) => calculatePhase(format(date, 'yyyy-MM-dd')) === 'ovulation',
          predictedPeriod: isPredictedPeriodDay,
          predictedFertile: isPredictedFertileDay,
          predictedOvulation: isPredictedOvulationDay,
          hasSymptoms: (date) => hasSymptoms(format(date, 'yyyy-MM-dd')),
        }}
        modifiersClassNames={{
          selected: "bg-primary text-primary-foreground",
          period: "bg-cycle-pink text-white",
          fertile: "bg-cycle-lavender text-cycle-purple",
          ovulation: "bg-cycle-purple text-white",
          predictedPeriod: "bg-cycle-pink/30 text-cycle-pink",
          predictedFertile: "bg-cycle-lavender/30 text-cycle-purple",
          predictedOvulation: "bg-cycle-purple/30 text-cycle-purple",
          hasSymptoms: "relative after:content-['•'] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2",
        }}
        onDayClick={handleDayClick}
      />
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cycle-pink mr-2"></div>
            <span>Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cycle-purple mr-2"></div>
            <span>Ovulation</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cycle-lavender mr-2"></div>
            <span>Fertile Window</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-cycle-pink/30 mr-2 border border-cycle-pink"></div>
            <span>Predicted Period</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={togglePeriodDay}
                  variant={calculatePhase(currentDate) === 'period' ? 'destructive' : 'default'}
                  size="sm"
                >
                  {calculatePhase(currentDate) === 'period' ? 'Remove Period' : 'Add Period'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{calculatePhase(currentDate) === 'period' 
                  ? 'Remove period tracking for this day' 
                  : 'Mark this day as part of your period'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {cycleData.startDate && cycleData.endDate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={removePeriodDays}
                    variant="outline"
                    size="sm"
                    className="text-cycle-pink"
                  >
                    <CalendarX className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Remove all period days from the calendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

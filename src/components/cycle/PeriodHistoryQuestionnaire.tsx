
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format, subMonths, differenceInDays } from 'date-fns';

interface Period {
  startDate: Date;
  endDate: Date | null;
}

interface PeriodHistoryQuestionnaireProps {
  onSubmit: (periods: Period[]) => void;
  isLoading: boolean;
}

export const PeriodHistoryQuestionnaire: React.FC<PeriodHistoryQuestionnaireProps> = ({ onSubmit, isLoading }) => {
  const [periods, setPeriods] = useState<Period[]>([
    { startDate: subMonths(new Date(), 1), endDate: null },
    { startDate: subMonths(new Date(), 2), endDate: null },
    { startDate: subMonths(new Date(), 3), endDate: null }
  ]);
  
  const handleDateChange = (index: number, type: 'startDate' | 'endDate', date: Date) => {
    const updatedPeriods = [...periods];
    updatedPeriods[index] = {
      ...updatedPeriods[index],
      [type]: date
    };
    setPeriods(updatedPeriods);
  };

  const calculateAverageCycleLength = (): number => {
    if (periods.length < 2) return 28; // Default if not enough data
    
    // Sort periods by start date (earliest first)
    const sortedPeriods = [...periods]
      .filter(p => p.startDate) // Only consider periods with startDate
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      
    let totalDays = 0;
    let cycleCount = 0;
    
    // Calculate days between each consecutive period start
    for (let i = 1; i < sortedPeriods.length; i++) {
      const cycleDays = differenceInDays(
        sortedPeriods[i].startDate,
        sortedPeriods[i-1].startDate
      );
      
      // Only count reasonable cycle lengths (21-45 days)
      if (cycleDays >= 21 && cycleDays <= 45) {
        totalDays += cycleDays;
        cycleCount++;
      }
    }
    
    // Return average or default
    return cycleCount > 0 ? Math.round(totalDays / cycleCount) : 28;
  };

  const calculateAveragePeriodLength = (): number => {
    const periodsWithDuration = periods.filter(p => p.startDate && p.endDate);
    
    if (periodsWithDuration.length === 0) return 5; // Default
    
    const totalDuration = periodsWithDuration.reduce((total, period) => {
      const duration = differenceInDays(period.endDate!, period.startDate) + 1; // +1 because both days are inclusive
      return total + duration;
    }, 0);
    
    return Math.round(totalDuration / periodsWithDuration.length);
  };
  
  const handleAddPeriod = () => {
    const newMonth = subMonths(periods[periods.length - 1].startDate, 1);
    setPeriods([...periods, { startDate: newMonth, endDate: null }]);
  };

  const handleRemovePeriod = (index: number) => {
    if (periods.length <= 1) return;
    const updatedPeriods = periods.filter((_, i) => i !== index);
    setPeriods(updatedPeriods);
  };

  const handleSubmit = () => {
    // Filter out periods without both start and end dates
    const validPeriods = periods.filter(p => p.startDate && p.endDate);
    onSubmit(validPeriods);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Enter your period history to help us automatically calculate your average cycle length and make more accurate predictions.
        Add dates for as many past periods as you remember. The more data you provide, the better we can predict your cycle.
      </div>
      
      {periods.map((period, index) => (
        <Card key={index} className="mb-4">
          <CardContent className="pt-4">
            <div className="text-sm font-medium mb-2">
              Period {index + 1}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`start-date-${index}`}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !period.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {period.startDate ? format(period.startDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={period.startDate}
                      onSelect={(date) => date && handleDateChange(index, 'startDate', date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* End Date */}
              <div>
                <Label htmlFor={`end-date-${index}`}>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`end-date-${index}`}
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !period.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {period.endDate ? format(period.endDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={period.endDate || undefined}
                      onSelect={(date) => date && handleDateChange(index, 'endDate', date)}
                      disabled={(date) => period.startDate ? date < period.startDate : false}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {periods.length > 1 && (
              <Button 
                variant="ghost" 
                className="mt-2 text-destructive hover:text-destructive/90"
                onClick={() => handleRemovePeriod(index)}
              >
                Remove
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleAddPeriod}
        >
          Add Another Period
        </Button>
        
        <div className="text-sm bg-primary/10 p-3 rounded-md flex-1 ml-4">
          <div className="font-medium text-primary mb-1">Automatic Calculations:</div>
          <div>
            Predicted cycle length: <span className="font-medium">{calculateAverageCycleLength()} days</span>
          </div>
          <div>
            Average period duration: <span className="font-medium">{calculateAveragePeriodLength()} days</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full mt-4" 
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Continue with These Predictions'}
      </Button>
    </div>
  );
};

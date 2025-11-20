
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCycle } from '@/context/CycleContext';
import { PeriodDateSelector } from './PeriodDateSelector';
import { toast } from '@/hooks/use-toast';
import { predictPeriodEndDate, logPredictedPeriodDays } from '@/utils/periodUtils';

export const PeriodLogForm: React.FC = () => {
  const { cycleData, setCycleData } = useCycle();
  
  const [startDate, setStartDate] = useState<Date | null>(
    cycleData.startDate ? new Date(cycleData.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    cycleData.endDate ? new Date(cycleData.endDate) : null
  );
  const [autoPredictEnd, setAutoPredictEnd] = useState<boolean>(true);

  // Update local state when context data changes
  useEffect(() => {
    if (cycleData.startDate) {
      setStartDate(new Date(cycleData.startDate));
    }
    if (cycleData.endDate) {
      setEndDate(new Date(cycleData.endDate));
    }
  }, [cycleData.startDate, cycleData.endDate]);

  // Auto-predict end date when start date changes
  useEffect(() => {
    if (startDate && autoPredictEnd) {
      const predictedEndDateStr = predictPeriodEndDate(
        format(startDate, 'yyyy-MM-dd'),
        cycleData.periodLength
      );
      
      if (predictedEndDateStr) {
        setEndDate(new Date(predictedEndDateStr));
      }
    }
  }, [startDate, cycleData.periodLength, autoPredictEnd]);

  const handleSave = () => {
    if (!startDate) {
      toast({
        title: "Please select a start date",
        description: "A period start date is required",
        variant: "destructive"
      });
      return;
    }

    // Use the utility function to log all predicted period days
    const updatedCycleData = logPredictedPeriodDays(
      format(startDate, 'yyyy-MM-dd'),
      cycleData.periodLength,
      cycleData
    );
    
    // If user selected a specific end date, update it
    if (endDate && !autoPredictEnd) {
      updatedCycleData.endDate = format(endDate, 'yyyy-MM-dd');
    }

    setCycleData(updatedCycleData);

    toast({
      title: "Period logged successfully",
      description: `Your period has been recorded from ${startDate.toLocaleDateString()} to ${endDate ? endDate.toLocaleDateString() : 'unknown'}`,
    });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const toggleAutoPrediction = () => {
    setAutoPredictEnd(!autoPredictEnd);
    
    // If turning auto-prediction on and we have a start date, predict the end date
    if (!autoPredictEnd && startDate) {
      const predictedEndDateStr = predictPeriodEndDate(
        format(startDate, 'yyyy-MM-dd'),
        cycleData.periodLength
      );
      
      if (predictedEndDateStr) {
        setEndDate(new Date(predictedEndDateStr));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Period</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PeriodDateSelector 
          label="Period Start Date"
          date={startDate}
          onSelect={setStartDate}
          maxDate={new Date()}
        />
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Period End Date</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleAutoPrediction}
            className="h-8 text-xs"
          >
            {autoPredictEnd ? "Enter Manually" : "Auto Predict"}
          </Button>
        </div>
        
        <PeriodDateSelector 
          label="Period End Date"
          date={endDate}
          onSelect={setEndDate}
          minDate={startDate || undefined}
          maxDate={new Date()}
          disabled={autoPredictEnd}
        />
        
        <p className="text-sm text-muted-foreground">
          {!startDate && "Select when your period started"}
          {startDate && !endDate && "Select when your period ended, or leave blank if it's ongoing"}
          {startDate && endDate && 
            `Your period lasted ${Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days`}
          {autoPredictEnd && startDate && 
            ` (Auto-predicted based on your usual ${cycleData.periodLength}-day period)`}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClear}>Clear</Button>
        <Button onClick={handleSave}>Save Period</Button>
      </CardFooter>
    </Card>
  );
};

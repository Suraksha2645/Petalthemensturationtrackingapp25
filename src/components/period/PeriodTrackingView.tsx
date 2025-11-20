import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CycleCalendar } from '@/components/ui/CycleCalendar';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useCycle } from '@/context/CycleContext';
import { PeriodLogForm } from './PeriodLogForm';
import { CyclePredictions } from './CyclePredictions';
import { toast } from 'sonner';

export const PeriodTrackingView: React.FC = () => {
  const { 
    cycleData, 
    setCycleData, 
    currentDate, 
    calculatePhase, 
    logPeriodDay,
    pregnancyMode,
    daysUntilNextPeriod,
    periodHistory
  } = useCycle();

  const [periodLength, setPeriodLength] = useState(cycleData.periodLength);
  const currentPhase = calculatePhase(currentDate);

  // Function to save cycle settings
  const saveCycleSettings = () => {
    setCycleData({
      ...cycleData,
      periodLength
    });

    toast.success("Period length saved! Your cycle length is automatically calculated based on your history.");
  };

  // Pregnancy mode view
  if (pregnancyMode) {
    return <PregnancyModeContent />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Track Your Cycle</CardTitle>
            </CardHeader>
            <CardContent>
              <CycleCalendar />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Selected Date: {format(new Date(currentDate), 'MMMM d, yyyy')}</h3>
                
                <p className="text-sm text-muted-foreground mt-3">
                  Select a day on the calendar and use the "Add Period" or "Remove Period" button to track your period days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Cycle Info */}
        <div className="space-y-6">
          {/* New Period Log Form */}
          <PeriodLogForm />

          {/* Cycle Predictions */}
          <CyclePredictions />

          <Card>
            <CardHeader>
              <CardTitle>Cycle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cycle summary */}
              <div>
                <h3 className="font-medium mb-2">Current Cycle:</h3>
                {cycleData.startDate ? (
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Last period start:</span>
                      <span>{format(new Date(cycleData.startDate), 'MMM d, yyyy')}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Current cycle length:</span>
                      <span>{cycleData.cycleLength} days (auto-calculated)</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Expected next period:</span>
                      <span>{daysUntilNextPeriod !== null ? 
                        format(addDays(new Date(), daysUntilNextPeriod), 'MMM d, yyyy') : 
                        'Unknown'
                      }</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Days until period:</span>
                      <span>{daysUntilNextPeriod !== null ? `${daysUntilNextPeriod} days` : 'Unknown'}</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No period data logged yet. Use the calendar to mark your period days.</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">Period Settings:</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-primary/5 rounded-md mb-4">
                    <p className="text-sm">Your cycle length ({cycleData.cycleLength} days) is automatically calculated based on your period history.</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label htmlFor="period-length">Period Length: {periodLength} days</Label>
                    </div>
                    <Slider 
                      id="period-length"
                      value={[periodLength]} 
                      min={2} 
                      max={10} 
                      step={1} 
                      onValueChange={(value) => setPeriodLength(value[0])}
                      className="mb-4"
                    />
                  </div>
                  
                  <Button onClick={saveCycleSettings} className="w-full">
                    Save Period Length
                  </Button>
                </div>
              </div>
              
              {periodHistory.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Period History:</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Your past {periodHistory.length} period(s) are used to calculate your cycle length automatically.
                  </p>
                  <div className="text-sm max-h-32 overflow-y-auto">
                    {periodHistory.map((period, idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b last:border-b-0">
                        <span>{format(new Date(period.startDate), 'MMM d, yyyy')}</span>
                        <span>→</span>
                        <span>{period.endDate ? format(new Date(period.endDate), 'MMM d, yyyy') : 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Pregnancy Mode Content Component 
const PregnancyModeContent: React.FC = () => {
  const [dueDate, setDueDate] = useState<string>('');
  const [weeks, setWeeks] = useState<number>(0);

  const calculateWeeks = () => {
    if (!dueDate) return;
    
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    
    // Calculate conception date (approximately 280 days before due date)
    const conceptionDate = new Date(dueDateObj);
    conceptionDate.setDate(conceptionDate.getDate() - 280);
    
    // Calculate weeks pregnant
    const diffTime = Math.abs(today.getTime() - conceptionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const calculatedWeeks = Math.floor(diffDays / 7);
    
    setWeeks(calculatedWeeks);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pregnancy Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input 
                id="due-date" 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button onClick={calculateWeeks} className="w-full">
              Calculate Weeks
            </Button>
            
            {weeks > 0 && (
              <div className="mt-4 p-4 bg-accent rounded-lg text-center">
                <h3 className="text-lg font-semibold">You are approximately:</h3>
                <p className="text-3xl font-bold text-primary mt-2">{weeks} weeks pregnant</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pregnancy Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <span className="mr-2">📝</span> Weekly Development Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <span className="mr-2">🍎</span> Nutrition During Pregnancy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <span className="mr-2">💪</span> Safe Exercises for Pregnancy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <span className="mr-2">🩺</span> Doctor Visit Checklist
                </a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline flex items-center">
                  <span className="mr-2">👶</span> Preparing for Baby
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


import React from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { useCycle } from '@/context/CycleContext';

export const FertilityTrackingView: React.FC = () => {
  const { cycleData, fertilityWindow, predictedCycles } = useCycle();
  
  if (!cycleData.startDate) {
    return (
      <Card className="my-6">
        <CardHeader>
          <CardTitle>Fertility Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log your period first to enable fertility tracking. Your fertile window 
            and ovulation predictions will appear here after logging at least one period.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Fertility Tracking</h2>
      
      {/* Current Fertility Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Fertility Status</CardTitle>
        </CardHeader>
        <CardContent>
          {fertilityWindow ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    {fertilityWindow.isOvulationDay 
                      ? "Peak Fertility Day" 
                      : fertilityWindow.isWithinFertileWindow 
                        ? "Fertile Window" 
                        : "Low Fertility"}
                  </h3>
                  <p className="text-muted-foreground">
                    {fertilityWindow.isOvulationDay
                      ? "Today is your predicted ovulation day."
                      : fertilityWindow.isWithinFertileWindow
                        ? "You are currently in your fertile window."
                        : fertilityWindow.daysUntilFertileWindow
                          ? `Your fertile window begins in ${fertilityWindow.daysUntilFertileWindow} days.`
                          : "Your fertile window has passed for this cycle."}
                  </p>
                </div>
                <div className="bg-cycle-purple/10 p-3 rounded-full h-20 w-20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-cycle-purple">
                    {fertilityWindow.fertilityPercentage}%
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Fertility Level</span>
                  <span className="text-sm font-medium">
                    {fertilityWindow.fertilityPercentage}%
                  </span>
                </div>
                <Progress 
                  value={fertilityWindow.fertilityPercentage} 
                  className="h-2" 
                  color={fertilityWindow.isOvulationDay ? "bg-cycle-purple" : ""}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-accent/50 p-3 rounded-lg text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">Fertile Window Starts</h4>
                  <div className="font-medium">
                    {format(parseISO(fertilityWindow.fertileWindowStart), 'MMM d')}
                  </div>
                </div>
                <div className="bg-cycle-purple/20 p-3 rounded-lg text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">Ovulation Day</h4>
                  <div className="font-medium text-cycle-purple">
                    {format(parseISO(fertilityWindow.ovulationDate), 'MMM d')}
                  </div>
                </div>
                <div className="bg-accent/50 p-3 rounded-lg text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">Fertile Window Ends</h4>
                  <div className="font-medium">
                    {format(parseISO(fertilityWindow.fertileWindowEnd), 'MMM d')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No fertility data available. Please ensure your cycle information is up to date.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Fertility Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fertility Calendar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-center">
              <Calendar 
                mode="single"
                selected={new Date()}
                className="pointer-events-auto"
                modifiers={{
                  fertile: predictedCycles.length > 0 ? 
                    date => predictedCycles.some(cycle => {
                      const start = parseISO(cycle.fertileWindowStart);
                      const end = parseISO(cycle.fertileWindowEnd);
                      return date >= start && date <= end;
                    }) : undefined,
                  ovulation: predictedCycles.length > 0 ?
                    date => predictedCycles.some(cycle => {
                      const ovulationDate = parseISO(cycle.ovulationDate);
                      return format(date, 'yyyy-MM-dd') === format(ovulationDate, 'yyyy-MM-dd');
                    }) : undefined,
                  period: predictedCycles.length > 0 ?
                    date => predictedCycles.some(cycle => {
                      const periodStart = parseISO(cycle.periodStartDate);
                      const periodEnd = parseISO(cycle.periodEndDate);
                      return date >= periodStart && date <= periodEnd;
                    }) : undefined,
                }}
                modifiersClassNames={{
                  fertile: "bg-cycle-lavender text-cycle-purple",
                  ovulation: "bg-cycle-purple text-white",
                  period: "bg-cycle-pink text-white"
                }}
                disabled
              />
            </div>
            
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-cycle-pink mr-2"></div>
                <span className="text-xs">Period</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-cycle-lavender mr-2"></div>
                <span className="text-xs">Fertile Window</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-cycle-purple mr-2"></div>
                <span className="text-xs">Ovulation</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Fertility Predictions */}
        <Card>
          <CardHeader>
            <CardTitle>Future Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            {predictedCycles.length > 0 ? (
              <div className="space-y-4">
                {predictedCycles.map((cycle, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <h3 className="font-medium mb-2">Cycle {cycle.cycleNumber}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Period:</span>
                        <span>{format(parseISO(cycle.periodStartDate), 'MMM d')} - {format(parseISO(cycle.periodEndDate), 'MMM d')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fertile Window:</span>
                        <span>{format(parseISO(cycle.fertileWindowStart), 'MMM d')} - {format(parseISO(cycle.fertileWindowEnd), 'MMM d')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ovulation:</span>
                        <span className="font-medium text-cycle-purple">{format(parseISO(cycle.ovulationDate), 'MMM d')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No predictions available yet. Please ensure your cycle data is up to date.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Fertility Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Fertility Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-cycle-purple">•</span>
              <span>Your most fertile days are the 2-3 days before ovulation and the day of ovulation.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cycle-purple">•</span>
              <span>Tracking cervical mucus can help identify your fertile window - look for clear, stretchy mucus.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cycle-purple">•</span>
              <span>Some women experience slight pain or discomfort during ovulation (mittelschmerz).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cycle-purple">•</span>
              <span>Sperm can survive up to 5 days in the female reproductive tract, which is why the fertile window starts several days before ovulation.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cycle-purple">•</span>
              <span>Consider using ovulation prediction kits for more accurate timing, especially if your cycles are irregular.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

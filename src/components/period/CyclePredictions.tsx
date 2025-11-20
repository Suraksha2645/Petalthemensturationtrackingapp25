
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useCycle } from '@/context/CycleContext';

export const CyclePredictions: React.FC = () => {
  const { predictedCycles, pregnancyMode } = useCycle();

  if (pregnancyMode || predictedCycles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicted Cycles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {predictedCycles.map((cycle) => (
            <div key={cycle.cycleNumber} className="border-b pb-4 last:border-b-0">
              <h3 className="font-medium text-lg mb-2">
                Cycle {cycle.cycleNumber === 1 ? "Next" : cycle.cycleNumber}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Period</h4>
                  <div className="flex items-center">
                    <Badge variant="destructive" className="bg-cycle-pink mr-2">
                      {format(parseISO(cycle.periodStartDate), 'MMM d')}
                    </Badge>
                    <span className="text-muted-foreground">to</span>
                    <Badge variant="destructive" className="bg-cycle-pink ml-2">
                      {format(parseISO(cycle.periodEndDate), 'MMM d')}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h4 className="text-sm flex items-center mb-1 cursor-help">
                          Ovulation
                          <span className="ml-1 text-xs text-muted-foreground">(i)</span>
                        </h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Ovulation typically occurs 14 days before your next period. 
                          This is when you're most fertile.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Badge variant="outline" className="bg-cycle-purple text-white">
                    {format(parseISO(cycle.ovulationDate), 'MMMM d')}
                  </Badge>
                </div>
                
                <div className="sm:col-span-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <h4 className="text-sm flex items-center mb-1 cursor-help">
                          Fertile Window
                          <span className="ml-1 text-xs text-muted-foreground">(i)</span>
                        </h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">
                          Your fertile window is typically about 5 days before ovulation through 1 day after. 
                          These are your most fertile days.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-cycle-lavender text-cycle-purple mr-2">
                      {format(parseISO(cycle.fertileWindowStart), 'MMM d')}
                    </Badge>
                    <span className="text-muted-foreground">to</span>
                    <Badge variant="outline" className="bg-cycle-lavender text-cycle-purple ml-2">
                      {format(parseISO(cycle.fertileWindowEnd), 'MMM d')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-xs text-muted-foreground italic mt-2">
            Predictions are based on your average cycle length and may vary. 
            The more data you log, the more accurate your predictions will be.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { format, addDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { useCycle } from '@/context/CycleContext';
import { Link } from 'react-router-dom';

export const StatsCards: React.FC = () => {
  const { 
    cycleData, 
    currentDate, 
    calculatePhase, 
    daysUntilNextPeriod, 
    pregnancyMode,
    togglePregnancyMode,
    fertilityWindow,
    adaptivePrediction
  } = useCycle();

  const currentPhase = calculatePhase(currentDate);
  
  // Calculate cycle progress
  const cycleProgress = daysUntilNextPeriod !== null && cycleData.cycleLength
    ? ((cycleData.cycleLength - daysUntilNextPeriod) / cycleData.cycleLength) * 100
    : 0;

  // Format the predicted next period date
  const nextPeriodDate = cycleData.startDate 
    ? format(addDays(parseISO(cycleData.startDate), cycleData.cycleLength), 'MMM d, yyyy')
    : 'Unknown';

  // Get day of cycle
  const cycleDay = cycleData.startDate 
    ? Math.min(cycleData.cycleLength - (daysUntilNextPeriod || 0), cycleData.cycleLength) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Phase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold capitalize">
            {pregnancyMode ? "Pregnancy Mode" : currentPhase}
          </div>
          <div className="text-muted-foreground mt-1">
            {pregnancyMode 
              ? "Tracking for pregnancy" 
              : currentPhase === 'period' 
                ? "Taking it easy" 
                : currentPhase === 'fertile' || currentPhase === 'ovulation'
                  ? `High fertility: ${fertilityWindow?.fertilityPercentage || 0}%` 
                  : currentPhase === 'regular'
                  ? "Luteal phase"
                  : "Not enough data yet"}
          </div>
          
          {!pregnancyMode && cycleData.startDate && (
            <div className="mt-2 text-sm font-medium">
              Day {cycleDay} of {adaptivePrediction?.cycleLengthPrediction || cycleData.cycleLength}
            </div>
          )}
          
          {adaptivePrediction && (
            <div className="mt-2">
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                adaptivePrediction.confidenceLevel === 'high' ? 'bg-green-100 text-green-700' :
                adaptivePrediction.confidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {adaptivePrediction.confidence}% confidence
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cycle Status</CardTitle>
        </CardHeader>
        <CardContent>
          {pregnancyMode ? (
            <div>
              <div className="text-2xl font-semibold">Pregnancy Mode</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={togglePregnancyMode}
              >
                Exit Pregnancy Mode
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Cycle Progress</span>
                <span className="text-sm font-medium">
                  {cycleData.startDate ? 
                    `${cycleDay}/${adaptivePrediction?.cycleLengthPrediction || cycleData.cycleLength}` : 
                    "Not set"}
                </span>
              </div>
              <Progress value={cycleProgress} className="h-2" />
              <div className="mt-2 text-sm">
                Next period expected: <span className="font-medium">{nextPeriodDate}</span>
                {adaptivePrediction && adaptivePrediction.confidence < 60 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Prediction will improve with more data
                  </div>
                )}
              </div>
              {daysUntilNextPeriod !== null && daysUntilNextPeriod <= 7 && (
                <div className="mt-1 text-sm text-cycle-pink">
                  {daysUntilNextPeriod === 0 ? "Expected today" : `In ${daysUntilNextPeriod} days`}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Link to="/period" className="w-full">
            <Button variant="secondary" size="sm" className="w-full">
              {pregnancyMode ? "Pregnancy Tracking" : "Log Period"}
            </Button>
          </Link>
          <Link to="/symptoms" className="w-full">
            <Button variant="secondary" size="sm" className="w-full">
              Log Symptoms
            </Button>
          </Link>
          {!pregnancyMode && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={togglePregnancyMode}
            >
              Switch to Pregnancy Mode
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

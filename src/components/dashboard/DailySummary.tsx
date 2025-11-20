
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCycle } from '@/context/CycleContext';
import { Link } from 'react-router-dom';

export const DailySummary: React.FC = () => {
  const { 
    currentDate, 
    calculatePhase, 
    pregnancyMode,
    symptomLogs,
    symptoms
  } = useCycle();

  const currentPhase = calculatePhase(currentDate);
  
  // Get today's symptoms
  const todaySymptoms = symptomLogs.filter(log => log.date === currentDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{format(new Date(currentDate), 'EEEE, MMMM d, yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Phase:</h3>
            <div className={`
              inline-block px-3 py-1 rounded-full text-sm font-medium
              ${currentPhase === 'period' ? 'bg-cycle-pink text-white' : ''}
              ${currentPhase === 'fertile' ? 'bg-cycle-lavender text-cycle-purple' : ''}
              ${currentPhase === 'ovulation' ? 'bg-cycle-purple text-white' : ''}
              ${currentPhase === 'regular' ? 'bg-gray-100 text-gray-700' : ''}
              ${currentPhase === 'unknown' ? 'bg-gray-100 text-gray-700' : ''}
            `}>
              {pregnancyMode 
                ? "Pregnancy Mode" 
                : currentPhase === 'period' 
                  ? "Period" 
                  : currentPhase === 'fertile' 
                    ? "Fertile Window" 
                    : currentPhase === 'ovulation' 
                      ? "Ovulation Day" 
                      : currentPhase === 'regular' 
                        ? "Luteal Phase" 
                        : "Unknown"}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Symptoms:</h3>
            {todaySymptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {todaySymptoms.map(symptom => {
                  const symptomData = symptoms.find(s => s.id === symptom.symptomId);
                  return symptomData ? (
                    <div key={symptom.symptomId} className="bg-accent px-3 py-1 rounded-full text-sm">
                      <span className="mr-1">{symptomData.icon}</span> 
                      {symptomData.name}
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No symptoms logged for today</p>
            )}
            <Link to="/symptoms">
              <Button variant="link" className="p-0 h-auto mt-2">
                + Log symptoms
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

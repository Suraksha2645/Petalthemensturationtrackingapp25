
import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInDays, differenceInWeeks } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useCycle } from '@/context/CycleContext';
import { FertilityTrackingView } from '@/components/fertility/FertilityTrackingView';
import { PregnancyResources } from '@/components/pregnancy/PregnancyResources';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, Baby, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getFetalDevelopmentInfo } from '@/utils/cycleCalculations';

export const PregnancyModeView: React.FC = () => {
  const [dueDate, setDueDate] = useState("");
  const [weeks, setWeeks] = useState(0);
  const [trimester, setTrimester] = useState<1 | 2 | 3>(1);
  const [totalDays, setTotalDays] = useState(280); // Standard pregnancy length
  const [daysPassed, setDaysPassed] = useState(0);
  const [babySize, setBabySize] = useState("");
  const [weight, setWeight] = useState("");
  const { pregnancyMode, togglePregnancyMode } = useCycle();
  const [trackingMode, setTrackingMode] = useState<'pregnancy' | 'fertility'>('pregnancy');
  const [lastSavedDueDate, setLastSavedDueDate] = useState<string | null>(null);
  const [developmentInfo, setDevelopmentInfo] = useState<{
    title: string;
    description: string;
    milestones: string[];
  } | null>(null);

  // Load saved due date from localStorage on component mount
  useEffect(() => {
    const savedDueDate = localStorage.getItem('pregnancyDueDate');
    if (savedDueDate) {
      setDueDate(savedDueDate);
      setLastSavedDueDate(savedDueDate);
      calculateProgress(savedDueDate);
    }
  }, []);

  const calculateProgress = (date: string = dueDate) => {
    if (!date) return;
    
    const dueDateObj = new Date(date);
    const today = new Date();
    
    // Calculate conception date (approximately 280 days before due date)
    const conceptionDate = new Date(dueDateObj);
    conceptionDate.setDate(conceptionDate.getDate() - 280);
    
    // Calculate weeks pregnant
    const diffTime = Math.abs(today.getTime() - conceptionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const calculatedWeeks = Math.floor(diffDays / 7);
    
    setWeeks(calculatedWeeks);
    setDaysPassed(diffDays);
    
    // Determine trimester
    let currentTrimester: 1 | 2 | 3 = 1;
    if (calculatedWeeks <= 13) currentTrimester = 1;
    else if (calculatedWeeks <= 26) currentTrimester = 2;
    else currentTrimester = 3;
    setTrimester(currentTrimester);
    
    // Set development information
    const info = getFetalDevelopmentInfo(currentTrimester, calculatedWeeks);
    setDevelopmentInfo(info);
    
    // Set baby size based on week
    const sizes = [
      "Poppy seed", "Apple seed", "Blueberry", "Raspberry", "Cherry", 
      "Grape", "Kiwi", "Lime", "Lemon", "Orange", "Avocado", 
      "Bell pepper", "Mango", "Papaya", "Cantaloupe", "Banana", 
      "Sweet potato", "Bell pepper", "Zucchini", "Banana", "Carrot", 
      "Spaghetti squash", "Large mango", "Grapefruit", "Cauliflower", 
      "Rutabaga", "Lettuce", "Eggplant", "Butternut squash", "Cabbage", 
      "Coconut", "Pineapple", "Honeydew melon", "Cantaloupe", "Honeydew", 
      "Romaine lettuce", "Papaya", "Swiss chard", "Leek", "Mini watermelon"
    ];
    
    setBabySize(calculatedWeeks > 0 && calculatedWeeks <= sizes.length ? sizes[calculatedWeeks - 1] : "Unknown");
    
    // Set estimated weight
    if (calculatedWeeks < 10) {
      setWeight("Less than 1 oz");
    } else if (calculatedWeeks < 20) {
      setWeight(`${(calculatedWeeks - 8) * 0.5} oz`);
    } else {
      setWeight(`${((calculatedWeeks - 19) * 0.25) + 6} lbs`);
    }

    // Save due date to localStorage
    localStorage.setItem('pregnancyDueDate', date);
    setLastSavedDueDate(date);
    
    toast(`Pregnancy information updated`, {
      description: `You're approximately ${calculatedWeeks} weeks pregnant`,
      duration: 3000,
    });
  };

  // Get days remaining until due date
  const getDaysRemaining = () => {
    if (!dueDate) return null;
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    return differenceInDays(dueDateObj, today);
  };

  const daysRemaining = getDaysRemaining();

  if (!pregnancyMode) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md bg-gradient-to-br from-card to-background border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center">Cycle Tracking Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>You are not currently in pregnancy or fertility tracking mode.</p>
            <Button onClick={togglePregnancyMode} className="w-full">
              Activate Advanced Tracking
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {trackingMode === 'pregnancy' ? 'Pregnancy Tracker' : 'Fertility Tracker'}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={trackingMode === 'fertility' ? 'default' : 'outline'} 
            onClick={() => setTrackingMode('fertility')}
            className="transition-all duration-300"
          >
            Fertility Mode
          </Button>
          <Button 
            variant={trackingMode === 'pregnancy' ? 'default' : 'outline'} 
            onClick={() => setTrackingMode('pregnancy')}
            className="transition-all duration-300"
          >
            Pregnancy Mode
          </Button>
          <Button variant="outline" onClick={togglePregnancyMode} className="transition-all duration-300">
            Exit Advanced Tracking
          </Button>
        </div>
      </div>
      
      {trackingMode === 'pregnancy' ? (
        <>
          {/* Due Date Calculator */}
          <Card className="bg-gradient-to-br from-card to-background border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Due Date Calculator
              </CardTitle>
              {lastSavedDueDate && (
                <span className="text-xs text-muted-foreground">Last updated: {format(new Date(lastSavedDueDate), 'MMM d, yyyy')}</span>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="due-date">Enter your due date</Label>
                  <Input 
                    id="due-date" 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={() => calculateProgress()} className="w-full">
                    Calculate
                  </Button>
                </div>
              </div>
              
              {weeks > 0 ? (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium mb-1">You're approximately</h3>
                    <div className="text-4xl font-bold text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {weeks} weeks pregnant
                    </div>
                    <p className="text-muted-foreground">({daysPassed} days)</p>
                    <p className="text-sm mt-1 font-medium text-cycle-pink">
                      Trimester {trimester}
                    </p>
                    {daysRemaining !== null && (
                      <p className="mt-1 font-medium">
                        {daysRemaining > 0 
                          ? `${daysRemaining} days until due date` 
                          : daysRemaining === 0 
                            ? "Today is your due date!" 
                            : `${Math.abs(daysRemaining)} days past due date`}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Trimester 1</span>
                      <span>Trimester 2</span>
                      <span>Trimester 3</span>
                    </div>
                    <Progress value={(daysPassed / totalDays) * 100} className="h-3" />
                    <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                      <span>Week 1</span>
                      <span>Week 40</span>
                    </div>
                  </div>
                  
                  {weeks <= 40 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-accent/50 p-4 rounded-lg text-center flex flex-col items-center">
                        <h4 className="text-sm text-muted-foreground mb-1">Baby size</h4>
                        <div className="text-lg font-medium mb-1">{babySize}</div>
                        <Baby className="h-6 w-6 text-cycle-pink mt-1" />
                      </div>
                      <div className="bg-accent/50 p-4 rounded-lg text-center">
                        <h4 className="text-sm text-muted-foreground mb-1">Est. weight</h4>
                        <div className="text-lg font-medium">{weight}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Alert variant="default" className="mt-4 bg-accent/30">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Get Started</AlertTitle>
                  <AlertDescription>
                    Enter your due date above and click "Calculate" to see your pregnancy progress and weekly information.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {/* Fetal Development Information */}
          {developmentInfo && (
            <Card className="bg-gradient-to-br from-card to-background border-primary/10">
              <CardHeader>
                <CardTitle>{developmentInfo.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{developmentInfo.description}</p>
                <div className="space-y-2 mt-2">
                  <h3 className="font-medium">Key Milestones</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    {developmentInfo.milestones.map((milestone, index) => (
                      <li key={index}>{milestone}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Common symptoms for current trimester */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Common Symptoms in Trimester {trimester}</h3>
                  {trimester === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-accent/30 p-2 rounded text-sm">Morning sickness</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Fatigue</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Tender breasts</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Food aversions</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Frequent urination</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Mood swings</div>
                    </div>
                  )}
                  
                  {trimester === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-accent/30 p-2 rounded text-sm">Baby movements</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Reduced nausea</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Increased energy</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Growing belly</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Stretch marks</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Back pain</div>
                    </div>
                  )}
                  
                  {trimester === 3 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="bg-accent/30 p-2 rounded text-sm">Shortness of breath</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Braxton Hicks contractions</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Trouble sleeping</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Increased fatigue</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Swollen ankles</div>
                      <div className="bg-accent/30 p-2 rounded text-sm">Frequent urination</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Pregnancy Resources */}
          <PregnancyResources currentWeek={weeks} />
        </>
      ) : (
        <FertilityTrackingView />
      )}
    </div>
  );
};

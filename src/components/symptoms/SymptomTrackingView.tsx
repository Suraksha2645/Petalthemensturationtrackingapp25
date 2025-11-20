
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCycle } from '@/context/CycleContext';
import { Symptom } from '@/types/cycle';
import { SymptomSelector } from '@/components/ui/SymptomSelector';
import { Badge } from '@/components/ui/badge';
import { CycleCalendar } from '@/components/ui/CycleCalendar';
import { Toggle } from '@/components/ui/toggle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun, Heart, Smile, Frown, Meh } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SymptomTrackingView: React.FC = () => {
  const { 
    currentDate, 
    symptomLogs, 
    addSymptomLog, 
    removeSymptomLog, 
    symptoms
  } = useCycle();
  
  const { toast } = useToast();
  const [notes, setNotes] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(
    new Set(symptomLogs
      .filter(log => log.date === currentDate)
      .map(log => log.symptomId)
    )
  );
  const [sleepQuality, setSleepQuality] = useState<string>('average');
  const [sleepDuration, setSleepDuration] = useState<number>(7);

  // Get currently selected log notes
  const getCurrentNotes = () => {
    const currentLog = symptomLogs.find(log => log.date === currentDate);
    return currentLog?.notes || '';
  };

  // Update notes on component mount
  React.useEffect(() => {
    setNotes(getCurrentNotes());
    // Check if there's a sleep quality log
    const sleepQualitySymptom = symptoms.find(s => s.id.includes('sleep_'));
    if (sleepQualitySymptom && selectedSymptoms.has(sleepQualitySymptom.id)) {
      setSleepQuality(sleepQualitySymptom.id.replace('sleep_', ''));
    }
  }, [currentDate, symptomLogs]);

  // Handle symptom selection
  const handleSymptomSelect = (symptom: Symptom) => {
    const newSelected = new Set(selectedSymptoms);
    
    if (newSelected.has(symptom.id)) {
      newSelected.delete(symptom.id);
      removeSymptomLog(currentDate, symptom.id);
    } else {
      newSelected.add(symptom.id);
      addSymptomLog({
        date: currentDate,
        symptomId: symptom.id,
        notes: notes
      });
    }
    
    setSelectedSymptoms(newSelected);
  };

  // Get all symptoms for the selected date
  const selectedDateSymptoms = symptomLogs
    .filter(log => log.date === currentDate)
    .map(log => {
      const symptom = symptoms.find(s => s.id === log.symptomId);
      return {
        id: log.symptomId,
        name: symptom?.name || '',
        icon: symptom?.icon || '',
        category: symptom?.category || 'other'
      };
    });
    
  // Save notes
  const saveNotes = () => {
    // Update notes for all symptoms logged on this day
    selectedSymptoms.forEach(symptomId => {
      addSymptomLog({
        date: currentDate,
        symptomId,
        notes
      });
    });
    
    // Show success message using toast
    toast({ 
      title: "Notes saved",
      description: `Notes for ${format(new Date(currentDate), 'MMMM d')} have been saved.`
    });
  };

  // Handle sleep quality selection
  const handleSleepQualityChange = (quality: string) => {
    setSleepQuality(quality);
    
    // Remove any existing sleep quality logs
    symptoms
      .filter(s => s.id.startsWith('sleep_'))
      .forEach(s => {
        removeSymptomLog(currentDate, s.id);
        selectedSymptoms.delete(s.id);
      });
    
    // Add the new sleep quality log
    const qualityId = `sleep_${quality}`;
    addSymptomLog({
      date: currentDate,
      symptomId: qualityId,
      notes: notes
    });
    
    setSelectedSymptoms(prev => {
      const newSet = new Set(prev);
      newSet.add(qualityId);
      return newSet;
    });
  };

  // Handle sleep duration logging
  const handleSleepDurationChange = (duration: number) => {
    setSleepDuration(duration);
    
    const durationId = `sleep_duration`;
    addSymptomLog({
      date: currentDate,
      symptomId: durationId,
      notes: `Slept for ${duration} hours`,
      intensity: duration
    });
    
    setSelectedSymptoms(prev => {
      const newSet = new Set(prev);
      newSet.add(durationId);
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with date selection */}
      <div className="bg-accent p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          Symptoms for {format(new Date(currentDate), 'MMMM d, yyyy')}
        </h2>
        <p className="text-muted-foreground">
          Select a date on the calendar, then log your symptoms, mood, and sleep
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Calendar */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <CycleCalendar />
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Symptom selection and notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Symptom toggles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="symptoms">
                <TabsList className="mb-4">
                  <TabsTrigger value="mood">Mood</TabsTrigger>
                  <TabsTrigger value="symptoms">Physical Symptoms</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                </TabsList>

                {/* Mood Tracking Tab */}
                <TabsContent value="mood">
                  <div className="space-y-4">
                    <Label className="text-base">How are you feeling today?</Label>
                    <div className="flex flex-wrap gap-3">
                      <Toggle 
                        variant="outline" 
                        className="flex flex-col items-center h-20 w-20 data-[state=on]:bg-green-50 data-[state=on]:border-green-200"
                        pressed={selectedSymptoms.has('mood_happy')}
                        onPressedChange={() => {
                          handleSymptomSelect({ id: 'mood_happy', name: 'Happy', category: 'mood', icon: '😊' });
                        }}
                      >
                        <Smile className="h-8 w-8 mb-1 text-green-500" />
                        <span>Happy</span>
                      </Toggle>

                      <Toggle 
                        variant="outline" 
                        className="flex flex-col items-center h-20 w-20 data-[state=on]:bg-blue-50 data-[state=on]:border-blue-200"
                        pressed={selectedSymptoms.has('mood_calm')}
                        onPressedChange={() => {
                          handleSymptomSelect({ id: 'mood_calm', name: 'Calm', category: 'mood', icon: '😌' });
                        }}
                      >
                        <Heart className="h-8 w-8 mb-1 text-blue-500" />
                        <span>Calm</span>
                      </Toggle>

                      <Toggle 
                        variant="outline" 
                        className="flex flex-col items-center h-20 w-20 data-[state=on]:bg-amber-50 data-[state=on]:border-amber-200"
                        pressed={selectedSymptoms.has('mood_neutral')}
                        onPressedChange={() => {
                          handleSymptomSelect({ id: 'mood_neutral', name: 'Neutral', category: 'mood', icon: '😐' });
                        }}
                      >
                        <Meh className="h-8 w-8 mb-1 text-amber-500" />
                        <span>Neutral</span>
                      </Toggle>

                      <Toggle 
                        variant="outline" 
                        className="flex flex-col items-center h-20 w-20 data-[state=on]:bg-red-50 data-[state=on]:border-red-200"
                        pressed={selectedSymptoms.has('mood_sad')}
                        onPressedChange={() => {
                          handleSymptomSelect({ id: 'mood_sad', name: 'Sad', category: 'mood', icon: '😢' });
                        }}
                      >
                        <Frown className="h-8 w-8 mb-1 text-red-500" />
                        <span>Sad</span>
                      </Toggle>

                      <Toggle 
                        variant="outline" 
                        className="flex flex-col items-center h-20 w-20 data-[state=on]:bg-purple-50 data-[state=on]:border-purple-200"
                        pressed={selectedSymptoms.has('mood_irritable')}
                        onPressedChange={() => {
                          handleSymptomSelect({ id: 'mood_irritable', name: 'Irritable', category: 'mood', icon: '😠' });
                        }}
                      >
                        <span className="text-3xl mb-1">😠</span>
                        <span>Irritable</span>
                      </Toggle>
                    </div>
                  </div>
                </TabsContent>

                {/* Physical Symptoms Tab */}
                <TabsContent value="symptoms">
                  <div className="mb-4">
                    <Label className="text-base mb-3 block">Physical symptoms</Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedDateSymptoms
                        .filter(symptom => symptom.category === 'body')
                        .map((symptom) => (
                          <Badge 
                            key={symptom.id} 
                            variant="secondary"
                            className="py-1 px-3 flex items-center gap-1"
                          >
                            <span>{symptom.icon}</span>
                            {symptom.name}
                            <button 
                              className="ml-2 text-xs opacity-70 hover:opacity-100"
                              onClick={() => {
                                removeSymptomLog(currentDate, symptom.id);
                                setSelectedSymptoms(prev => {
                                  const newSet = new Set(prev);
                                  newSet.delete(symptom.id);
                                  return newSet;
                                });
                              }}
                            >
                              ✕
                            </button>
                          </Badge>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {symptoms
                        .filter(symptom => symptom.category === 'body')
                        .map(symptom => (
                          <Toggle 
                            key={symptom.id}
                            pressed={selectedSymptoms.has(symptom.id)}
                            onPressedChange={() => handleSymptomSelect(symptom)}
                            variant="outline"
                            className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground justify-start"
                          >
                            <span className="mr-2">{symptom.icon}</span> 
                            {symptom.name}
                          </Toggle>
                        ))
                      }
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base mb-3 block">Flow</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {symptoms
                        .filter(symptom => symptom.category === 'flow')
                        .map(symptom => (
                          <Toggle 
                            key={symptom.id}
                            pressed={selectedSymptoms.has(symptom.id)}
                            onPressedChange={() => handleSymptomSelect(symptom)}
                            variant="outline"
                            className="data-[state=on]:bg-cycle-pink data-[state=on]:text-white justify-start"
                          >
                            <span className="mr-2">{symptom.icon}</span> 
                            {symptom.name}
                          </Toggle>
                        ))
                      }
                    </div>
                  </div>
                </TabsContent>

                {/* Sleep Tracking Tab */}
                <TabsContent value="sleep">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base">Sleep Quality</Label>
                      <RadioGroup 
                        value={sleepQuality} 
                        onValueChange={handleSleepQualityChange} 
                        className="mt-3 grid grid-cols-3 gap-4"
                      >
                        <Label 
                          htmlFor="sleep-good" 
                          className={`flex items-center justify-center gap-2 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors ${sleepQuality === 'good' ? 'bg-green-50 border-green-200' : ''}`}
                        >
                          <RadioGroupItem value="good" id="sleep-good" className="sr-only" />
                          <Smile className="h-5 w-5 text-green-500" />
                          <span>Good</span>
                        </Label>
                          
                        <Label 
                          htmlFor="sleep-average" 
                          className={`flex items-center justify-center gap-2 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors ${sleepQuality === 'average' ? 'bg-amber-50 border-amber-200' : ''}`}
                        >
                          <RadioGroupItem value="average" id="sleep-average" className="sr-only" />
                          <Meh className="h-5 w-5 text-amber-500" />
                          <span>Average</span>
                        </Label>
                          
                        <Label 
                          htmlFor="sleep-poor" 
                          className={`flex items-center justify-center gap-2 border rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors ${sleepQuality === 'poor' ? 'bg-red-50 border-red-200' : ''}`}
                        >
                          <RadioGroupItem value="poor" id="sleep-poor" className="sr-only" />
                          <Frown className="h-5 w-5 text-red-500" />
                          <span>Poor</span>
                        </Label>
                      </RadioGroup>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-base">Hours Slept</Label>
                        <span className="font-medium">{sleepDuration} hrs</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Moon className="text-indigo-400" />
                        <input
                          type="range"
                          min="1"
                          max="12"
                          step="0.5"
                          value={sleepDuration}
                          onChange={(e) => handleSleepDurationChange(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <Sun className="text-amber-400" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Label htmlFor="notes" className="text-base">Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add any additional notes about how you're feeling today..."
                  className="mt-2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button onClick={saveNotes} className="mt-4">
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

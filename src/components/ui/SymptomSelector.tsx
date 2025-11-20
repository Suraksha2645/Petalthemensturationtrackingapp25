
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCycle } from '@/context/CycleContext';
import { Symptom } from '@/types/cycle';

interface SymptomSelectorProps {
  onSelect?: (symptom: Symptom) => void;
}

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({ onSelect }) => {
  const { symptoms } = useCycle();

  // Group symptoms by category
  const moodSymptoms = symptoms.filter(s => s.category === 'mood');
  const bodySymptoms = symptoms.filter(s => s.category === 'body');
  const flowSymptoms = symptoms.filter(s => s.category === 'flow');
  const otherSymptoms = symptoms.filter(s => s.category === 'other');

  const handleSymptomClick = (symptom: Symptom) => {
    if (onSelect) {
      onSelect(symptom);
    }
  };

  const SymptomButton = ({ symptom }: { symptom: Symptom }) => (
    <Button 
      key={symptom.id}
      variant="outline"
      className="flex flex-col p-3 h-auto card-hover"
      onClick={() => handleSymptomClick(symptom)}
    >
      <span className="text-2xl mb-1">{symptom.icon}</span>
      <span className="text-xs">{symptom.name}</span>
    </Button>
  );

  return (
    <Tabs defaultValue="body" className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="body">Body</TabsTrigger>
        <TabsTrigger value="mood">Mood</TabsTrigger>
        <TabsTrigger value="flow">Flow</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      
      <TabsContent value="body" className="mt-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {bodySymptoms.map(symptom => (
            <SymptomButton key={symptom.id} symptom={symptom} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="mood" className="mt-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {moodSymptoms.map(symptom => (
            <SymptomButton key={symptom.id} symptom={symptom} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="flow" className="mt-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {flowSymptoms.map(symptom => (
            <SymptomButton key={symptom.id} symptom={symptom} />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="other" className="mt-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {otherSymptoms.map(symptom => (
            <SymptomButton key={symptom.id} symptom={symptom} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

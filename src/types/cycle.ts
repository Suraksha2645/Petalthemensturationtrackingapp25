import { ReactNode } from 'react';
import { AdaptivePrediction } from '@/utils/adaptivePrediction';

export type CyclePhase = 'period' | 'fertile' | 'ovulation' | 'regular' | 'unknown';

export interface CycleDay {
  date: string; // ISO date string
  phase: CyclePhase;
}

export interface Symptom {
  id: string;
  name: string;
  category: 'mood' | 'body' | 'flow' | 'other' | 'sleep';
  icon: string;
}

export interface SymptomLog {
  date: string; // ISO date string
  symptomId: string;
  intensity?: number; // 1-12 for sleep duration, 1-3 for intensity
  notes?: string;
}

export interface CycleData {
  startDate: string | null; // ISO date string of period start
  endDate: string | null; // ISO date string of period end
  cycleLength: number; // in days
  periodLength: number; // in days
  logs: CycleDay[];
}

export interface PredictedCycle {
  periodStartDate: string; // ISO date string
  periodEndDate: string; // ISO date string
  ovulationDate: string; // ISO date string
  fertileWindowStart: string; // ISO date string
  fertileWindowEnd: string; // ISO date string
  cycleNumber: number; // 1 for next cycle, 2 for the one after, etc.
}

export interface FertilityWindow {
  ovulationDate: string; // ISO date string
  fertileWindowStart: string; // ISO date string
  fertileWindowEnd: string; // ISO date string
  isOvulationDay: boolean;
  isWithinFertileWindow: boolean;
  daysUntilOvulation: number | null;
  daysUntilFertileWindow: number | null;
  fertilityPercentage: number; // 0-100
}

export interface CycleContextType {
  currentDate: string; // ISO date string
  setCurrentDate: React.Dispatch<React.SetStateAction<string>>;
  cycleData: CycleData;
  setCycleData: React.Dispatch<React.SetStateAction<CycleData>>;
  symptoms: Symptom[];
  symptomLogs: SymptomLog[];
  addSymptomLog: (log: SymptomLog) => void;
  removeSymptomLog: (date: string, symptomId: string) => void;
  pregnancyMode: boolean;
  togglePregnancyMode: () => void;
  logPeriodDay: (date: string, isActive: boolean) => void;
  calculatePhase: (date: string) => CyclePhase;
  daysUntilNextPeriod: number | null;
  predictedCycles: PredictedCycle[]; // New field for predicted cycles
  fertilityWindow: FertilityWindow | null; // New field for fertility tracking
  periodHistory: {startDate: string; endDate: string | null}[]; // Track period history
  addPeriodToHistory: (startDate: string, endDate: string | null) => void;
  adaptivePrediction: AdaptivePrediction | null; // New adaptive prediction field
}

export interface CycleProviderProps {
  children: ReactNode;
}

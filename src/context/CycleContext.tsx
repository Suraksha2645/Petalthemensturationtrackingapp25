import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { CycleContextType, CycleProviderProps, CyclePhase, SymptomLog, Symptom, PredictedCycle, FertilityWindow, CycleData } from '@/types/cycle';
import { defaultCycleData, defaultSymptoms } from '@/data/cycleDefaults';
import { calculatePhase, calculateDaysUntilNextPeriod, predictFutureCycles, calculateFertilityWindow, predictCycleLengthFromHistory } from '@/utils/cycleCalculations';
import { addSymptomLog as addLog, removeSymptomLog as removeLog } from '@/utils/symptomUtils';
import { logPeriodDay as logPeriod } from '@/utils/periodUtils';
import { supabase } from '@/integrations/supabase/client';
import { generateAdaptivePrediction, AdaptivePrediction } from '@/utils/adaptivePrediction';

// Using 'export type' to fix the isolatedModules error
export type { CyclePhase, Symptom } from '@/types/cycle';

export const CycleContext = createContext<CycleContextType | undefined>(undefined);

export const CycleProvider: React.FC<CycleProviderProps> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [cycleData, setCycleData] = useState<CycleData>(defaultCycleData);
  const [symptoms] = useState(defaultSymptoms);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [pregnancyMode, setPregnancyMode] = useState<boolean>(false);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState<number | null>(null);
  const [predictedCycles, setPredictedCycles] = useState<PredictedCycle[]>([]);
  const [fertilityWindow, setFertilityWindow] = useState<FertilityWindow | null>(null);
  const [periodHistory, setPeriodHistory] = useState<{startDate: string; endDate: string | null}[]>([]);
  const [adaptivePrediction, setAdaptivePrediction] = useState<AdaptivePrediction | null>(null);

  // Load cycle data from localStorage or user metadata
  useEffect(() => {
    // First try to load from localStorage
    const savedCycleData = localStorage.getItem('cycleData');
    if (savedCycleData) {
      try {
        const parsedData = JSON.parse(savedCycleData);
        setCycleData(parsedData);
      } catch (err) {
        console.error('Failed to parse saved cycle data', err);
      }
    }

    // Then check if user is logged in and has metadata
    const getUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const metadata = data.user.user_metadata;
        if (metadata && metadata.last_period_date) {
          const updatedCycleData = {
            startDate: metadata.last_period_date,
            endDate: metadata.period_end_date || null,
            cycleLength: metadata.cycle_length || defaultCycleData.cycleLength,
            periodLength: metadata.period_length || defaultCycleData.periodLength,
            logs: cycleData.logs // Keep existing logs
          };
          setCycleData(updatedCycleData);
          
          // Load period history if available
          if (metadata.period_history && Array.isArray(metadata.period_history)) {
            setPeriodHistory(metadata.period_history);
          }
          
          localStorage.setItem('cycleData', JSON.stringify(updatedCycleData));
        }
      }
    };

    getUserData();
  }, []);

  // Save cycle data to localStorage whenever it changes
  useEffect(() => {
    if (cycleData.startDate) {
      localStorage.setItem('cycleData', JSON.stringify(cycleData));
    }
  }, [cycleData]);

  // Enhanced calculation using adaptive prediction
  useEffect(() => {
    if (cycleData.startDate && periodHistory.length > 0) {
      const prediction = generateAdaptivePrediction(cycleData.startDate, periodHistory);
      setAdaptivePrediction(prediction);
      
      // Update cycle data with adaptive predictions
      if (Math.abs(prediction.cycleLengthPrediction - cycleData.cycleLength) >= 2) {
        setCycleData(prev => ({
          ...prev,
          cycleLength: prediction.cycleLengthPrediction,
          periodLength: prediction.periodLengthPrediction
        }));
      }
    }
  }, [cycleData.startDate, periodHistory]);

  // Calculate days until next period using adaptive prediction
  useEffect(() => {
    if (adaptivePrediction && !pregnancyMode) {
      const nextPeriodDate = parseISO(adaptivePrediction.nextPeriodDate);
      const days = differenceInDays(nextPeriodDate, new Date());
      setDaysUntilNextPeriod(days >= 0 ? days : 0);
    } else {
      const days = calculateDaysUntilNextPeriod(cycleData.startDate, cycleData.cycleLength, pregnancyMode);
      setDaysUntilNextPeriod(days);
    }
  }, [adaptivePrediction, cycleData, pregnancyMode]);

  // Generate predictions when cycle data changes
  useEffect(() => {
    if (cycleData.startDate && !pregnancyMode) {
      // Use adaptive cycle length if available
      const effectiveCycleLength = adaptivePrediction?.cycleLengthPrediction || cycleData.cycleLength;
      const effectiveCycleData = {
        ...cycleData,
        cycleLength: effectiveCycleLength
      };
      
      const predictions = predictFutureCycles(effectiveCycleData, 5, pregnancyMode);
      setPredictedCycles(predictions);
      
      // Calculate fertility window
      const fertility = calculateFertilityWindow(effectiveCycleData);
      setFertilityWindow(fertility);
    } else {
      setPredictedCycles([]);
      setFertilityWindow(null);
    }
  }, [cycleData, pregnancyMode, adaptivePrediction]);

  const addSymptomLog = (log: SymptomLog) => {
    setSymptomLogs(currentLogs => addLog(currentLogs, log));
  };

  const removeSymptomLog = (date: string, symptomId: string) => {
    setSymptomLogs(currentLogs => removeLog(currentLogs, date, symptomId));
  };

  const togglePregnancyMode = () => {
    setPregnancyMode(!pregnancyMode);
  };

  const calculatePhaseForDate = (date: string): CyclePhase => {
    return calculatePhase(date, cycleData, pregnancyMode);
  };

  // New method to add a period to history
  const addPeriodToHistory = (startDate: string, endDate: string | null) => {
    const newPeriod = { startDate, endDate };
    
    // Don't add duplicates
    if (periodHistory.some(p => p.startDate === startDate)) {
      return;
    }
    
    const updatedHistory = [...periodHistory, newPeriod].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    setPeriodHistory(updatedHistory);
    
    // Update user metadata if logged in
    const updateUserMetadata = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.auth.updateUser({
          data: {
            period_history: updatedHistory
          }
        });
      }
    };
    
    updateUserMetadata();
    
    // Check if we should update cycle length based on new data
    if (updatedHistory.length >= 2) {
      const predictedLength = predictCycleLengthFromHistory(updatedHistory);
      if (Math.abs(predictedLength - cycleData.cycleLength) >= 2) {
        // Only update if the difference is significant (2+ days)
        setCycleData(prev => ({
          ...prev,
          cycleLength: predictedLength
        }));
      }
    }
  };

  const logPeriodDay = (date: string, isActive: boolean) => {
    setCycleData(currentData => {
      const updatedData = logPeriod(date, isActive, currentData);
      
      // If this is a new period, add it to history
      if (isActive && updatedData.startDate && 
          (!currentData.startDate || updatedData.startDate !== currentData.startDate)) {
        // Add to period history
        addPeriodToHistory(updatedData.startDate, updatedData.endDate);
      }
      
      // Update Supabase user metadata if logged in
      const updateUserMetadata = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          await supabase.auth.updateUser({
            data: {
              last_period_date: updatedData.startDate,
              period_length: updatedData.periodLength,
              cycle_length: updatedData.cycleLength
            }
          });
        }
      };
      
      updateUserMetadata();
      return updatedData;
    });
  };

  return (
    <CycleContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        cycleData,
        setCycleData,
        symptoms,
        symptomLogs,
        addSymptomLog,
        removeSymptomLog,
        pregnancyMode,
        togglePregnancyMode,
        logPeriodDay,
        calculatePhase: calculatePhaseForDate,
        daysUntilNextPeriod,
        predictedCycles,
        fertilityWindow,
        periodHistory,
        addPeriodToHistory,
        adaptivePrediction
      }}
    >
      {children}
    </CycleContext.Provider>
  );
};

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (context === undefined) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
};


import { SymptomLog } from '../types/cycle';

export const addSymptomLog = (
  currentLogs: SymptomLog[], 
  newLog: SymptomLog
): SymptomLog[] => {
  // Remove existing log with same date and symptom if it exists
  const filteredLogs = currentLogs.filter(
    existingLog => !(existingLog.date === newLog.date && existingLog.symptomId === newLog.symptomId)
  );
  return [...filteredLogs, newLog];
};

export const removeSymptomLog = (
  currentLogs: SymptomLog[],
  date: string, 
  symptomId: string
): SymptomLog[] => {
  return currentLogs.filter(
    log => !(log.date === date && log.symptomId === symptomId)
  );
};


import { CycleData, CycleDay, CyclePhase } from '../types/cycle';
import { addDays, format } from 'date-fns';

export const logPeriodDay = (
  date: string, 
  isActive: boolean, 
  currentCycleData: CycleData
): CycleData => {
  const existingLogIndex = currentCycleData.logs.findIndex(log => log.date === date);
  
  if (isActive) {
    // Add period day
    if (existingLogIndex === -1) {
      const newLogs = [...currentCycleData.logs, { date, phase: 'period' as CyclePhase }];
      
      // Sort logs by date
      newLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Update start date if this is the earliest date
      const newStartDate = currentCycleData.startDate 
        ? new Date(date) < new Date(currentCycleData.startDate) 
          ? date 
          : currentCycleData.startDate
        : date;
        
      // Update end date if this is the latest date
      const newEndDate = currentCycleData.endDate
        ? new Date(date) > new Date(currentCycleData.endDate)
          ? date
          : currentCycleData.endDate
        : date;
        
      return {
        ...currentCycleData,
        logs: newLogs,
        startDate: newStartDate,
        endDate: newEndDate,
      };
    }
    return currentCycleData;
  } else {
    // Remove period day
    if (existingLogIndex !== -1) {
      const newLogs = currentCycleData.logs.filter(log => log.date !== date);
      
      // Recalculate start and end dates if needed
      let newStartDate = currentCycleData.startDate;
      let newEndDate = currentCycleData.endDate;
      
      if (newLogs.length === 0) {
        newStartDate = null;
        newEndDate = null;
      } else {
        // Filter only period logs for start/end date calculation
        const periodLogs = newLogs.filter(log => log.phase === 'period');
        
        if (periodLogs.length > 0) {
          // Sort logs by date for easy min/max
          periodLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          newStartDate = periodLogs[0].date;
          newEndDate = periodLogs[periodLogs.length - 1].date;
        }
      }
      
      return {
        ...currentCycleData,
        logs: newLogs,
        startDate: newStartDate,
        endDate: newEndDate,
      };
    }
    return currentCycleData;
  }
};

// Function to predict period end date based on start date and period length
export const predictPeriodEndDate = (
  startDate: string | null,
  periodLength: number
): string | null => {
  if (!startDate) return null;
  
  try {
    const start = new Date(startDate);
    const end = addDays(start, periodLength - 1); // -1 because the start day counts as the first day
    return format(end, 'yyyy-MM-dd');
  } catch (error) {
    console.error("Error predicting period end date:", error);
    return null;
  }
};

// Function to automatically log predicted period days based on start date and period length
export const logPredictedPeriodDays = (
  startDate: string,
  periodLength: number,
  currentCycleData: CycleData
): CycleData => {
  if (!startDate) return currentCycleData;
  
  const newLogs = [...currentCycleData.logs];
  const start = new Date(startDate);
  
  // Add each day of the predicted period
  for (let i = 0; i < periodLength; i++) {
    const currentDate = addDays(start, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Check if this date is already logged
    const existingLogIndex = newLogs.findIndex(log => log.date === dateStr);
    
    if (existingLogIndex === -1) {
      // Add new log if doesn't exist
      newLogs.push({
        date: dateStr,
        phase: 'period'
      });
    }
  }
  
  // Sort logs by date
  newLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate end date (start date + period length - 1)
  const endDate = format(addDays(start, periodLength - 1), 'yyyy-MM-dd');
  
  return {
    ...currentCycleData,
    logs: newLogs,
    startDate,
    endDate,
  };
};

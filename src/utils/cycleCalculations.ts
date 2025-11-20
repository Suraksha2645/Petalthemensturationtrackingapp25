
import { parseISO, differenceInDays, addDays, format, isWithinInterval, isSameDay } from 'date-fns';
import { CyclePhase, CycleData, PredictedCycle, FertilityWindow } from '../types/cycle';

export const calculatePhase = (date: string, cycleData: CycleData, pregnancyMode: boolean): CyclePhase => {
  if (pregnancyMode) return 'unknown';
  
  // If no period data yet
  if (!cycleData.startDate) return 'unknown';
  
  const targetDate = parseISO(date);
  const periodStartDate = parseISO(cycleData.startDate);
  
  // Calculate days since period start
  const daysSincePeriodStart = differenceInDays(targetDate, periodStartDate);
  
  // If within period
  if (daysSincePeriodStart >= 0 && daysSincePeriodStart < cycleData.periodLength) {
    return 'period';
  }
  
  // Calculate estimated ovulation day (typically 14 days before next period)
  const ovulationDay = cycleData.cycleLength - 14;
  
  // Fertile window is typically 5 days before ovulation plus 1 day after
  const fertileWindowStart = ovulationDay - 5;
  const fertileWindowEnd = ovulationDay + 1;
  
  // Check if date is within fertile window
  if (
    daysSincePeriodStart % cycleData.cycleLength >= fertileWindowStart && 
    daysSincePeriodStart % cycleData.cycleLength <= fertileWindowEnd
  ) {
    // Exactly on ovulation day
    if (daysSincePeriodStart % cycleData.cycleLength === ovulationDay) {
      return 'ovulation';
    }
    // Within fertile window
    return 'fertile';
  }
  
  // Regular day (not period or fertile)
  return 'regular';
};

export const calculateDaysUntilNextPeriod = (
  startDate: string | null, 
  cycleLength: number, 
  pregnancyMode: boolean
): number | null => {
  if (startDate && !pregnancyMode) {
    const lastPeriodStart = parseISO(startDate);
    const nextPeriodDate = addDays(lastPeriodStart, cycleLength);
    const daysUntil = differenceInDays(nextPeriodDate, new Date());
    return daysUntil >= 0 ? daysUntil : cycleLength + daysUntil;
  }
  return null;
};

// Enhanced function to predict cycle length based on historical data
export const predictCycleLengthFromHistory = (
  historicalPeriods: { startDate: string; endDate?: string | null }[]
): number => {
  if (!historicalPeriods || historicalPeriods.length < 2) {
    return 28; // Default cycle length if not enough data
  }
  
  // Sort periods by date
  const sortedPeriods = [...historicalPeriods]
    .sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime());
  
  // Calculate average cycle length from last few cycles
  let totalDays = 0;
  let cycleCount = 0;
  
  for (let i = 1; i < sortedPeriods.length; i++) {
    const currentStart = parseISO(sortedPeriods[i].startDate);
    const prevStart = parseISO(sortedPeriods[i-1].startDate);
    const cycleDays = differenceInDays(currentStart, prevStart);
    
    // Only count if it's a reasonable cycle length (21-45 days)
    if (cycleDays >= 21 && cycleDays <= 45) {
      totalDays += cycleDays;
      cycleCount++;
    }
  }
  
  // Return average or default if no valid cycles
  return cycleCount > 0 ? Math.round(totalDays / cycleCount) : 28;
};

// New function to generate predicted cycles
export const predictFutureCycles = (
  cycleData: CycleData,
  numberOfCycles: number = 3,
  pregnancyMode: boolean = false
): PredictedCycle[] => {
  if (!cycleData.startDate || pregnancyMode) {
    return [];
  }
  
  const predictions: PredictedCycle[] = [];
  let lastPeriodStart = parseISO(cycleData.startDate);
  
  for (let i = 0; i < numberOfCycles; i++) {
    // Calculate next period start date
    const nextPeriodStart = addDays(lastPeriodStart, cycleData.cycleLength);
    
    // Calculate period end date
    const periodEndDate = addDays(nextPeriodStart, cycleData.periodLength - 1);
    
    // Calculate ovulation day (typically 14 days before next period)
    const ovulationDate = addDays(nextPeriodStart, cycleData.cycleLength - 14);
    
    // Calculate fertile window (5 days before ovulation plus 1 day after)
    const fertileWindowStart = addDays(ovulationDate, -5);
    const fertileWindowEnd = addDays(ovulationDate, 1);
    
    predictions.push({
      periodStartDate: format(nextPeriodStart, 'yyyy-MM-dd'),
      periodEndDate: format(periodEndDate, 'yyyy-MM-dd'),
      ovulationDate: format(ovulationDate, 'yyyy-MM-dd'),
      fertileWindowStart: format(fertileWindowStart, 'yyyy-MM-dd'),
      fertileWindowEnd: format(fertileWindowEnd, 'yyyy-MM-dd'),
      cycleNumber: i + 1,
    });
    
    // Set up for next cycle
    lastPeriodStart = nextPeriodStart;
  }
  
  return predictions;
};

// Calculate current fertility status
export const calculateFertilityWindow = (
  cycleData: CycleData
): FertilityWindow | null => {
  if (!cycleData.startDate) return null;
  
  try {
    const today = new Date();
    const periodStartDate = parseISO(cycleData.startDate);
    
    // Calculate next cycle start
    const nextCycleStart = addDays(periodStartDate, cycleData.cycleLength);
    
    // Calculate ovulation day (typically 14 days before next period)
    const ovulationDate = addDays(nextCycleStart, -14);
    
    // Calculate fertile window (5 days before ovulation plus 1 day after)
    const fertileWindowStart = addDays(ovulationDate, -5);
    const fertileWindowEnd = addDays(ovulationDate, 1);
    
    // Calculate days until ovulation
    const daysUntilOvulation = differenceInDays(ovulationDate, today);
    
    // Calculate days until fertile window starts
    const daysUntilFertileWindow = differenceInDays(fertileWindowStart, today);
    
    // Check if today is ovulation day
    const isOvulationDay = isSameDay(today, ovulationDate);
    
    // Check if today is within the fertile window
    const isWithinFertileWindow = isWithinInterval(today, {
      start: fertileWindowStart,
      end: fertileWindowEnd
    });
    
    // Calculate fertility percentage
    let fertilityPercentage = 0;
    
    if (isOvulationDay) {
      fertilityPercentage = 100; // Peak fertility on ovulation day
    } else if (isWithinFertileWindow) {
      // Closer to ovulation = higher percentage
      const daysFromOvulation = Math.abs(differenceInDays(today, ovulationDate));
      fertilityPercentage = Math.max(0, 100 - (daysFromOvulation * 20)); // 20% drop per day from ovulation
    }
    
    return {
      ovulationDate: format(ovulationDate, 'yyyy-MM-dd'),
      fertileWindowStart: format(fertileWindowStart, 'yyyy-MM-dd'),
      fertileWindowEnd: format(fertileWindowEnd, 'yyyy-MM-dd'),
      isOvulationDay,
      isWithinFertileWindow,
      daysUntilOvulation: daysUntilOvulation > 0 ? daysUntilOvulation : null,
      daysUntilFertileWindow: daysUntilFertileWindow > 0 ? daysUntilFertileWindow : null,
      fertilityPercentage
    };
  } catch (error) {
    console.error("Error calculating fertility window:", error);
    return null;
  }
};

// New function to calculate pregnancy probability based on symptoms and cycle
export const calculatePregnancyProbability = (
  daysLatePeriod: number,
  symptoms: string[],
  hadUnprotectedSex: boolean
): number => {
  let probability = 0;
  
  // Base probability from late period
  if (daysLatePeriod > 0) {
    probability += Math.min(daysLatePeriod * 5, 50); // Up to 50% from late period
  }
  
  // Add probability from common pregnancy symptoms
  const pregnancySymptoms = [
    'nausea', 'fatigue', 'breastTenderness', 'foodAversions', 
    'frequentUrination', 'moodSwings', 'missedPeriod'
  ];
  
  if (symptoms && symptoms.length > 0) {
    const matchingSymptoms = symptoms.filter(s => 
      pregnancySymptoms.some(ps => s.toLowerCase().includes(ps.toLowerCase()))
    );
    
    probability += matchingSymptoms.length * 5; // 5% per matching symptom
  }
  
  // Factor in unprotected sex
  if (hadUnprotectedSex) {
    probability += 10;
  }
  
  // Cap probability
  return Math.min(Math.max(probability, 0), 99);
};

// Function to provide information about fetal development by trimester
export const getFetalDevelopmentInfo = (
  trimester: 1 | 2 | 3,
  weekOfPregnancy: number
): { title: string; description: string; milestones: string[] } => {
  // First trimester (weeks 1-12)
  if (trimester === 1) {
    return {
      title: "First Trimester Development",
      description: "During the first trimester, your baby's body structure and organ systems develop.",
      milestones: [
        "Weeks 1-4: Implantation occurs, and the neural tube forms",
        "Weeks 5-8: Heart begins to beat, and facial features start forming",
        "Weeks 9-12: All essential organs have begun to develop, and sex organs start differentiating"
      ]
    };
  } 
  // Second trimester (weeks 13-27)
  else if (trimester === 2) {
    return {
      title: "Second Trimester Development",
      description: "During the second trimester, your baby grows bigger and stronger, and organs mature.",
      milestones: [
        "Weeks 13-16: Baby begins to move, and facial expressions develop",
        "Weeks 17-20: Baby's movements become noticeable (quickening), and protective coating (vernix) forms",
        "Weeks 21-27: Baby develops a regular schedule of sleeping and waking, and fingerprints form"
      ]
    };
  } 
  // Third trimester (weeks 28-40+)
  else {
    return {
      title: "Third Trimester Development",
      description: "During the third trimester, your baby gains weight and prepares for birth.",
      milestones: [
        "Weeks 28-31: Baby's brain develops rapidly, and can open and close eyes",
        "Weeks 32-35: Baby practices breathing movements, and most organs are fully developed",
        "Weeks 36-40+: Baby shifts into a head-down position for birth, and lungs finish developing"
      ]
    };
  }
};

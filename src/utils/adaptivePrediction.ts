
import { differenceInDays, addDays, parseISO, format } from 'date-fns';

export interface CyclePattern {
  averageCycleLength: number;
  averagePeriodLength: number;
  cycleVariability: number; // Standard deviation
  periodVariability: number;
  confidence: number; // 0-100, based on data quality and consistency
  trendDirection: 'stable' | 'increasing' | 'decreasing'; // Cycle length trend
  predictionAccuracy?: number; // New: Track prediction accuracy
  dataQuality: number; // New: Overall data quality score
}

export interface AdaptivePrediction {
  nextPeriodDate: string;
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  cycleLengthPrediction: number;
  periodLengthPrediction: number;
  pattern: CyclePattern;
  predictionRange: { earliest: string; latest: string }; // New: Prediction range
}

// Enhanced cycle analysis with weighted recent data and lifestyle factors
export const analyzeUserPattern = (
  periodHistory: { startDate: string; endDate: string | null }[],
  lifestyleData?: any
): CyclePattern => {
  if (periodHistory.length < 2) {
    return {
      averageCycleLength: 28,
      averagePeriodLength: 5,
      cycleVariability: 0,
      periodVariability: 0,
      confidence: 10,
      trendDirection: 'stable',
      predictionAccuracy: 0,
      dataQuality: 0
    };
  }

  // Calculate cycle lengths with weights (recent cycles matter more)
  const cycleLengths: { length: number; weight: number }[] = [];
  const periodLengths: { length: number; weight: number }[] = [];

  for (let i = 1; i < periodHistory.length; i++) {
    const currentStart = parseISO(periodHistory[i].startDate);
    const prevStart = parseISO(periodHistory[i - 1].startDate);
    const cycleLength = differenceInDays(currentStart, prevStart);
    
    // Only include reasonable cycle lengths (21-45 days)
    if (cycleLength >= 21 && cycleLength <= 45) {
      // Weight recent cycles more heavily (exponential decay)
      const ageWeight = Math.exp(-0.1 * (periodHistory.length - i - 1));
      cycleLengths.push({ length: cycleLength, weight: ageWeight });
    }
  }

  // Calculate period lengths with weights
  periodHistory.forEach((period, index) => {
    if (period.endDate) {
      const start = parseISO(period.startDate);
      const end = parseISO(period.endDate);
      const periodLength = differenceInDays(end, start) + 1;
      
      // Only include reasonable period lengths (2-10 days)
      if (periodLength >= 2 && periodLength <= 10) {
        const ageWeight = Math.exp(-0.1 * (periodHistory.length - index - 1));
        periodLengths.push({ length: periodLength, weight: ageWeight });
      }
    }
  });

  // Calculate weighted averages
  const totalCycleWeight = cycleLengths.reduce((sum, cycle) => sum + cycle.weight, 0);
  const totalPeriodWeight = periodLengths.reduce((sum, period) => sum + period.weight, 0);
  
  const avgCycleLength = cycleLengths.length > 0 
    ? cycleLengths.reduce((sum, cycle) => sum + (cycle.length * cycle.weight), 0) / totalCycleWeight
    : 28;
    
  const avgPeriodLength = periodLengths.length > 0
    ? periodLengths.reduce((sum, period) => sum + (period.length * period.weight), 0) / totalPeriodWeight
    : 5;

  // Calculate weighted variability
  const cycleVariability = cycleLengths.length > 1
    ? Math.sqrt(cycleLengths.reduce((sum, cycle) => {
        return sum + (cycle.weight * Math.pow(cycle.length - avgCycleLength, 2));
      }, 0) / totalCycleWeight)
    : 0;
    
  const periodVariability = periodLengths.length > 1
    ? Math.sqrt(periodLengths.reduce((sum, period) => {
        return sum + (period.weight * Math.pow(period.length - avgPeriodLength, 2));
      }, 0) / totalPeriodWeight)
    : 0;

  // Enhanced confidence calculation with lifestyle factors
  let confidence = 0;
  let dataQuality = 0;
  
  // Data quantity score (0-35 points, reduced to make room for lifestyle factors)
  if (cycleLengths.length >= 6) {
    confidence += 35;
    dataQuality += 35;
  } else if (cycleLengths.length >= 4) {
    confidence += 25;
    dataQuality += 25;
  } else if (cycleLengths.length >= 2) {
    confidence += 15;
    dataQuality += 15;
  } else {
    confidence += 5;
    dataQuality += 5;
  }
  
  // Consistency score (0-25 points)
  if (cycleVariability <= 1.5) {
    confidence += 25;
    dataQuality += 25;
  } else if (cycleVariability <= 3) {
    confidence += 15;
    dataQuality += 15;
  } else if (cycleVariability <= 5) {
    confidence += 8;
    dataQuality += 8;
  }
  
  // Recency score (0-15 points)
  if (periodHistory.length > 0) {
    const lastPeriod = parseISO(periodHistory[periodHistory.length - 1].startDate);
    const daysSinceLastPeriod = differenceInDays(new Date(), lastPeriod);
    if (daysSinceLastPeriod <= 35) {
      confidence += 15;
      dataQuality += 15;
    } else if (daysSinceLastPeriod <= 60) {
      confidence += 8;
      dataQuality += 8;
    }
  }
  
  // Data completeness score (0-10 points)
  const completePeriods = periodHistory.filter(p => p.endDate).length;
  const completenessRatio = completePeriods / periodHistory.length;
  confidence += completenessRatio * 10;
  dataQuality += completenessRatio * 10;
  
  // New: Lifestyle factors confidence boost (0-15 points)
  if (lifestyleData) {
    let lifestyleBonus = 0;
    
    // Age factor (younger age = more regular cycles typically)
    if (lifestyleData.age) {
      if (lifestyleData.age >= 18 && lifestyleData.age <= 35) {
        lifestyleBonus += 3;
      }
    }
    
    // Stress level factor
    if (lifestyleData.stressLevel === 'low') {
      lifestyleBonus += 4;
    } else if (lifestyleData.stressLevel === 'moderate') {
      lifestyleBonus += 2;
    }
    
    // Exercise factor
    if (lifestyleData.exerciseFrequency === 'moderate') {
      lifestyleBonus += 3;
    } else if (lifestyleData.exerciseFrequency === 'light') {
      lifestyleBonus += 2;
    }
    
    // Sleep quality factor
    if (lifestyleData.sleepQuality === 'excellent' || lifestyleData.sleepQuality === 'good') {
      lifestyleBonus += 3;
    }
    
    // Work schedule factor
    if (lifestyleData.workSchedule === 'regular') {
      lifestyleBonus += 2;
    }
    
    confidence += Math.min(lifestyleBonus, 15);
  }
  
  // Enhanced trend detection
  let trendDirection: 'stable' | 'increasing' | 'decreasing' = 'stable';
  if (cycleLengths.length >= 3) {
    // Use linear regression on recent cycles
    const recentCycles = cycleLengths.slice(-4).map(c => c.length);
    const n = recentCycles.length;
    const sumX = recentCycles.reduce((sum, _, i) => sum + i, 0);
    const sumY = recentCycles.reduce((sum, len) => sum + len, 0);
    const sumXY = recentCycles.reduce((sum, len, i) => sum + (i * len), 0);
    const sumXX = recentCycles.reduce((sum, _, i) => sum + (i * i), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    if (slope > 0.5) trendDirection = 'increasing';
    else if (slope < -0.5) trendDirection = 'decreasing';
  }

  return {
    averageCycleLength: Math.round(avgCycleLength),
    averagePeriodLength: Math.round(avgPeriodLength),
    cycleVariability: Math.round(cycleVariability * 10) / 10,
    periodVariability: Math.round(periodVariability * 10) / 10,
    confidence: Math.min(confidence, 100),
    trendDirection,
    predictionAccuracy: 0, // Will be calculated separately
    dataQuality: Math.min(dataQuality, 100)
  };
};

// Enhanced prediction generation with confidence ranges
export const generateAdaptivePrediction = (
  lastPeriodStart: string,
  periodHistory: { startDate: string; endDate: string | null }[],
  lifestyleData?: any
): AdaptivePrediction => {
  const pattern = analyzeUserPattern(periodHistory, lifestyleData);
  
  // Adjust prediction based on trend with confidence weighting
  let adjustedCycleLength = pattern.averageCycleLength;
  
  // Apply lifestyle adjustments to cycle length prediction
  if (lifestyleData) {
    let adjustment = 0;
    
    // Stress can lengthen cycles
    if (lifestyleData.stressLevel === 'high') {
      adjustment += 0.5;
    }
    
    // Intense exercise can affect cycles
    if (lifestyleData.exerciseFrequency === 'intense') {
      adjustment += 0.3;
    }
    
    // Poor sleep can affect regularity
    if (lifestyleData.sleepQuality === 'poor') {
      adjustment += 0.3;
    }
    
    // Shift work can disrupt cycles
    if (lifestyleData.workSchedule === 'shift' || lifestyleData.workSchedule === 'irregular') {
      adjustment += 0.4;
    }
    
    // Some health conditions affect cycles
    if (lifestyleData.healthConditions?.includes('PCOS (Polycystic Ovary Syndrome)')) {
      adjustment += 1.0;
    }
    if (lifestyleData.healthConditions?.includes('Thyroid disorder')) {
      adjustment += 0.5;
    }
    
    adjustedCycleLength += adjustment;
  }
  
  if (pattern.trendDirection === 'increasing') {
    const adjustment = Math.min(pattern.cycleVariability * 0.3, 1.5);
    adjustedCycleLength += adjustment;
  } else if (pattern.trendDirection === 'decreasing') {
    const adjustment = Math.min(pattern.cycleVariability * 0.3, 1.5);
    adjustedCycleLength -= adjustment;
  }
  
  // Calculate prediction range based on variability
  const rangeSize = Math.max(pattern.cycleVariability, 2);
  const earliestCycleLength = Math.max(adjustedCycleLength - rangeSize, 21);
  const latestCycleLength = Math.min(adjustedCycleLength + rangeSize, 45);
  
  // Calculate dates
  const lastStart = parseISO(lastPeriodStart);
  const nextPeriodDate = addDays(lastStart, Math.round(adjustedCycleLength));
  const earliestDate = addDays(lastStart, Math.round(earliestCycleLength));
  const latestDate = addDays(lastStart, Math.round(latestCycleLength));
  
  // Determine confidence level with improved thresholds
  let confidenceLevel: 'low' | 'medium' | 'high' = 'low';
  if (pattern.confidence >= 75) confidenceLevel = 'high';
  else if (pattern.confidence >= 50) confidenceLevel = 'medium';
  
  return {
    nextPeriodDate: format(nextPeriodDate, 'yyyy-MM-dd'),
    confidence: pattern.confidence,
    confidenceLevel,
    cycleLengthPrediction: Math.round(adjustedCycleLength),
    periodLengthPrediction: pattern.averagePeriodLength,
    pattern,
    predictionRange: {
      earliest: format(earliestDate, 'yyyy-MM-dd'),
      latest: format(latestDate, 'yyyy-MM-dd')
    }
  };
};

// Enhanced personalized insights with lifestyle factors
export const getPersonalizedInsights = (pattern: CyclePattern, lifestyleData?: any): string[] => {
  const insights: string[] = [];
  
  // Data quality insights
  if (pattern.confidence < 40) {
    insights.push("Keep logging periods consistently for more accurate predictions!");
  } else if (pattern.confidence >= 75) {
    insights.push("Great data quality! Your predictions are highly reliable.");
  }
  
  // Cycle regularity insights
  if (pattern.cycleVariability <= 2) {
    insights.push("Your cycles are very regular - excellent for planning ahead!");
  } else if (pattern.cycleVariability > 6) {
    insights.push("Your cycles show variation. Consider tracking stress, sleep, and exercise patterns.");
  }
  
  // Trend insights
  if (pattern.trendDirection === 'increasing') {
    insights.push("Your cycle length has been gradually increasing. This is often normal but worth monitoring.");
  } else if (pattern.trendDirection === 'decreasing') {
    insights.push("Your cycle length has been gradually decreasing. Consider any recent lifestyle changes.");
  }
  
  // Cycle length insights
  if (pattern.averageCycleLength < 25) {
    insights.push("Your cycles are shorter than average (21-35 days). Consider discussing with a healthcare provider.");
  } else if (pattern.averageCycleLength > 35) {
    insights.push("Your cycles are longer than average. This can be normal, but tracking symptoms may help.");
  } else {
    insights.push("Your cycle length is within the normal range of 21-35 days.");
  }
  
  // Lifestyle-based insights
  if (lifestyleData) {
    if (lifestyleData.stressLevel === 'high') {
      insights.push("High stress levels can affect cycle regularity. Consider stress management techniques.");
    }
    
    if (lifestyleData.exerciseFrequency === 'intense') {
      insights.push("Intense exercise can sometimes affect cycles. Monitor for any changes in pattern.");
    }
    
    if (lifestyleData.sleepQuality === 'poor') {
      insights.push("Poor sleep quality can impact hormonal balance. Improving sleep may help cycle regularity.");
    }
    
    if (lifestyleData.workSchedule === 'shift') {
      insights.push("Shift work can disrupt circadian rhythms and affect cycles. Try to maintain consistent sleep patterns when possible.");
    }
    
    if (lifestyleData.healthConditions?.includes('PCOS (Polycystic Ovary Syndrome)')) {
      insights.push("PCOS can cause irregular cycles. Your predictions account for this increased variability.");
    }
  }
  
  // Data completeness insights
  if (pattern.dataQuality < 50) {
    insights.push("Logging period end dates will improve prediction accuracy.");
  }
  
  return insights;
};

// New: Function to calculate prediction accuracy (would be called when actual periods are logged)
export const calculatePredictionAccuracy = (
  predictions: { date: string; actualDate?: string }[]
): number => {
  if (predictions.length === 0) return 0;
  
  const accuratePredictions = predictions.filter(pred => {
    if (!pred.actualDate) return false;
    const predictedDate = parseISO(pred.date);
    const actualDate = parseISO(pred.actualDate);
    const daysDifference = Math.abs(differenceInDays(actualDate, predictedDate));
    return daysDifference <= 2; // Within 2 days is considered accurate
  });
  
  return (accuratePredictions.length / predictions.length) * 100;
};

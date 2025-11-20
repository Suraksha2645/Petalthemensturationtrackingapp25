
import { CycleData, PredictedCycle, SymptomLog } from '@/types/cycle';
import { differenceInDays } from 'date-fns';

// Analysis type to track patterns and recommendations
export interface CycleAnalysis {
  isRegular: boolean;
  averageCycleLength: number | null;
  cycleLengthVariation: number | null;
  shortCycleCount: number;
  longCycleCount: number;
  irregularPatterns: string[];
  recommendations: string[];
}

// Function to analyze cycle data and detect irregular patterns
export const analyzeCycleData = (cycleData: CycleData, pastCycles?: PredictedCycle[]): CycleAnalysis => {
  // Default analysis results
  const analysis: CycleAnalysis = {
    isRegular: true,
    averageCycleLength: null,
    cycleLengthVariation: null,
    shortCycleCount: 0,
    longCycleCount: 0,
    irregularPatterns: [],
    recommendations: [],
  };

  // Not enough data for analysis
  if (!cycleData.startDate) {
    analysis.isRegular = false;
    analysis.irregularPatterns.push("Insufficient data to analyze cycle patterns");
    analysis.recommendations.push("Track at least 3 complete cycles for personalized insights");
    return analysis;
  }

  // Set the average cycle length from current data
  analysis.averageCycleLength = cycleData.cycleLength;
  
  // Add recommendations based on cycle length
  if (cycleData.cycleLength < 21) {
    analysis.isRegular = false;
    analysis.shortCycleCount = 1;
    analysis.irregularPatterns.push("Your cycle appears to be shorter than the typical range (21-35 days)");
    analysis.recommendations.push("Consider consulting a healthcare provider about your short cycle length");
  } else if (cycleData.cycleLength > 35) {
    analysis.isRegular = false;
    analysis.longCycleCount = 1;
    analysis.irregularPatterns.push("Your cycle appears to be longer than the typical range (21-35 days)");
    analysis.recommendations.push("Long cycles can sometimes indicate hormonal imbalances or conditions like PCOS");
  }

  // Period length recommendations
  if (cycleData.periodLength > 7) {
    analysis.isRegular = false;
    analysis.irregularPatterns.push("Your period length is longer than the typical range (3-7 days)");
    analysis.recommendations.push("Extended periods may indicate hormonal issues or other conditions requiring medical attention");
  } else if (cycleData.periodLength < 2) {
    analysis.isRegular = false;
    analysis.irregularPatterns.push("Your period length is shorter than the typical range (3-7 days)");
  }

  // Analyze cycle variation if we have past cycle data
  if (pastCycles && pastCycles.length > 1) {
    // Calculate cycle length variation as standard deviation
    // For simplicity, we're just looking at max difference between cycles
    const cycleLengths = pastCycles.map(cycle => {
      const start = new Date(cycle.periodStartDate);
      const end = new Date(cycle.periodEndDate);
      return differenceInDays(end, start) + 1;
    });
    
    const maxVariation = Math.max(...cycleLengths) - Math.min(...cycleLengths);
    analysis.cycleLengthVariation = maxVariation;
    
    if (maxVariation > 7) {
      analysis.isRegular = false;
      analysis.irregularPatterns.push(`Your cycle length varies significantly (${maxVariation} days difference)`);
      analysis.recommendations.push("Cycle variations exceeding 7 days may indicate hormonal fluctuations");
    }

    // Count short and long cycles
    cycleLengths.forEach(length => {
      if (length < 21) analysis.shortCycleCount++;
      if (length > 35) analysis.longCycleCount++;
    });
  }

  // If everything looks regular
  if (analysis.irregularPatterns.length === 0) {
    analysis.isRegular = true;
    analysis.recommendations.push("Your cycle appears to be within typical ranges");
  }

  // Add general recommendations
  if (analysis.irregularPatterns.length > 0) {
    analysis.recommendations.push("Track your symptoms consistently to identify patterns");
    analysis.recommendations.push("Consider discussing your cycle patterns with a healthcare provider");
  }

  return analysis;
};

// Function to analyze symptom patterns
export const analyzeSymptoms = (symptomLogs: SymptomLog[], symptoms: any[]): string[] => {
  const insights: string[] = [];
  
  // Not enough data
  if (symptomLogs.length < 5) {
    insights.push("Continue tracking your symptoms to receive personalized insights");
    return insights;
  }

  // Count symptoms by category
  const symptomCounts: Record<string, number> = {};
  const symptomMap = new Map(symptoms.map(s => [s.id, s]));
  
  symptomLogs.forEach(log => {
    const symptom = symptomMap.get(log.symptomId);
    if (symptom) {
      const category = symptom.category;
      symptomCounts[category] = (symptomCounts[category] || 0) + 1;
    }
  });

  // Generate insights based on symptom frequencies
  if (symptomCounts['mood'] && symptomCounts['mood'] > 3) {
    insights.push("You've reported multiple mood-related symptoms. Regular exercise and stress-reduction techniques may help manage mood fluctuations");
  }
  
  if (symptomCounts['body'] && symptomCounts['body'] > 3) {
    insights.push("For physical discomfort, consider heat therapy, gentle exercise, or over-the-counter pain relievers as needed");
  }
  
  if (symptomCounts['sleep'] && symptomCounts['sleep'] > 2) {
    insights.push("Your sleep patterns may be affected by your cycle. Consider maintaining a consistent sleep schedule");
  }

  return insights;
};

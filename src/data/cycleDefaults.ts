
import { CycleData, Symptom } from '../types/cycle';

export const defaultCycleData: CycleData = {
  startDate: null,
  endDate: null,
  cycleLength: 28,
  periodLength: 5,
  logs: [],
};

// Sample symptoms data
export const defaultSymptoms: Symptom[] = [
  // Physical symptoms
  { id: 'cramps', name: 'Cramps', category: 'body', icon: '😖' },
  { id: 'headache', name: 'Headache', category: 'body', icon: '🤕' },
  { id: 'bloating', name: 'Bloating', category: 'body', icon: '🫃' },
  { id: 'tender_breasts', name: 'Tender Breasts', category: 'body', icon: '💢' },
  { id: 'backache', name: 'Backache', category: 'body', icon: '🔙' },
  { id: 'nausea', name: 'Nausea', category: 'body', icon: '🤢' },
  { id: 'fatigue', name: 'Fatigue', category: 'body', icon: '😫' },
  { id: 'acne', name: 'Acne', category: 'body', icon: '😾' },
  
  // Mood symptoms
  { id: 'happy', name: 'Happy', category: 'mood', icon: '😊' },
  { id: 'sad', name: 'Sad', category: 'mood', icon: '😢' },
  { id: 'irritable', name: 'Irritable', category: 'mood', icon: '😠' },
  { id: 'anxious', name: 'Anxious', category: 'mood', icon: '😰' },
  { id: 'mood_happy', name: 'Happy', category: 'mood', icon: '😊' },
  { id: 'mood_calm', name: 'Calm', category: 'mood', icon: '😌' },
  { id: 'mood_neutral', name: 'Neutral', category: 'mood', icon: '😐' },
  { id: 'mood_sad', name: 'Sad', category: 'mood', icon: '😢' },
  { id: 'mood_irritable', name: 'Irritable', category: 'mood', icon: '😠' },
  
  // Flow symptoms
  { id: 'light', name: 'Light Flow', category: 'flow', icon: '💧' },
  { id: 'medium', name: 'Medium Flow', category: 'flow', icon: '💦' },
  { id: 'heavy', name: 'Heavy Flow', category: 'flow', icon: '🌊' },
  { id: 'spotting', name: 'Spotting', category: 'flow', icon: '•' },
  
  // Sleep tracking
  { id: 'sleep_good', name: 'Good Sleep', category: 'sleep', icon: '😴' },
  { id: 'sleep_average', name: 'Average Sleep', category: 'sleep', icon: '😴' },
  { id: 'sleep_poor', name: 'Poor Sleep', category: 'sleep', icon: '😴' },
  { id: 'sleep_duration', name: 'Sleep Duration', category: 'sleep', icon: '⏱️' },
];

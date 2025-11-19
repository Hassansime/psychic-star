
export interface Trait {
  trait: string;
  confidence: number; // 0-100
  description: string;
}

export interface Archetype {
  name: string;
  description: string;
  behavioralIndicators: string[];
}

export interface ActionStep {
  timeframe: string;
  action: string;
}

export interface FuturePath {
  pathName: string;
  description: string;
  probability: string;
}

export interface EnergeticOverview {
  symbolic: string;
  translation: string;
}

export interface ReadingResponse {
  energeticOverview: EnergeticOverview;
  coreTraits: Trait[];
  dominantArchetypes: Archetype[];
  actionPlan: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  redFlags: string[];
  futureProjection: {
    pathA: FuturePath;
    pathB: FuturePath;
  };
  closingWisdom: string;
  timestamp?: number; // Added for history
}

// --- New Types ---

export interface BigFiveProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  isComplete: boolean;
}

export interface MoodEntry {
  id: string;
  timestamp: number;
  value: number; // 1-5
  note?: string;
}

export interface UserProfile {
  email: string;
  name: string;
  quizResults: BigFiveProfile | null;
  hasConsented: boolean;
}

export interface HistoricalReading extends ReadingResponse {
  id: string;
  query: string;
}

export interface AppState {
  view: 'auth' | 'quiz' | 'dashboard' | 'reading';
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  currentReading: ReadingResponse | null;
  readingsHistory: HistoricalReading[];
  moodHistory: MoodEntry[];
}

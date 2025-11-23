export interface BigFiveProfile {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
  isComplete?: boolean;
}

export interface Trait {
  trait: string;
  confidence: number;
  description: string;
}

export interface Archetype {
  name: string;
  description: string;
  behavioralIndicators: string[];
}

export interface ReadingResponse {
  id?: string;
  query?: string;
  timestamp?: number;
  energeticOverview: {
    symbolic: string;
    translation: string;
  };
  coreTraits: Trait[];
  dominantArchetypes: Archetype[];
  actionPlan: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  redFlags: string[];
  futureProjection: {
    pathA: {
      pathName: string;
      description: string;
      probability: string;
    };
    pathB: {
      pathName: string;
      description: string;
      probability: string;
    };
  };
  closingWisdom: string;
}

export interface HistoricalReading extends ReadingResponse {
  id: string;
  query: string;
}

export interface MoodEntry {
  id: string;
  timestamp: number;
  value: number;
}

export interface UserProfile {
  email: string;
  name: string;
  verified: boolean;
  quizResults: BigFiveProfile | null;
  hasConsented: boolean;
}

export interface AppState {
  view: 'auth' | 'disclaimer' | 'quiz' | 'dashboard' | 'reading' | 'verify-email';
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  currentReading: ReadingResponse | null;
  readingsHistory: HistoricalReading[];
  moodHistory: MoodEntry[];
}

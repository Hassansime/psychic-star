
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DisclaimerModal } from './components/DisclaimerModal';
import { ReadingView } from './components/ReadingView';
import { AuthView } from './components/AuthView';
import { PersonalityQuiz } from './components/PersonalityQuiz';
import { Dashboard } from './components/Dashboard';
import { generateReading } from './services/geminiService';
import { ReadingResponse, AppState, UserProfile, BigFiveProfile, HistoricalReading, MoodEntry } from './types';
import { Loader2, Send, Star, Sparkles, ArrowLeft } from 'lucide-react';

// Simulated Storage keys
const STORAGE_KEY_SESSION = 'psychelens_session_v1';
const STORAGE_KEY_USERS_DB = 'psychelens_users_db_v1';
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

// Internal type for mock DB
interface UserDBEntry {
  email: string;
  passwordHash: string;
  profile: UserProfile;
  readings: HistoricalReading[];
  moods: MoodEntry[];
}

function App() {
  const [state, setState] = useState<AppState>({
    view: 'auth',
    user: null,
    isLoading: true,
    error: null,
    currentReading: null,
    readingsHistory: [],
    moodHistory: []
  });

  const [userInput, setUserInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Refs for inactivity timer
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Secure SHA-256 Hashing using Web Crypto API with fallback
  const hashPassword = async (pwd: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd + "psychic_star_salt_v1");
    
    // Check for secure context availability
    if (window.crypto && window.crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Simple fallback for insecure contexts (development only)
      console.warn("Secure context not available (crypto.subtle). Using simple fallback.");
      return btoa(pwd + "psychic_star_salt_v1"); 
    }
  };

  // Load Session on mount
  useEffect(() => {
    const loadSession = async () => {
      const sessionEmail = localStorage.getItem(STORAGE_KEY_SESSION);
      const usersDB = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '{}');

      if (sessionEmail && usersDB[sessionEmail]) {
        const userData: UserDBEntry = usersDB[sessionEmail];
        
        setState(prev => ({
          ...prev,
          user: userData.profile,
          readingsHistory: userData.readings,
          moodHistory: userData.moods,
          view: userData.profile.quizResults ? 'dashboard' : 'quiz',
          isLoading: false
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    loadSession();
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Save current state to DB
  const persistUserData = (updatedProfile?: UserProfile, updatedReadings?: HistoricalReading[], updatedMoods?: MoodEntry[]) => {
    if (!state.user?.email && !updatedProfile?.email) return;
    
    const email = updatedProfile?.email || state.user!.email;
    const usersDB = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '{}');
    
    if (usersDB[email]) {
      usersDB[email] = {
        ...usersDB[email],
        profile: updatedProfile || state.user,
        readings: updatedReadings || state.readingsHistory,
        moods: updatedMoods || state.moodHistory
      };
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(usersDB));
    }
  };

  const handleAuth = async (type: 'login' | 'signup', email: string, password: string, name?: string) => {
    setAuthError(null);
    updateState({ isLoading: true });

    try {
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));

      const usersDB = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB) || '{}');
      const normalizedEmail = email.toLowerCase().trim();
      
      // Generate secure hash
      const pwdHash = await hashPassword(password);

      if (type === 'signup') {
        if (usersDB[normalizedEmail]) {
          setAuthError("An account with this astral signature already exists.");
          updateState({ isLoading: false });
          return;
        }

        const newUserProfile: UserProfile = {
          email: normalizedEmail,
          name: name || 'Seeker',
          quizResults: null,
          hasConsented: false
        };

        const newEntry: UserDBEntry = {
          email: normalizedEmail,
          passwordHash: pwdHash,
          profile: newUserProfile,
          readings: [],
          moods: []
        };

        usersDB[normalizedEmail] = newEntry;
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(usersDB));
        localStorage.setItem(STORAGE_KEY_SESSION, normalizedEmail);

        updateState({ 
          user: newUserProfile, 
          readingsHistory: [],
          moodHistory: [],
          view: 'quiz', // New users go to quiz
          isLoading: false 
        });

      } else {
        // Login
        const userRecord = usersDB[normalizedEmail] as UserDBEntry;
        
        if (!userRecord || userRecord.passwordHash !== pwdHash) {
          setAuthError("Invalid credentials. The stars do not recognize this combination.");
          updateState({ isLoading: false });
          return;
        }

        localStorage.setItem(STORAGE_KEY_SESSION, normalizedEmail);
        updateState({
          user: userRecord.profile,
          readingsHistory: userRecord.readings,
          moodHistory: userRecord.moods,
          view: userRecord.profile.quizResults ? 'dashboard' : 'quiz',
          isLoading: false
        });
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setAuthError("An unexpected error occurred. Please try again.");
      updateState({ isLoading: false });
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    updateState({
      user: null,
      readingsHistory: [],
      moodHistory: [],
      view: 'auth',
      currentReading: null
    });
    setUserInput('');
    // Clear timer on logout
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
  }, []);

  // Inactivity Timer Effect
  useEffect(() => {
    if (!state.user) return;

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        console.log("User inactive for 15 minutes. Logging out.");
        handleLogout();
      }, INACTIVITY_LIMIT_MS);
    };

    // Events to track
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    // Attach listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initial start
    resetTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [state.user, handleLogout]);

  const handleQuizComplete = (results: BigFiveProfile) => {
    if (!state.user) return;
    const updatedUser = { ...state.user, quizResults: results };
    updateState({ user: updatedUser, view: 'dashboard' });
    persistUserData(updatedUser);
  };

  const handleConsent = () => {
    if (!state.user) return;
    const updatedUser = { ...state.user, hasConsented: true };
    updateState({ user: updatedUser });
    persistUserData(updatedUser);
  };

  const handleLogMood = (val: number) => {
    const newMood: MoodEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      value: val
    };
    const newHistory = [...state.moodHistory, newMood];
    updateState({ moodHistory: newHistory });
    persistUserData(undefined, undefined, newHistory);
  };

  const handleAnalyze = useCallback(async () => {
    if (!userInput.trim()) return;
    
    updateState({ isLoading: true, error: null });
    
    try {
      const result = await generateReading(userInput, state.user?.quizResults);
      
      const newHistoryItem: HistoricalReading = {
        ...result,
        id: Date.now().toString(),
        query: userInput
      };

      const updatedHistory = [...state.readingsHistory, newHistoryItem];
      
      updateState({ 
        currentReading: result, 
        readingsHistory: updatedHistory,
        isLoading: false, 
        view: 'reading' 
      });
      
      persistUserData(undefined, updatedHistory);

    } catch (err: any) {
      updateState({ 
        error: "We encountered a blockage in the ether. Please rephrase your inquiry so we may understand better.",
        isLoading: false 
      });
      console.error(err);
    }
  }, [userInput, state.user, state.readingsHistory]);

  const renderContent = () => {
    if (state.isLoading && !state.user) return null; // Initial load

    if (!state.user) {
      return (
        <AuthView 
          onAuth={handleAuth} 
          error={authError} 
          isLoading={state.isLoading} 
        />
      );
    }

    if (!state.user.hasConsented) {
      return <DisclaimerModal onConsent={handleConsent} />;
    }

    if (state.view === 'quiz') {
      return <PersonalityQuiz onComplete={handleQuizComplete} />;
    }

    if (state.view === 'reading' && state.currentReading) {
      return (
        <ReadingView 
          reading={state.currentReading} 
          onReset={() => {
            setUserInput('');
            updateState({ view: 'dashboard', currentReading: null });
          }} 
        />
      );
    }

    if (state.view === 'dashboard') {
      return (
        <Dashboard 
          user={state.user}
          readings={state.readingsHistory}
          moods={state.moodHistory}
          onNewReading={() => updateState({ view: 'reading', currentReading: null })}
          onLogMood={handleLogMood}
          onSelectReading={(r) => updateState({ view: 'reading', currentReading: r })}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button 
          onClick={() => updateState({ view: 'dashboard' })}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-400 hover:text-white transition-colors text-sm mb-4"
        >
          <ArrowLeft size={14} />
          <span>Return to Sanctuary</span>
        </button>

        <div className="glass-panel rounded-2xl p-1">
          <div className="bg-mystic-900/80 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-accent-purple">
              <Sparkles size={48} />
            </div>

            <label className="block text-sm font-medium text-slate-400 mb-4">
              What situation, relationship, or pattern seeks clarity today?
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Share your burden with us here... (e.g., I feel stuck in my career despite success, or I keep attracting the same type of partner.)"
              className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50 transition-all resize-none mb-6"
            />
            
            {state.error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-300 text-sm text-center">
                {state.error}
              </div>
            )}

            {state.isLoading ? (
               <div className="w-full py-4 rounded-lg border border-accent-purple/20 bg-accent-purple/10 flex items-center justify-center gap-3">
                 <Loader2 className="text-accent-purple animate-spin" size={18} />
                 <span className="text-accent-purple text-sm animate-pulse">We are consulting the archetypes...</span>
               </div>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={!userInput.trim()}
                className={`w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-3 transition-all duration-300 ${
                  userInput.trim() 
                    ? 'bg-gradient-to-r from-accent-indigo to-accent-purple hover:shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
                <span>Consult the Collective</span>
              </button>
            )}

            <p className="mt-6 text-center text-xs text-slate-600">
              All entries are processed securely within our sanctuary using probabilistic pattern matching. 
              <br/>This is not supernatural advice.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-mystic-900 text-slate-200 font-sans selection:bg-accent-purple selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[#020617] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] z-0 animate-pulse-slow"></div>
      <div className="fixed top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.05)_0%,rgba(0,0,0,0)_50%)] z-0 pointer-events-none"></div>
      
      <div className="fixed top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent z-10"></div>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <header className="flex flex-col items-center mb-12 space-y-2">
          <div className="w-16 h-16 relative mb-2">
            <div className="absolute inset-0 border border-accent-gold/30 rotate-45 transform scale-75"></div>
            <div className="absolute inset-0 border border-accent-purple/30 rotate-[22.5deg] transform scale-75"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="text-accent-gold fill-accent-gold/20" size={24} />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 text-center tracking-wider">
            Psychic Star
          </h1>
          <p className="text-accent-gold/80 text-xs md:text-sm font-serif italic tracking-wide">
            Seek and we shall guide
          </p>
          <p className="text-slate-500 text-[10px] tracking-[0.3em] uppercase font-serif mt-2">The Digital Oracle</p>
        </header>

        {renderContent()}

        <footer className="mt-20 text-center border-t border-slate-800/50 pt-8 pb-8">
           <div className="flex justify-center items-center gap-4 mb-4">
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Est. 2025</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
           </div>
          <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
            This reading is for educational and entertainment purposes and does not replace medical, legal, or professional care. 
            If you are in danger or experiencing a mental health crisis, contact local emergency services or a qualified professional immediately.
          </p>
          <p className="text-[10px] text-slate-600 font-serif">
            &copy; 2025 DataFog Studios&trade; owned by Hassan S Mohamed. All Rights Reserved. <br/>
            Psychic Star // The Collective is listening.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;

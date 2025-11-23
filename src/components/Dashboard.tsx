import React, { useState } from 'react';
import { HistoricalReading, MoodEntry, UserProfile } from '../types';
import { Plus, History, TrendingUp, BookOpen, LogOut } from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

interface DashboardProps {
  user: UserProfile;
  readings: HistoricalReading[];
  moods: MoodEntry[];
  onNewReading: () => void;
  onLogMood: (val: number) => void;
  onSelectReading: (reading: HistoricalReading) => void;
  onLogout: () => void;
}

const MOOD_ICONS = ['🌑', '🌘', '🌗', '🌖', '🌕'];
const MOOD_LABELS = ['Void', 'Shadow', 'Balanced', 'Radiant', 'Supernova'];

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, readings, moods, onNewReading, onLogMood, onSelectReading, onLogout
}) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodClick = (val: number) => {
    setSelectedMood(val);
    onLogMood(val);
  };

  const today = new Date().setHours(0,0,0,0);
  const hasLoggedToday = moods.some(m => m.timestamp >= today);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white mb-1">
            We see you, {user.name}
          </h2>
          <p className="text-slate-400 text-sm">
            Your energetic signature is {user.quizResults ? 'harmonized with the sanctuary' : 'awaiting calibration'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-3 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 rounded-full transition-colors flex items-center gap-2 hover:bg-slate-800"
          >
            <LogOut size={16} />
            <span className="hidden md:inline text-sm font-medium">Sign Out</span>
          </button>

          <button
            onClick={onNewReading}
            className="px-6 py-3 bg-gradient-to-r from-accent-gold/80 to-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-900/20 hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Seek Guidance</span>
          </button>
        </div>
      </div>

      {/* AD */}
      <AdPlaceholder variant="banner" />

      {/* MOOD + STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* DAILY MOOD */}
        <section className="glass-card p-6 rounded-xl border-t border-white/5">
          <div className="flex items-center gap-2 mb-6 text-accent-indigo">
            <TrendingUp size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Daily Resonance</h3>
          </div>
          
          {hasLoggedToday ? (
            <div className="flex flex-col items-center justify-center h-32 space-y-2">
              <span className="text-4xl animate-pulse">✨</span>
              <p className="text-slate-400 text-sm">Resonance logged for today.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-400 text-center">How is your spirit aligning today?</p>

              <div className="flex justify-between px-2">
                {MOOD_ICONS.map((icon, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMoodClick(idx + 1)}
                    className="flex flex-col items-center gap-2 group transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                      {icon}
                    </span>
                    <span className="text-[10px] text-slate-600 group-hover:text-accent-indigo transition-colors duration-300">
                      {MOOD_LABELS[idx]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* JOURNEY STATS */}
        <section className="glass-card p-6 rounded-xl border-t border-white/5">
          <div className="flex items-center gap-2 mb-6 text-accent-purple">
            <BookOpen size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Journey Stats</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <span className="block text-2xl font-serif text-white">{readings.length}</span>
              <span className="text-xs text-slate-500 uppercase">Consultations</span>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg text-center">
              <span className="block text-2xl font-serif text-white">{moods.length}</span>
              <span className="text-xs text-slate-500 uppercase">Resonance Logs</span>
            </div>

            <div className="col-span-2 bg-slate-900/50 p-4 rounded-lg text-center">
              <span className="text-xs text-slate-500">Dominant Trait</span>
              <div className="text-accent-gold font-serif mt-1">
                {user.quizResults ? 
                  Object.entries(user.quizResults)
                    .filter(([k]) => k !== 'isComplete')
                    .sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
                  : 'Unknown'}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TIMELINE */}
      <section>
        <div className="flex items-center gap-2 mb-6 text-slate-300">
          <History size={20} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Timeline</h3>
        </div>
        
        <div className="space-y-4 relative pl-8 border-l border-slate-800 ml-4">
          
          {readings.length === 0 && (
            <div className="text-slate-500 text-sm italic pl-4">
              No consultations recorded yet. Begin your journey with us.
            </div>
          )}

          {readings.slice().reverse().map((reading) => {
            const title =
              reading.title ||
              reading.energeticOverview?.title ||
              "Guidance Reading";

            return (
              <div key={reading.id} className="relative group">
                <div className="absolute -left-[41px] top-3 w-5 h-5 rounded-full bg-slate-900 border border-accent-purple group-hover:bg-accent-purple transition-colors"></div>
                
                <div
                  onClick={() => onSelectReading(reading)}
                  className="glass-card p-5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-white text-lg">{title}</h4>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(reading.timestamp || 0).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                    {reading.energeticOverview?.translation}
                  </p>

                  <div className="flex gap-2">
                    {reading.dominantArchetypes?.map((a, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

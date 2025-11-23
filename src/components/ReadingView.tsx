import React from 'react';
import { ReadingResponse } from '../types';
import { TraitChart } from './TraitChart';
import { AdPlaceholder } from './AdPlaceholder';
import { Sparkles, Brain, Activity, AlertTriangle, Compass, Map, ArrowLeft } from 'lucide-react';

interface ReadingViewProps {
  reading: ReadingResponse;
  onReset: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ reading, onReset }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Back Button */}
      <button 
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-400 hover:text-white transition-colors text-sm mb-4"
      >
        <ArrowLeft size={14} />
        <span>Return to Sanctuary</span>
      </button>

      {/* Energetic Overview */}
      <section className="glass-card rounded-2xl p-8 border-t border-accent-gold/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-50"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-accent-gold/10 rounded-full text-accent-gold">
            <Sparkles size={24} />
          </div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-xs font-bold uppercase tracking-wide text-accent-gold">Energetic Overview</h2>
            <p className="text-2xl font-serif text-white italic leading-relaxed">
              {reading.energeticOverview?.summary || 'No overview available.'}
            </p>
            <p className="text-slate-400 text-sm border-l-2 border-slate-700 pl-4">
              {reading.energeticOverview?.details || 'Further insights will appear here.'}
            </p>
          </div>
        </div>
      </section>

      {/* Core Traits & Dominant Archetype */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Traits */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 text-accent-indigo">
            <Activity size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Core Psychological Traits</h3>
          </div>
          <TraitChart traits={reading.coreTraits} />
          <div className="mt-4 space-y-2">
            {reading.coreTraits.map((t, i) => (
              <p key={i} className="text-xs text-slate-400">
                <strong className="text-slate-200">{t.trait}:</strong> {t.description}
              </p>
            ))}
          </div>
        </section>

        {/* Dominant Archetypes */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 text-accent-purple">
            <Brain size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Dominant Archetype</h3>
          </div>
          <div className="space-y-6">
            {reading.dominantArchetypes.map((arch, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-white/5">
                <h4 className="text-lg font-serif text-white mb-2">{arch.name}</h4>
                <p className="text-sm text-slate-300 mb-3">{arch.description}</p>
                <div className="flex flex-wrap gap-2">
                  {arch.behavioralIndicators.map((indicator, i) => (
                    <span key={i} className="text-[10px] bg-accent-purple/10 text-accent-purple px-2 py-1 rounded-full uppercase tracking-wide">
                      {indicator}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AdPlaceholder variant="banner" />

      {/* Guidance Protocol & Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Guidance Protocol */}
        <section className="md:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 text-emerald-400">
            <Compass size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Guidance Protocol</h3>
          </div>
          <div className="space-y-6 relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-slate-800"></div>
            
            {reading.guidanceProtocol?.map((step, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-500 font-bold">
                  {idx + 1}
                </div>
                <h4 className="text-white text-sm font-semibold mb-1">{step.title}</h4>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pattern Warning */}
        <section className="glass-card rounded-xl p-6 bg-red-900/5 border-red-900/20">
          <div className="flex items-center gap-2 mb-6 text-red-400">
            <AlertTriangle size={20} />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Pattern Warning</h3>
          </div>
          <ul className="space-y-3">
            {reading.redFlags.length > 0 ? (
              reading.redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                  {flag}
                </li>
              ))
            ) : (
              <li className="text-slate-500 text-sm italic">No warnings detected.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Probabilistic Trajectories */}
      <section className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6 text-blue-400">
          <Map size={20} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Probabilistic Trajectories</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reading.trajectories?.map((traj, i) => (
            <div key={i} className="p-5 rounded-lg bg-gradient-to-br from-emerald-900/10 to-transparent border border-emerald-500/10">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-emerald-300 font-serif">{traj.name}</h4>
                <span className="text-xs font-mono text-emerald-500/70">{traj.probability}%</span>
              </div>
              <p className="text-sm text-slate-400">{traj.description}</p>
            </div>
          ))}
        </div>
      </section>

      <AdPlaceholder variant="banner" />

      {/* Closing Quote */}
      <section className="text-center py-8 px-4">
        <p className="font-serif text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-200 italic">
          {reading.closingQuote || 'Reflect on your journey and align with your spirit.'}
        </p>
      </section>
    </div>
  );
};

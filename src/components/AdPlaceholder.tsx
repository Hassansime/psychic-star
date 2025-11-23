import React from 'react';

interface AdPlaceholderProps {
  variant?: 'banner' | 'box';
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ variant = 'banner' }) => {
  return (
    <div
      className={`relative overflow-hidden group bg-slate-900/30 border border-slate-700/30 rounded-lg flex items-center justify-center`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/20 to-transparent animate-pulse-slow"></div>
      <div className="text-center z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-600 block mb-1">
          Sponsored
        </span>
        <span className="text-sm font-serif text-slate-500">Cosmic Ad Space</span>
      </div>
    </div>
  );
};

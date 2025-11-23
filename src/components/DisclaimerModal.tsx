import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerModalProps {
  onConsent: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onConsent }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="glass-card max-w-md w-full rounded-2xl p-8 shadow-2xl border-t border-white/10 animate-fade-in">
        <div className="flex items-center gap-3 mb-6 text-accent-purple">
          <ShieldAlert size={32} />
          <h2 className="text-2xl font-serif font-semibold text-white">Safety & Consent</h2>
        </div>
        
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed max-h-96 overflow-y-auto pr-1">
          <p>
            <strong className="text-white">Educational Purpose:</strong> We use advanced archetypal pattern recognition to reveal psychological insights. We provide guidance, not prediction or therapy.
          </p>
          <p>
            <strong className="text-white">Not Medical Advice:</strong> Our guidance is not a substitute for professional therapy, psychiatric care, or crisis intervention.
          </p>
          <p>
            <strong className="text-white">Privacy First:</strong> Your entries are processed locally in your browser. We do not collect or sell personal data.
          </p>
          <p>
            <strong className="text-white">Data Security:</strong> Your account data is encrypted and stored securely. You maintain full control of your information.
          </p>
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 text-xs">
            If you are in immediate danger or experiencing a mental health crisis, please contact local emergency services immediately.
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onConsent}
            className="w-full py-3 px-6 bg-gradient-to-r from-accent-indigo to-accent-purple hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-900/20"
          >
            I Understand & Consent
          </button>
        </div>
      </div>
    </div>
  );
};

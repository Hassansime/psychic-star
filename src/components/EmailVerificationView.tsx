import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailVerificationViewProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  error: string | null;
  isLoading: boolean;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({
  email,
  onVerify,
  onResend,
  error,
  isLoading
}) => {
  const [code, setCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    onResend();
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl border-t border-accent-gold/30 shadow-2xl shadow-purple-900/20 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent-gold to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)] mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-white">Verify Email</h2>
          <p className="text-slate-400 text-sm mt-2">Confirmation code sent to</p>
          <p className="text-accent-gold font-mono text-sm mt-1">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-400">Verification Code</label>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full bg-slate-950/50 border border-slate-800 text-white text-2xl tracking-[0.5em] text-center rounded-lg focus:ring-accent-gold focus:border-accent-gold p-4 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full py-3 bg-gradient-to-r from-accent-gold to-amber-600 hover:from-amber-400 hover:to-amber-700 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendCountdown > 0 || isLoading}
            className="w-full py-2 text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50"
          >
            {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  );
};

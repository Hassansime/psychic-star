import React, { useState } from 'react';
import { Eye, Key, Mail, ArrowRight, AlertCircle, EyeOff } from 'lucide-react';

interface AuthViewProps {
  onAuth: (type: 'login' | 'signup', email: string, password: string, name?: string) => void;
  error: string | null;
  isLoading: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuth, error, isLoading }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(isLogin ? 'login' : 'signup', email, password, isLogin ? undefined : name);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setName('');
  };

  const isValid = email.trim() && password.trim() && (isLogin || name.trim());

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl border-t border-accent-purple/30 shadow-2xl shadow-purple-900/20 animate-fade-in">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-accent-indigo to-accent-purple flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-4">
            <Eye className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-serif text-white">Psychic Star</h2>
          <p className="text-slate-400 text-sm tracking-widest uppercase mt-1">Gateway to Insight</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ERROR BOX */}
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* NAME FIELD (ONLY SIGNUP) */}
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 text-sm">@</span>
              </div>
              <input
                type="text"
                placeholder="Your Name"
                required={!isLogin}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 text-white text-sm rounded-lg 
                focus:ring-accent-purple focus:border-accent-purple block pl-10 p-3 transition-colors"
              />
            </div>
          )}

          {/* EMAIL FIELD */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={16} className="text-slate-500" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-white text-sm rounded-lg 
              focus:ring-accent-purple focus:border-accent-purple block pl-10 p-3 transition-colors"
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key size={16} className="text-slate-500" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-white text-sm rounded-lg 
              focus:ring-accent-purple focus:border-accent-purple block pl-10 p-3 pr-10 transition-colors"
            />

            {/* PASSWORD VISIBILITY TOGGLE */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full mt-6 py-3 bg-gradient-to-r from-accent-indigo to-accent-purple 
            hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg 
            transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2
            shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>{isLogin ? 'Enter the Sanctuary' : 'Create Connection'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* MODE TOGGLE (LOGIN <-> SIGNUP) */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? "First time here? Begin Initiation" : "Already initiated? Enter Sanctuary"}
          </button>
        </div>

        <div className="mt-8 text-[10px] text-center text-slate-600">
          Psychic Star v2.0 // The Collective awaits.
        </div>
      </div>
    </div>
  );
};

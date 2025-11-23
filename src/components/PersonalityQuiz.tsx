import React, { useState } from 'react';
import { BigFiveProfile } from '../types';
import { Brain } from 'lucide-react';

interface PersonalityQuizProps {
  onComplete: (results: BigFiveProfile) => void;
}

const QUESTIONS = [
  { id: 1, text: "I see myself as extraverted, enthusiastic.", trait: 'extraversion', reverse: false },
  { id: 2, text: "I see myself as critical, quarrelsome.", trait: 'agreeableness', reverse: true },
  { id: 3, text: "I see myself as dependable, self-disciplined.", trait: 'conscientiousness', reverse: false },
  { id: 4, text: "I see myself as anxious, easily upset.", trait: 'neuroticism', reverse: false },
  { id: 5, text: "I see myself as open to new experiences, complex.", trait: 'openness', reverse: false },
  { id: 6, text: "I see myself as reserved, quiet.", trait: 'extraversion', reverse: true },
  { id: 7, text: "I see myself as sympathetic, warm.", trait: 'agreeableness', reverse: false },
  { id: 8, text: "I see myself as disorganized, careless.", trait: 'conscientiousness', reverse: true },
  { id: 9, text: "I see myself as calm, emotionally stable.", trait: 'neuroticism', reverse: true },
  { id: 10, text: "I see myself as conventional, uncreative.", trait: 'openness', reverse: true },
];

export const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: score };
    setAnswers(newAnswers);
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers: Record<number, number>) => {
    const scores = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    QUESTIONS.forEach(q => {
      let val = finalAnswers[q.id];
      if (q.reverse) val = 8 - val;
      scores[q.trait as keyof typeof scores] += val;
    });

    const normalize = (val: number) => Math.round(((val - 2) / 12) * 100);

    const profile: BigFiveProfile = {
      extraversion: normalize(scores.extraversion),
      agreeableness: normalize(scores.agreeableness),
      conscientiousness: normalize(scores.conscientiousness),
      neuroticism: normalize(scores.neuroticism),
      openness: normalize(scores.openness),
      isComplete: true
    };

    onComplete(profile);
  };

  const currentQ = QUESTIONS[currentStep];
  const progress = ((currentStep) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in p-6">
      <div className="glass-panel rounded-2xl p-8 border-t border-accent-gold/20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-accent-gold">
            <Brain size={24} />
            <h2 className="text-2xl font-serif">Psychometric Calibration</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {currentStep + 1} / {QUESTIONS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full mb-12 overflow-hidden">
          <div
            className="bg-accent-gold h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question text */}
        <h3 className="text-xl text-white font-medium text-center mb-12 leading-relaxed">
          {currentQ.text}
        </h3>

        {/* Scale buttons */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          <div className="col-span-7 flex justify-between text-xs text-slate-500 uppercase tracking-wider mb-2">
            <span>Disagree Strongly</span>
            <span>Neutral</span>
            <span>Agree Strongly</span>
          </div>

          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <button
              key={num}
              onClick={() => handleAnswer(num)}
              className="
                aspect-square rounded-full border border-slate-700 
                hover:border-accent-gold/50 hover:bg-accent-gold/20 
                transition-all flex items-center justify-center 
                text-slate-300 hover:text-white focus:ring-2 
                focus:ring-accent-gold
              "
            >
              {num}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          This data allows us to deepen our understanding of your spirit.
        </p>
      </div>
    </div>
  );
};

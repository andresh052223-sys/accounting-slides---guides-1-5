import React from 'react';
import { Award, RotateCcw, Home, Sparkles, BookOpen } from 'lucide-react';
import { ThemeMode } from '../hooks/usePresentation';

interface CompletionScreenProps {
  onRestartPresentation: () => void;
  onOpenLevelSelector: () => void;
  theme: ThemeMode;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onRestartPresentation,
  onOpenLevelSelector,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center p-6 sm:p-12 transition-colors select-none ${
        isDark ? 'bg-[#060b18] text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="w-full max-w-3xl flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Certificate / Trophy Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
          <div className={`w-full h-full rounded-full flex items-center justify-center ${
            isDark ? 'bg-slate-950' : 'bg-white'
          }`}>
            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4" />
            <span>SENA · Contabilidad y Finanzas</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase">
            Congratulations!
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
            You completed all 20 levels.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto pt-2">
            200 slides covered — from basic accounting nouns and verbs to sentence structures, WH-questions, demonstratives, and quantifiers.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg py-2">
          <div className={`p-4 rounded-xl border text-center ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">20</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Levels</div>
          </div>
          <div className={`p-4 rounded-xl border text-center ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-2xl sm:text-3xl font-black text-teal-400">200</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Slides</div>
          </div>
          <div className={`p-4 rounded-xl border text-center ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Completed</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onRestartPresentation}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-base sm:text-lg flex items-center gap-2.5 shadow-lg shadow-cyan-500/25 transition-all active:scale-98 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Restart Presentation (Slide 1)</span>
          </button>

          <button
            onClick={onOpenLevelSelector}
            className={`px-5 py-3.5 rounded-xl border font-semibold text-base flex items-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
            }`}
          >
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Jump to Any Level</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 uppercase tracking-widest">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">HOME</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">SPACE</kbd> to return to the beginning
        </p>
      </div>
    </div>
  );
};

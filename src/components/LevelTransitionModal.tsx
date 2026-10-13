import React from 'react';
import { ArrowRight, RotateCcw, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { LEVELS_METADATA } from '../data/slidesData';
import { ThemeMode } from '../hooks/usePresentation';

interface LevelTransitionModalProps {
  completedLevelNumber: number;
  onContinue: () => void;
  onRestartCompletedLevel: () => void;
  onBackToCompletedLevel: () => void;
  theme: ThemeMode;
}

export const LevelTransitionModal: React.FC<LevelTransitionModalProps> = ({
  completedLevelNumber,
  onContinue,
  onRestartCompletedLevel,
  onBackToCompletedLevel,
  theme,
}) => {
  const isDark = theme === 'dark';

  const completedMeta = LEVELS_METADATA.find(
    (l) => l.level === completedLevelNumber
  ) || LEVELS_METADATA[0];

  const nextLevelNumber = completedLevelNumber + 1;
  const nextMeta = LEVELS_METADATA.find((l) => l.level === nextLevelNumber);

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center p-6 sm:p-12 transition-colors select-none ${
        isDark ? 'bg-[#050914] text-white' : 'bg-slate-950 text-white'
      }`}
    >
      <div className="w-full max-w-5xl flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Subtle glowing pill */}
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-sm sm:text-base font-bold tracking-widest uppercase shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Level {completedLevelNumber} Finished · 10/10 Questions</span>
        </div>

        {/* ======================================================== */}
        {/* VERY LARGE NOTICE: "LEVEL COMPLETED"                     */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-[0_8px_32px_rgba(16,185,129,0.45)]">
            LEVEL COMPLETED
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-slate-200 tracking-wide">
            {completedMeta.title}
          </p>
        </div>

        {/* Up Next Card */}
        {nextMeta && (
          <div className="w-full max-w-2xl p-6 sm:p-7 rounded-2xl border border-cyan-500/40 bg-slate-900/80 backdrop-blur-md shadow-2xl text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Next Up · Level {nextMeta.level} of 20</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Slides {(nextMeta.level - 1) * 10 + 1}–{nextMeta.level * 10}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {nextMeta.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              {nextMeta.description}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onContinue}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-lg sm:text-xl flex items-center gap-3 shadow-xl shadow-cyan-500/30 transition-all active:scale-98 cursor-pointer"
            >
              <span>CONTINUE TO LEVEL {nextLevelNumber}</span>
              <ArrowRight className="w-6 h-6" />
            </button>

            <button
              onClick={onRestartCompletedLevel}
              className="px-5 py-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Restart Level {completedLevelNumber} (P)</span>
            </button>

            <button
              onClick={onBackToCompletedLevel}
              className="px-5 py-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Back to Slide 10 (←)</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
            PRESS <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">SPACE</kbd> OR <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">→</kbd> TO CONTINUE · <kbd className="px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">P</kbd> TO RESTART
          </p>
        </div>
      </div>
    </div>
  );
};

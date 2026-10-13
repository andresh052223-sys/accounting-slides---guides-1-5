import React from 'react';
import {
  Play,
  Keyboard,
  Layers,
  CheckCircle2,
  Volume2,
  Sparkles,
  Maximize2,
  ShieldCheck,
} from 'lucide-react';
import { LEVELS_METADATA } from '../data/slidesData';
import { ThemeMode } from '../hooks/usePresentation';

interface StartScreenProps {
  onStart: () => void;
  onSelectLevel: (level: number) => void;
  onOpenShortcuts: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onSelectLevel,
  onOpenShortcuts,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between p-6 sm:p-10 transition-colors ${
        isDark ? 'bg-[#060b18] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 border-b border-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-[#060b18] rounded-[10px] flex items-center justify-center font-black text-cyan-400 text-xs">
              SENA
            </div>
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
              Contabilidad y Finanzas
            </div>
            <div className="text-xs text-slate-400">
              Interactive English Presentation
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>200 Slides Validated</span>
          </div>
          <button
            onClick={onOpenShortcuts}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
        </div>
      </header>

      {/* Main Hero & CTA */}
      <main className="w-full max-w-4xl mx-auto text-center py-10 sm:py-16 space-y-8 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wider uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Accounting English · 20 Levels · 200 Slides</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none uppercase">
            Interactive Classroom Presentation
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Designed for teachers projecting in the classroom. Centered Spanish prompts, instant English reveal with <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-sm">SPACE</kbd>, and 20 progressive levels.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/25 transition-all transform active:scale-98 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>START PRESENTATION</span>
          </button>

          <button
            onClick={onOpenShortcuts}
            className={`w-full sm:w-auto px-6 py-4 rounded-2xl border font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 hover:bg-slate-800 text-slate-200'
                : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <span>Key Controls</span>
          </button>
        </div>

        {/* Quick Keyboard Hotkeys Strip */}
        <div className="w-full max-w-2xl p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 text-xs text-slate-300 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 font-bold">SPACE</kbd> Reveal / Hide</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 font-bold">→</kbd> Next Slide</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 font-bold">←</kbd> Prev Slide</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 font-bold">P</kbd> Restart Level</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 font-bold">F</kbd> Fullscreen</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300 font-bold">S</kbd> Speak English</span>
        </div>
      </main>

      {/* Levels Matrix: Jump directly to any of the 20 levels */}
      <section className="w-full max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Jump Directly to Any Level (1–20)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">10 slides per level</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {LEVELS_METADATA.map((meta) => {
            const startSlide = (meta.level - 1) * 10 + 1;
            return (
              <button
                key={meta.level}
                onClick={() => onSelectLevel(meta.level)}
                className={`p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80'
                    : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase">
                    Level {meta.level}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    #{startSlide}
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-1">
                  {meta.title}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto py-4 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <span>SENA Colombia · Programa Contabilización de Operaciones Comerciales y Financieras</span>
        <span>A1–A2 CEFR Level · 200 Slides Dataset Validated</span>
      </footer>
    </div>
  );
};

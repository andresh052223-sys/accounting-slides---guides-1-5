import React from 'react';
import { X, Layers, CheckCircle2 } from 'lucide-react';
import { LEVELS_METADATA } from '../data/slidesData';
import { ThemeMode } from '../hooks/usePresentation';

interface LevelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  onSelectLevel: (level: number) => void;
  theme: ThemeMode;
}

export const LevelDrawer: React.FC<LevelDrawerProps> = ({
  isOpen,
  onClose,
  currentLevel,
  onSelectLevel,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-transform ${
          isDark
            ? 'bg-[#090f20] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold">Select Level</h2>
              <p className="text-xs text-slate-400">20 Levels · 10 Slides each</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Levels List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {LEVELS_METADATA.map((meta) => {
            const isCurrent = meta.level === currentLevel;
            const startSlideNumber = (meta.level - 1) * 10 + 1;
            const endSlideNumber = meta.level * 10;

            return (
              <button
                key={meta.level}
                onClick={() => {
                  onSelectLevel(meta.level);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isCurrent
                    ? isDark
                      ? 'bg-cyan-950/40 border-cyan-500/80 ring-1 ring-cyan-500/50 shadow-md shadow-cyan-950/50'
                      : 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 shadow-sm'
                    : isDark
                    ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      Level {meta.level}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">
                      Slides {startSlideNumber}–{endSlideNumber}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1">
                    {meta.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {meta.description}
                  </p>
                </div>

                {isCurrent && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/40 text-center text-xs text-slate-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-cyan-300">L</kbd> anytime to open this menu
        </div>
      </div>
    </div>
  );
};

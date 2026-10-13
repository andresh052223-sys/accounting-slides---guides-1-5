import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { ThemeMode } from '../hooks/usePresentation';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const shortcuts = [
    { key: 'SPACE', desc: 'Reveal or hide English translation' },
    { key: '→ / RIGHT', desc: 'Next slide (or continue from level transition)' },
    { key: '← / LEFT', desc: 'Previous slide (or back from level transition)' },
    { key: 'P', desc: 'Restart current level from its first slide' },
    { key: 'HOME', desc: 'Jump to Slide 1 (Level 1)' },
    { key: 'END', desc: 'Jump to Slide 200 (Level 20)' },
    { key: 'F', desc: 'Toggle full-screen projection mode' },
    { key: 'S', desc: 'Listen to English pronunciation (audio speech)' },
    { key: 'N', desc: 'Generate different numbers (in Level 4)' },
    { key: 'L', desc: 'Open level selector menu' },
    { key: 'ESC', desc: 'Exit fullscreen or close open menus' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0b1329] border-slate-700/60 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold tracking-tight">Keyboard Controls Reference</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 divide-y divide-slate-800/40">
          {shortcuts.map((item) => (
            <div key={item.key} className="py-2.5 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-300">{item.desc}</span>
              <kbd
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md border tracking-wider ${
                  isDark
                    ? 'bg-slate-800/90 text-cyan-300 border-slate-600/60'
                    : 'bg-slate-100 text-teal-800 border-slate-300'
                }`}
              >
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/30 flex justify-between items-center text-xs text-slate-400">
          <span>Optimized for classroom clickers & keyboards</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

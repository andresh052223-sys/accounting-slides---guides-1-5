import React from 'react';
import {
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  Layers,
  HelpCircle,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Check,
  Shuffle,
} from 'lucide-react';
import { Slide, LevelMetadata } from '../data/slidesData';
import { ThemeMode } from '../hooks/usePresentation';

interface SlideViewProps {
  slide: Slide;
  levelMeta: LevelMetadata;
  currentSlideIndex: number;
  totalSlides: number;
  isRevealed: boolean;
  theme: ThemeMode;
  isFullscreen: boolean;
  onToggleReveal: () => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onRestartLevel: () => void;
  onToggleFullscreen: () => void;
  onToggleTheme: () => void;
  onOpenLevelDrawer: () => void;
  onOpenShortcuts: () => void;
  onSpeakEnglish: () => void;
  onJumpToQuestion?: (questionNumber: number) => void;
  onRandomizeNumbers?: () => void;
}

export const SlideView: React.FC<SlideViewProps> = ({
  slide,
  levelMeta,
  currentSlideIndex,
  totalSlides,
  isRevealed,
  theme,
  isFullscreen,
  onToggleReveal,
  onNextSlide,
  onPrevSlide,
  onRestartLevel,
  onToggleFullscreen,
  onToggleTheme,
  onOpenLevelDrawer,
  onOpenShortcuts,
  onSpeakEnglish,
  onJumpToQuestion,
  onRandomizeNumbers,
}) => {
  const isDark = theme === 'dark';

  // Dynamic font scaling according to length of prompt and answer (Massive Projector Scale)
  const getPromptFontSize = (text: string) => {
    const len = text.length;
    if (len <= 7) return 'text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11.5rem]';
    if (len <= 15) return 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem]';
    if (len <= 25) return 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.5rem]';
    return 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem]';
  };

  const getAnswerFontSize = (text: string) => {
    const len = text.length;
    if (len <= 7) return 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]';
    if (len <= 15) return 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8.5rem]';
    if (len <= 25) return 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem]';
    return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[6rem]';
  };

  const questionsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div
      className={`relative w-full h-screen overflow-hidden flex flex-col justify-between select-none transition-colors duration-200 ${
        isDark ? 'bg-[#070d1e] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* ======================================================== */}
      {/* TOP BAR: Clean, uncluttered metadata & discreet controls */}
      {/* ======================================================== */}
      <header className="w-full px-6 sm:px-10 py-4 sm:py-5 flex items-center justify-between z-20 shrink-0">
        {/* Top-Left: LEVEL X — TITLE (Very Large & High Visibility) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLevelDrawer}
            className={`text-left group cursor-pointer transition-all flex items-center gap-3 p-1.5 rounded-2xl ${
              isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'
            }`}
            title="Click to switch levels (or press L)"
          >
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-mono tracking-widest text-cyan-400 uppercase">
                LEVEL {slide.level}
              </span>
              <span className="text-slate-500 font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl">—</span>
              <span
                className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase transition-colors ${
                  isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-950 group-hover:text-teal-700'
                }`}
              >
                {slide.levelTitle}
              </span>
            </div>
            <Layers className="w-6 h-6 md:w-7 md:h-7 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
          </button>
        </div>

        {/* Top-Right: Discreet Presentation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Level 4 Specific: Generar nuevos números */}
          {slide.level === 4 && onRandomizeNumbers && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRandomizeNumbers();
              }}
              className={`px-3 py-1.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
              title="Generar nuevos números diferentes en cada diapositiva (N)"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Nuevos números (N)</span>
            </button>
          )}

          {/* Audio Speech Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSpeakEnglish();
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-400 hover:bg-slate-50 shadow-xs'
            }`}
            title="Listen to English pronunciation (S)"
            aria-label="Speak English"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleTheme();
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-amber-300 hover:border-slate-700 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-amber-600 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
            }`}
            title={`Switch to ${isDark ? 'Crisp White' : 'Dark Navy'} mode`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Keyboard Shortcuts Help */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShortcuts();
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
            }`}
            title="Keyboard shortcuts (? or H)"
            aria-label="Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFullscreen();
            }}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-400 hover:bg-slate-50 shadow-xs'
            }`}
            title="Toggle fullscreen (F)"
            aria-label="Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MIDDLE SECTION: MAIN CANVAS + 10 QUESTION SQUARES ON SIDE */}
      {/* ======================================================== */}
      <div className="flex-1 w-full flex flex-col lg:flex-row items-center justify-between overflow-hidden px-4 sm:px-8 lg:px-12 gap-4 my-auto">
        
        {/* MAIN PRESENTATION CANVAS: Centered horizontally & vertically */}
        <main
          onClick={onToggleReveal}
          className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center cursor-pointer relative z-10 transition-transform active:scale-[0.998] py-4"
          title="Click anywhere to reveal or hide English (or press SPACE)"
        >
          <div className="w-full flex flex-col items-center justify-center space-y-6 sm:space-y-10 my-auto">
            {/* Main Spanish Text (or prompt) */}
            <div className="w-full space-y-2">
              <h1
                className={`font-black tracking-tight leading-none transition-all duration-200 uppercase ${getPromptFontSize(
                  slide.prompt
                )} ${
                  isDark
                    ? 'text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                    : 'text-slate-950'
                }`}
              >
                {slide.prompt}
              </h1>
            </div>

            {/* English Translation (Revealed / Hidden) */}
            <div className="w-full min-h-[100px] sm:min-h-[140px] md:min-h-[170px] flex flex-col items-center justify-center">
              {isRevealed ? (
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-200 flex flex-col items-center space-y-4">
                  <h2
                    className={`font-black tracking-tight leading-tight uppercase transition-colors ${getAnswerFontSize(
                      slide.answer
                    )} ${
                      isDark
                        ? 'text-cyan-300 drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]'
                        : 'text-teal-700'
                    }`}
                  >
                    {slide.answer}
                  </h2>

                  {/* Helpful Grammar / Usage Subtitle when available */}
                  {slide.note && (
                    <p
                      className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-widest uppercase ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {slide.note}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500/60 dark:text-slate-600/60 py-4">
                  <span className="w-3 h-3 rounded-full bg-cyan-400/50 animate-pulse" />
                  <span className="text-sm sm:text-base font-mono font-bold tracking-widest uppercase">
                    Press Space or click to reveal
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ======================================================== */}
        {/* SIDEBAR: 10 QUESTION BOXES (MUCHO MÁS GRANDES)           */}
        {/* Coloreados a medida que se avanza pregunta a pregunta    */}
        {/* ======================================================== */}
        <aside
          className={`shrink-0 z-20 flex flex-col items-center p-3 sm:p-5 rounded-3xl border backdrop-blur-md transition-all shadow-2xl ${
            isDark
              ? 'bg-[#091124]/90 border-slate-800/90 shadow-black/40'
              : 'bg-white/95 border-slate-200 shadow-slate-300/50'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header of Question Boxes */}
          <div className="text-xs sm:text-sm font-mono font-black tracking-widest uppercase mb-3 sm:mb-4 text-center text-cyan-400">
            PREGUNTAS
          </div>

          {/* Grid of 10 large squares: vertical column on desktop, responsive layout */}
          <div className="grid grid-cols-5 lg:grid-cols-1 gap-2 sm:gap-2.5">
            {questionsList.map((qNum) => {
              const isCurrent = qNum === slide.slideInLevel;
              const isCompleted = qNum < slide.slideInLevel;

              let boxStyles = '';
              let badgeIcon = null;

              if (isCurrent) {
                // Pregunta actual en curso: Activo, coloreado intensamente con brillo y escala
                boxStyles = isDark
                  ? 'bg-cyan-400 text-slate-950 font-black ring-4 ring-cyan-400/60 shadow-xl shadow-cyan-400/40 scale-108 z-10'
                  : 'bg-cyan-500 text-slate-950 font-black ring-4 ring-cyan-500/50 shadow-xl shadow-cyan-500/30 scale-108 z-10';
              } else if (isCompleted) {
                // Pregunta anterior ya completada: Coloreado en verde/esmeralda sólido con marca
                boxStyles = isDark
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black shadow-md border border-emerald-300/30'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black shadow-md';
                badgeIcon = (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute top-1 right-1 opacity-85 stroke-[3]" />
                );
              } else {
                // Pregunta futura aún pendiente: Sin colorear, sutil contorno
                boxStyles = isDark
                  ? 'bg-slate-900/60 border-2 border-slate-700/80 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  : 'bg-slate-100 border-2 border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-800';
              }

              return (
                <button
                  key={qNum}
                  onClick={() => onJumpToQuestion && onJumpToQuestion(qNum)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 lg:w-16 lg:h-16 xl:w-18 xl:h-18 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl transition-all duration-200 cursor-pointer ${boxStyles}`}
                  title={`Ir a pregunta ${qNum} de 10`}
                >
                  <span>{qNum}</span>
                  {badgeIcon}
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center hidden lg:block">
            {slide.slideInLevel} / 10
          </div>
        </aside>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM BAR: Unboxed Progress & Navigation Controls       */}
      {/* ======================================================== */}
      <footer className="w-full px-6 sm:px-10 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 shrink-0">
        {/* Left: Discreet Slide & Level Navigation Buttons */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevSlide();
            }}
            disabled={currentSlideIndex === 0}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-medium text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Previous slide (←)"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleReveal();
            }}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              isRevealed
                ? isDark
                  ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60'
                  : 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100'
                : isDark
                ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
            title="Reveal or hide answer (SPACE)"
          >
            {isRevealed ? (
              <>
                <EyeOff className="w-4 h-4 text-cyan-400" />
                <span>Hide (Space)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Reveal (Space)</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNextSlide();
            }}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 font-medium text-xs sm:text-sm transition-all cursor-pointer ${
              isDark
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50'
                : 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100'
            }`}
            title="Next slide (→)"
            aria-label="Next slide"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestartLevel();
            }}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Restart current level (P)"
            aria-label="Restart level"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center/Right: Clean Unboxed Progress Metadata */}
        <div className="flex flex-col sm:items-end items-center gap-0.5 order-1 sm:order-2">
          <div className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-slate-300 dark:text-slate-300">
            <span>SLIDE {slide.slideInLevel} / 10</span>
            <span className="mx-2 text-slate-500">·</span>
            <span>LEVEL {slide.level} / 20</span>
          </div>
          <div className="text-[11px] font-mono tracking-wider text-slate-500 uppercase">
            PRESS SPACE TO REVEAL · NEXT SLIDE TO CONTINUE
          </div>
        </div>
      </footer>
    </div>
  );
};

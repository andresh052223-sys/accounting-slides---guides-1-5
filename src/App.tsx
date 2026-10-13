/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePresentation } from './hooks/usePresentation';
import { StartScreen } from './components/StartScreen';
import { SlideView } from './components/SlideView';
import { LevelTransitionModal } from './components/LevelTransitionModal';
import { CompletionScreen } from './components/CompletionScreen';
import { ShortcutsModal } from './components/ShortcutsModal';
import { LevelDrawer } from './components/LevelDrawer';
import { SLIDES_DATA } from './data/slidesData';

export default function App() {
  const {
    currentSlideIndex,
    currentSlide,
    currentLevelMeta,
    isRevealed,
    isTransitionActive,
    completedLevelNumber,
    isCompleted,
    inPresentation,
    theme,
    isFullscreen,
    isLevelDrawerOpen,
    isShortcutsOpen,
    // Actions
    setInPresentation,
    toggleReveal,
    nextSlide,
    prevSlide,
    restartCurrentLevel,
    jumpToLevel,
    jumpToSlideInCurrentLevel,
    randomizeLevel4Numbers,
    goHome,
    toggleFullscreen,
    toggleTheme,
    setIsLevelDrawerOpen,
    setIsShortcutsOpen,
    speakEnglish,
  } = usePresentation();

  return (
    <div className={`min-h-screen w-full font-sans antialiased ${theme === 'dark' ? 'bg-[#070d1e]' : 'bg-[#f8fafc]'}`}>
      {!inPresentation ? (
        <StartScreen
          onStart={() => {
            goHome();
            setInPresentation(true);
          }}
          onSelectLevel={(lvl) => {
            jumpToLevel(lvl);
          }}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : isCompleted ? (
        <CompletionScreen
          onRestartPresentation={() => {
            goHome();
          }}
          onOpenLevelSelector={() => setIsLevelDrawerOpen(true)}
          theme={theme}
        />
      ) : isTransitionActive ? (
        <LevelTransitionModal
          completedLevelNumber={completedLevelNumber}
          onContinue={nextSlide}
          onRestartCompletedLevel={restartCurrentLevel}
          onBackToCompletedLevel={prevSlide}
          theme={theme}
        />
      ) : (
        <SlideView
          slide={currentSlide}
          levelMeta={currentLevelMeta}
          currentSlideIndex={currentSlideIndex}
          totalSlides={SLIDES_DATA.length}
          isRevealed={isRevealed}
          theme={theme}
          isFullscreen={isFullscreen}
          onToggleReveal={toggleReveal}
          onNextSlide={nextSlide}
          onPrevSlide={prevSlide}
          onRestartLevel={restartCurrentLevel}
          onToggleFullscreen={toggleFullscreen}
          onToggleTheme={toggleTheme}
          onOpenLevelDrawer={() => setIsLevelDrawerOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onSpeakEnglish={speakEnglish}
          onJumpToQuestion={jumpToSlideInCurrentLevel}
          onRandomizeNumbers={randomizeLevel4Numbers}
        />
      )}

      {/* Global Slide-Over Level Drawer */}
      <LevelDrawer
        isOpen={isLevelDrawerOpen}
        onClose={() => setIsLevelDrawerOpen(false)}
        currentLevel={currentSlide.level}
        onSelectLevel={(lvl) => {
          jumpToLevel(lvl);
        }}
        theme={theme}
      />

      {/* Global Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={theme}
      />
    </div>
  );
}

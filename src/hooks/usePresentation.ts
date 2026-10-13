import { useState, useEffect, useCallback, useMemo } from 'react';
import { SLIDES_DATA, LEVELS_METADATA, Slide, LevelMetadata } from '../data/slidesData';
import { generateDynamicLevel4Slides } from '../data/numberGenerator';

export type ThemeMode = 'dark' | 'light';

export interface PresentationState {
  currentSlideIndex: number; // 0 to 199
  currentSlide: Slide;
  currentLevelMeta: LevelMetadata;
  isRevealed: boolean;
  isTransitionActive: boolean;
  completedLevelNumber: number; // Which level was just completed when in transition
  isCompleted: boolean; // Reached end of Level 20
  inPresentation: boolean; // False on start screen, True in presentation
  theme: ThemeMode;
  isFullscreen: boolean;
  isLevelDrawerOpen: boolean;
  isShortcutsOpen: boolean;
  autoSpeakOnReveal: boolean;
}

export function usePresentation() {
  const [slides, setSlides] = useState<Slide[]>(SLIDES_DATA);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isTransitionActive, setIsTransitionActive] = useState<boolean>(false);
  const [completedLevelNumber, setCompletedLevelNumber] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [inPresentation, setInPresentation] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLevelDrawerOpen, setIsLevelDrawerOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [autoSpeakOnReveal, setAutoSpeakOnReveal] = useState<boolean>(true);
  const [level4TimesVisited, setLevel4TimesVisited] = useState<number>(0);

  const currentSlide = useMemo(() => {
    return slides[currentSlideIndex] || slides[0];
  }, [slides, currentSlideIndex]);

  const currentLevelMeta = useMemo(() => {
    return (
      LEVELS_METADATA.find((l) => l.level === currentSlide.level) ||
      LEVELS_METADATA[0]
    );
  }, [currentSlide.level]);

  // Generate a brand new set of different numbers for Level 4
  const randomizeLevel4Numbers = useCallback(() => {
    const newLevel4 = generateDynamicLevel4Slides();
    setSlides((prev) => {
      const next = [...prev];
      for (let i = 0; i < 10; i++) {
        next[30 + i] = newLevel4[i];
      }
      return next;
    });
    setLevel4TimesVisited((prev) => prev + 1);
  }, []);

  // Audio speech synthesis helper
  const speakEnglish = useCallback((textToSpeak?: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = textToSpeak || (currentSlide.answerLang === 'en' ? currentSlide.answer : currentSlide.prompt);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.88; // slightly slower for clear classroom diction
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentSlide]);

  // Toggle English reveal
  const toggleReveal = useCallback(() => {
    setIsRevealed((prev) => {
      const next = !prev;
      if (next && autoSpeakOnReveal) {
        // speak on reveal
        speakEnglish();
      }
      return next;
    });
  }, [autoSpeakOnReveal, speakEnglish]);

  // Next slide handler
  const nextSlide = useCallback(() => {
    // If currently on a transition screen
    if (isTransitionActive) {
      setIsTransitionActive(false);
      // Advance to first slide of next level
      const nextLevelIndex = completedLevelNumber * 10;
      if (nextLevelIndex < SLIDES_DATA.length) {
        // If entering Level 4 and it was already visited before, regenerate fresh numbers
        if (completedLevelNumber === 3 && level4TimesVisited > 0) {
          randomizeLevel4Numbers();
        }
        setCurrentSlideIndex(nextLevelIndex);
        setIsRevealed(false);
      } else {
        setIsCompleted(true);
      }
      return;
    }

    // If currently on completion screen
    if (isCompleted) {
      return;
    }

    // Check if current slide is the last slide of current level (e.g. index 9, 19, 29, ..., 199)
    const isLastSlideOfLevel = (currentSlideIndex + 1) % 10 === 0;

    if (isLastSlideOfLevel) {
      const levelNumber = Math.floor(currentSlideIndex / 10) + 1;
      if (levelNumber === 4) {
        // Mark that Level 4 has now been completed at least once
        setLevel4TimesVisited((prev) => Math.max(1, prev));
      }
      if (levelNumber === 20) {
        // Completed all 20 levels!
        setIsCompleted(true);
      } else {
        // Trigger transition screen
        setCompletedLevelNumber(levelNumber);
        setIsTransitionActive(true);
      }
      return;
    }

    // Standard advance
    if (currentSlideIndex < SLIDES_DATA.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setIsRevealed(false);
    }
  }, [
    isTransitionActive,
    isCompleted,
    currentSlideIndex,
    completedLevelNumber,
    level4TimesVisited,
    randomizeLevel4Numbers,
  ]);

  // Previous slide handler
  const prevSlide = useCallback(() => {
    // If in transition modal, pressing left goes back to slide 10 of that level
    if (isTransitionActive) {
      setIsTransitionActive(false);
      const lastSlideOfCompleted = completedLevelNumber * 10 - 1;
      setCurrentSlideIndex(lastSlideOfCompleted);
      setIsRevealed(true);
      return;
    }

    // If on completed screen
    if (isCompleted) {
      setIsCompleted(false);
      setCurrentSlideIndex(SLIDES_DATA.length - 1);
      setIsRevealed(true);
      return;
    }

    // Standard previous slide
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setIsRevealed(false);
    }
  }, [isTransitionActive, isCompleted, completedLevelNumber, currentSlideIndex]);

  // Restart current level (P key)
  // firstSlide = (currentLevel - 1) * 10 (0-indexed)
  const restartCurrentLevel = useCallback(() => {
    let targetLevel = currentSlide.level;
    if (isTransitionActive) {
      targetLevel = completedLevelNumber;
      setIsTransitionActive(false);
    } else if (isCompleted) {
      targetLevel = 20;
      setIsCompleted(false);
    }

    // If repeating Level 4, generate a fresh set of numbers!
    if (targetLevel === 4) {
      randomizeLevel4Numbers();
    }

    const firstSlideIndex = (targetLevel - 1) * 10;
    setCurrentSlideIndex(firstSlideIndex);
    setIsRevealed(false);
  }, [
    currentSlide.level,
    isTransitionActive,
    completedLevelNumber,
    isCompleted,
    randomizeLevel4Numbers,
  ]);

  // Jump to specific slide (0-based)
  const jumpToSlide = useCallback((index: number) => {
    if (index >= 0 && index < SLIDES_DATA.length) {
      setCurrentSlideIndex(index);
      setIsRevealed(false);
      setIsTransitionActive(false);
      setIsCompleted(false);
      setInPresentation(true);
      setIsLevelDrawerOpen(false);
    }
  }, []);

  // Jump to specific level (1 to 20)
  const jumpToLevel = useCallback((levelNum: number) => {
    if (levelNum >= 1 && levelNum <= 20) {
      if (levelNum === 4 && level4TimesVisited > 0) {
        randomizeLevel4Numbers();
      }
      const index = (levelNum - 1) * 10;
      jumpToSlide(index);
    }
  }, [jumpToSlide, level4TimesVisited, randomizeLevel4Numbers]);

  // Jump to slide within current level (1 to 10)
  const jumpToSlideInCurrentLevel = useCallback((slideNum: number) => {
    if (slideNum >= 1 && slideNum <= 10) {
      const targetIndex = (currentSlide.level - 1) * 10 + (slideNum - 1);
      jumpToSlide(targetIndex);
    }
  }, [currentSlide.level, jumpToSlide]);

  // Go to Beginning (Home key)
  const goHome = useCallback(() => {
    setCurrentSlideIndex(0);
    setIsRevealed(false);
    setIsTransitionActive(false);
    setIsCompleted(false);
  }, []);

  // Go to End (End key)
  const goEnd = useCallback(() => {
    setCurrentSlideIndex(SLIDES_DATA.length - 1);
    setIsRevealed(false);
    setIsTransitionActive(false);
    setIsCompleted(false);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts when typing inside an editable input
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // If presentation has not started yet, allow SPACE/ENTER to start
      if (!inPresentation) {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          setInPresentation(true);
        }
        return;
      }

      // If drawer or shortcuts modal is open, ESC closes them
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isLevelDrawerOpen) {
          setIsLevelDrawerOpen(false);
          return;
        }
      }

      switch (e.code) {
        case 'Space': {
          e.preventDefault(); // Prevent browser scrolling
          if (isTransitionActive) {
            nextSlide();
          } else if (isCompleted) {
            // Restart presentation
            goHome();
          } else {
            toggleReveal();
          }
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          nextSlide();
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          prevSlide();
          break;
        }
        case 'KeyP': {
          e.preventDefault();
          restartCurrentLevel();
          break;
        }
        case 'Home': {
          e.preventDefault();
          goHome();
          break;
        }
        case 'End': {
          e.preventDefault();
          goEnd();
          break;
        }
        case 'KeyF': {
          e.preventDefault();
          toggleFullscreen();
          break;
        }
        case 'KeyL': {
          e.preventDefault();
          setIsLevelDrawerOpen((prev) => !prev);
          break;
        }
        case 'KeyH':
        case 'Slash': {
          if (e.key === '?' || e.code === 'KeyH') {
            e.preventDefault();
            setIsShortcutsOpen((prev) => !prev);
          }
          break;
        }
        case 'KeyS': {
          // Speak English shortcut
          e.preventDefault();
          speakEnglish();
          break;
        }
        case 'KeyN': {
          // New numbers shortcut when on Level 4
          if (currentSlide.level === 4) {
            e.preventDefault();
            randomizeLevel4Numbers();
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    inPresentation,
    isTransitionActive,
    isCompleted,
    isShortcutsOpen,
    isLevelDrawerOpen,
    currentSlide.level,
    nextSlide,
    prevSlide,
    toggleReveal,
    restartCurrentLevel,
    goHome,
    goEnd,
    toggleFullscreen,
    speakEnglish,
    randomizeLevel4Numbers,
  ]);

  return {
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
    autoSpeakOnReveal,
    // Actions
    setInPresentation,
    toggleReveal,
    nextSlide,
    prevSlide,
    restartCurrentLevel,
    jumpToSlide,
    jumpToLevel,
    jumpToSlideInCurrentLevel,
    randomizeLevel4Numbers,
    goHome,
    goEnd,
    toggleFullscreen,
    toggleTheme,
    setIsLevelDrawerOpen,
    setIsShortcutsOpen,
    setAutoSpeakOnReveal,
    speakEnglish,
  };
}

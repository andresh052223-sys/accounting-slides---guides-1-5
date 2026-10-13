import { SLIDES_DATA, LEVELS_METADATA, Slide } from './slidesData';

export interface ValidationIssue {
  slideId: number;
  level: number;
  slideInLevel: number;
  issue: string;
}

export interface ValidationResult {
  isValid: boolean;
  totalSlides: number;
  totalLevels: number;
  slidesPerLevelCheck: boolean;
  issues: ValidationIssue[];
}

/**
 * Robust word counting function:
 * Splits by whitespace, strips punctuation, treats contractions like "isn't" as one word.
 */
export function countWords(str: string): number {
  if (!str) return 0;
  // Strip opening/closing quotes, question marks, inverted punctuation, periods, commas, colons, semicolons
  const cleaned = str
    .trim()
    .replace(/[¿?¡!.,;:"“”'’`]/g, (match, offset, string) => {
      // Preserve apostrophes that are inside words like isn't, aren't
      if ((match === "'" || match === '’') && offset > 0 && offset < string.length - 1) {
        const prev = string[offset - 1];
        const next = string[offset + 1];
        if (/[a-zA-Z]/.test(prev) && /[a-zA-Z]/.test(next)) {
          return "'";
        }
      }
      return ' ';
    })
    .trim();

  if (!cleaned) return 0;
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return tokens.length;
}

export function validateSlides(slides: Slide[] = SLIDES_DATA): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Check 1: Exactly 200 slides
  if (slides.length !== 200) {
    issues.push({
      slideId: 0,
      level: 0,
      slideInLevel: 0,
      issue: `Expected 200 slides, found ${slides.length}`,
    });
  }

  // Check 2: Exactly 20 levels
  const levelCounts = new Map<number, number>();
  const idSet = new Set<number>();

  slides.forEach((slide) => {
    // Unique ID check
    if (idSet.has(slide.id)) {
      issues.push({
        slideId: slide.id,
        level: slide.level,
        slideInLevel: slide.slideInLevel,
        issue: `Duplicate slide ID: ${slide.id}`,
      });
    }
    idSet.add(slide.id);

    // Empty checks
    if (!slide.prompt || !slide.prompt.trim()) {
      issues.push({
        slideId: slide.id,
        level: slide.level,
        slideInLevel: slide.slideInLevel,
        issue: 'Empty prompt text',
      });
    }

    if (!slide.answer || !slide.answer.trim()) {
      issues.push({
        slideId: slide.id,
        level: slide.level,
        slideInLevel: slide.slideInLevel,
        issue: 'Empty answer text',
      });
    }

    // Level sequence check
    const count = levelCounts.get(slide.level) || 0;
    levelCounts.set(slide.level, count + 1);

    // Target word count validation
    if (slide.targetWordCount !== undefined) {
      const textToCount = slide.answerLang === 'en' ? slide.answer : slide.prompt;
      const actualCount = countWords(textToCount);
      if (actualCount !== slide.targetWordCount) {
        issues.push({
          slideId: slide.id,
          level: slide.level,
          slideInLevel: slide.slideInLevel,
          issue: `Word count mismatch in Level ${slide.level}: expected ${slide.targetWordCount} words, got ${actualCount} ("${textToCount}")`,
        });
      }
    }

    // Specific check for Level 6: Article (a/an) + adjective + noun
    if (slide.level === 6) {
      const words = slide.answer.trim().split(/\s+/);
      if (words.length !== 3) {
        issues.push({
          slideId: slide.id,
          level: slide.level,
          slideInLevel: slide.slideInLevel,
          issue: `Level 6 slide must have exactly 3 words (article + adjective + noun), found: "${slide.answer}" (${words.length} words)`,
        });
      }
      const article = words[0].toLowerCase();
      if (article !== 'a' && article !== 'an') {
        issues.push({
          slideId: slide.id,
          level: slide.level,
          slideInLevel: slide.slideInLevel,
          issue: `Level 6 slide must begin with "A" or "An", found "${words[0]}"`,
        });
      }
    }
  });

  // Verify all 20 levels have exactly 10 slides
  let slidesPerLevelCheck = true;
  for (let l = 1; l <= 20; l++) {
    const count = levelCounts.get(l) || 0;
    if (count !== 10) {
      slidesPerLevelCheck = false;
      issues.push({
        slideId: 0,
        level: l,
        slideInLevel: 0,
        issue: `Level ${l} has ${count} slides (expected exactly 10)`,
      });
    }
  }

  return {
    isValid: issues.length === 0,
    totalSlides: slides.length,
    totalLevels: levelCounts.size,
    slidesPerLevelCheck,
    issues,
  };
}

// Pre-run validation once at module initialization
export const GLOBAL_VALIDATION_RESULT = validateSlides();

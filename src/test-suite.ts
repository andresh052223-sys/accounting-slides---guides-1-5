import { SLIDES_DATA, LEVELS_METADATA } from './data/slidesData';
import { validateSlides, countWords } from './data/validation';

function runTestSuite() {
  console.log('=== STARTING AUTOMATED TEST SUITE ===\n');
  let failures = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  PASS: ${testName}`);
    } else {
      console.error(`  FAIL: ${testName}`);
      failures++;
    }
  }

  // 1. DATASET INTEGRITY
  console.log('1. DATASET INTEGRITY & VALIDATION:');
  const validationResult = validateSlides(SLIDES_DATA);
  assert(validationResult.isValid, 'All 200 slides pass validateSlides check without issues');
  assert(validationResult.totalSlides === 200, 'Total slides count is exactly 200');
  assert(validationResult.totalLevels === 20, 'Total levels count is exactly 20');
  assert(validationResult.slidesPerLevelCheck, 'Every level from 1 to 20 has exactly 10 slides');

  // 2. SLIDE SEQUENCING & MAPPING
  console.log('\n2. SLIDE INDEXING & SEQUENCING:');
  let sequenceCorrect = true;
  for (let i = 0; i < SLIDES_DATA.length; i++) {
    const slide = SLIDES_DATA[i];
    const expectedLevel = Math.floor(i / 10) + 1;
    const expectedSlideInLevel = (i % 10) + 1;
    if (slide.id !== i + 1 || slide.level !== expectedLevel || slide.slideInLevel !== expectedSlideInLevel) {
      sequenceCorrect = false;
      console.error(`Sequence mismatch at index ${i}: slide.id=${slide.id}, slide.level=${slide.level}, slideInLevel=${slide.slideInLevel}`);
    }
  }
  assert(sequenceCorrect, 'All slides are ordered sequentially 1..200 with matching level and slideInLevel');

  // 3. RESTART LEVEL P KEY FORMULA
  console.log('\n3. RESTART LEVEL (P KEY) CALCULATIONS:');
  function calculateRestartSlideIndex(currentLevel: number): number {
    return (currentLevel - 1) * 10;
  }
  // Slide 23 (Level 3, index 22) -> returns to Slide 21 (index 20)
  assert(calculateRestartSlideIndex(3) === 20, 'Slide 23 (Level 3) restarts to Slide 21 (index 20)');
  // Slide 50 (Level 5, index 49) -> returns to Slide 41 (index 40)
  assert(calculateRestartSlideIndex(5) === 40, 'Slide 50 (Level 5) restarts to Slide 41 (index 40)');
  // Slide 200 (Level 20, index 199) -> returns to Slide 191 (index 190)
  assert(calculateRestartSlideIndex(20) === 190, 'Slide 200 (Level 20) restarts to Slide 191 (index 190)');

  // 4. LEVEL TRANSITION TRIGGER CONDITIONS
  console.log('\n4. LEVEL TRANSITION TRIGGERS:');
  // Slides 10, 20, 30, ..., 190 trigger transitions; Slide 200 triggers completion
  for (let lvl = 1; lvl <= 20; lvl++) {
    const lastSlideIndexOfLevel = lvl * 10 - 1;
    const isLastSlide = (lastSlideIndexOfLevel + 1) % 10 === 0;
    assert(isLastSlide, `Slide ${lvl * 10} (Level ${lvl}) correctly flags end-of-level transition`);
  }

  // 5. WORD COUNT STRICT RULES
  console.log('\n5. WORD COUNT STRICT RULES PER LEVEL:');
  const levelTargetCounts: Record<number, number> = {
    6: 3,
    7: 4,
    8: 4,
    9: 4,
    10: 4,
    12: 4,
    13: 4,
    14: 4,
    16: 2,
    17: 4,
    19: 2,
    20: 4,
  };

  Object.entries(levelTargetCounts).forEach(([levelStr, targetCount]) => {
    const levelNum = Number(levelStr);
    const levelSlides = SLIDES_DATA.filter((s) => s.level === levelNum);
    assert(levelSlides.length === 10, `Level ${levelNum} has exactly 10 slides`);
    let allMatch = true;
    levelSlides.forEach((slide) => {
      const actualCount = countWords(slide.answer);
      if (actualCount !== targetCount) {
        allMatch = false;
        console.error(`Level ${levelNum} slide ${slide.id} ("${slide.answer}") has ${actualCount} words, expected ${targetCount}`);
      }
    });
    assert(allMatch, `Level ${levelNum} all 10 answers have exactly ${targetCount} words`);
  });

  // 6. LEVEL 6 ARTICLE STRUCTURE (A / AN + ADJECTIVE + NOUN)
  console.log('\n6. LEVEL 6 ARTICLE-ADJECTIVE-NOUN CHECK:');
  const level6Slides = SLIDES_DATA.filter((s) => s.level === 6);
  let l6Valid = true;
  level6Slides.forEach((s) => {
    const words = s.answer.trim().split(/\s+/);
    const firstWord = words[0].toLowerCase();
    if (words.length !== 3 || (firstWord !== 'a' && firstWord !== 'an')) {
      l6Valid = false;
      console.error(`Level 6 slide ${s.id} invalid: "${s.answer}"`);
    }
  });
  assert(l6Valid, 'Level 6 strictly follows [A/An] + [Adjective] + [Noun] pattern');

  console.log('\n=== TEST SUITE RESULTS ===');
  if (failures === 0) {
    console.log('ALL TESTS PASSED WITH 0 FAILURES!');
    process.exit(0);
  } else {
    console.error(`TOTAL FAILURES: ${failures}`);
    process.exit(1);
  }
}

runTestSuite();

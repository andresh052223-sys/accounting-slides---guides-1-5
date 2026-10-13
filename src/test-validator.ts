import { validateSlides } from './data/validation';
import { SLIDES_DATA } from './data/slidesData';

console.log('--- RUNNING SLIDES VALIDATION ---');
const result = validateSlides(SLIDES_DATA);
console.log(`Total slides: ${result.totalSlides}`);
console.log(`Total levels: ${result.totalLevels}`);
console.log(`Is valid: ${result.isValid}`);
console.log(`Slides per level check: ${result.slidesPerLevelCheck}`);

if (!result.isValid) {
  console.error('Validation issues found:');
  result.issues.forEach((issue) => {
    console.error(`- [Slide ${issue.slideId} | Level ${issue.level}.${issue.slideInLevel}] ${issue.issue}`);
  });
  process.exit(1);
} else {
  console.log('SUCCESS: All 200 slides passed 100% of validation rules!');
  process.exit(0);
}

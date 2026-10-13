import { Slide } from './slidesData';

const ONES: Record<number, string> = {
  0: 'Zero',
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
  15: 'Fifteen',
  16: 'Sixteen',
  17: 'Seventeen',
  18: 'Eighteen',
  19: 'Nineteen',
};

const TENS: Record<number, string> = {
  2: 'Twenty',
  3: 'Thirty',
  4: 'Forty',
  5: 'Fifty',
  6: 'Sixty',
  7: 'Seventy',
  8: 'Eighty',
  9: 'Ninety',
};

export function convertNumberToWords(n: number): string {
  if (n < 20) {
    return ONES[n] || String(n);
  }
  if (n < 100) {
    const tenDigit = Math.floor(n / 10);
    const unitDigit = n % 10;
    if (unitDigit === 0) {
      return TENS[tenDigit];
    }
    return `${TENS[tenDigit]}-${ONES[unitDigit].toLowerCase()}`;
  }
  if (n < 1000) {
    const hundredDigit = Math.floor(n / 100);
    const remainder = n % 100;
    const hundredPart = `${ONES[hundredDigit]} hundred`;
    if (remainder === 0) return hundredPart;
    return `${hundredPart} ${convertNumberToWords(remainder).toLowerCase()}`;
  }
  if (n < 1000000) {
    const thousandPart = Math.floor(n / 1000);
    const remainder = n % 1000;
    const thousandStr = `${convertNumberToWords(thousandPart)} thousand`;
    if (remainder === 0) return thousandStr;
    return `${thousandStr} ${convertNumberToWords(remainder).toLowerCase()}`;
  }
  if (n === 1000000) {
    return 'One million';
  }
  return n.toLocaleString('en-US');
}

export function formatNumberPrompt(n: number): string {
  return n.toLocaleString('en-US');
}

// 10 distinct difficulty slots to guarantee pedagogical variety
const NUMBER_SLOTS: number[][] = [
  // Slot 1: Single digits (2, 3, 4, 6, 7, 8, 9)
  [2, 3, 4, 6, 7, 8, 9],
  // Slot 2: Teens (11, 13, 14, 16, 17, 18, 19)
  [11, 13, 14, 16, 17, 18, 19],
  // Slot 3: Round tens (20, 30, 40, 60, 70, 80, 90)
  [20, 30, 40, 60, 70, 80, 90],
  // Slot 4: 20s-30s compound numbers (21, 24, 28, 32, 35, 38)
  [21, 24, 28, 32, 35, 38],
  // Slot 5: 40s-50s compound numbers (42, 45, 48, 52, 55, 59)
  [42, 45, 48, 52, 55, 59],
  // Slot 6: 60s-90s compound numbers (64, 68, 73, 75, 82, 88, 95)
  [64, 68, 73, 75, 82, 88, 95],
  // Slot 7: Even hundreds (200, 300, 400, 500, 600, 800)
  [200, 300, 400, 500, 600, 800],
  // Slot 8: Mixed hundreds (150, 250, 350, 450, 750)
  [150, 250, 350, 450, 750],
  // Slot 9: Thousands (2000, 3000, 5000, 10000, 20000, 25000)
  [2000, 3000, 5000, 10000, 20000, 25000],
  // Slot 10: Financial amounts (50000, 100000, 250000, 500000, 1000000)
  [50000, 100000, 250000, 500000, 1000000],
];

export function generateDynamicLevel4Slides(): Slide[] {
  const generatedSlides: Slide[] = [];

  for (let i = 0; i < 10; i++) {
    const slotPool = NUMBER_SLOTS[i];
    const pickedNumber = slotPool[Math.floor(Math.random() * slotPool.length)];
    const promptText = formatNumberPrompt(pickedNumber);
    const answerText = convertNumberToWords(pickedNumber);

    generatedSlides.push({
      id: 31 + i,
      level: 4,
      slideInLevel: i + 1,
      levelTitle: 'NUMBERS',
      prompt: promptText,
      promptLang: 'es',
      answer: answerText,
      answerLang: 'en',
      note: pickedNumber >= 1000 ? 'Monto financiero' : 'Número en inglés',
    });
  }

  return generatedSlides;
}

'use strict';

const hijri = require('./hijri-date');

// ============================================================================
// Basic Usage
// ============================================================================

console.log('=== Basic Conversion ===\n');

// Convert today's date
const today = new Date();
const todayHijri = hijri.convert(today);
console.log('Today (Gregorian):', today.toDateString());
console.log('Today (Hijri):', todayHijri);
console.log();

// Convert a specific date
const specificDate = new Date('2024-03-11'); // Ramadan 1, 1445
const ramadan = hijri.convert(specificDate);
console.log('March 11, 2024 (Gregorian)');
console.log('Hijri Date:', ramadan.dayOfMonth, ramadan.monthText, ramadan.year);
console.log('Day of Week:', ramadan.dayOfWeekText);
console.log();

// ============================================================================
// Using Adjustment Parameter
// ============================================================================

console.log('=== With Adjustment ===\n');

// The adjustment parameter is used for regional moon sighting differences
// Some regions may see the moon a day earlier or later

const date = new Date('2024-01-15');

const noAdjust = hijri.convert(date, 0);
const minusOne = hijri.convert(date, -1);
const plusOne = hijri.convert(date, 1);

console.log('Date: January 15, 2024');
console.log('No adjustment:', noAdjust.dayOfMonth, noAdjust.monthText, noAdjust.year);
console.log('Minus 1 day:  ', minusOne.dayOfMonth, minusOne.monthText, minusOne.year);
console.log('Plus 1 day:   ', plusOne.dayOfMonth, plusOne.monthText, plusOne.year);
console.log();

// Note: Weekday does NOT change with adjustment (intentional behavior)
console.log('Weekday stays the same:', noAdjust.dayOfWeekText, '=', minusOne.dayOfWeekText);
console.log();

// ============================================================================
// Accessing Individual Properties
// ============================================================================

console.log('=== Result Properties ===\n');

const result = hijri.convert(new Date('2024-01-15'));

console.log('dayOfWeekText:', result.dayOfWeekText, '(Arabic weekday name)');
console.log('dayOfWeek:    ', result.dayOfWeek, '(1=Sunday, 7=Saturday)');
console.log('dayOfMonth:   ', result.dayOfMonth, '(1-30)');
console.log('month:        ', result.month, '(1-12)');
console.log('monthText:    ', result.monthText, '(Arabic month name)');
console.log('year:         ', result.year, '(Hijri year)');
console.log();

// ============================================================================
// Important Islamic Dates Example
// ============================================================================

console.log('=== Important Islamic Dates (2024) ===\n');

const islamicDates = [
  { name: 'Ramadan Start', date: '2024-03-11' },
  { name: 'Eid al-Fitr', date: '2024-04-10' },
  { name: 'Eid al-Adha', date: '2024-06-16' },
  { name: 'Islamic New Year', date: '2024-07-07' }
];

islamicDates.forEach(({ name, date }) => {
  const h = hijri.convert(new Date(date));
  console.log(`${name}: ${h.dayOfMonth} ${h.monthText} ${h.year}`);
});
console.log();

// ============================================================================
// Error Handling Example
// ============================================================================

console.log('=== Error Handling ===\n');

// The convert function validates inputs and throws clear errors

try {
  hijri.convert(null);
} catch (error) {
  console.log('null input:', error.message);
}

try {
  hijri.convert(new Date('invalid'));
} catch (error) {
  console.log('Invalid Date:', error.message);
}

try {
  hijri.convert(new Date(), 'not a number');
} catch (error) {
  console.log('Invalid adjustment:', error.message);
}

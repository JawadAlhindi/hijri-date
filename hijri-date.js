// hijri-date.js
// Gregorian to Hijri (Islamic) date converter
// license: MIT

'use strict';

// ============================================================================
// Constants
// ============================================================================

/** Milliseconds in a day */
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

/** Islamic calendar epoch in Julian Day Number (astronomical) */
const HIJRI_EPOCH = 1948084;

/** Number of days in a 30-year Hijri cycle */
const HIJRI_CYCLE_DAYS = 10631;

/** Number of years in a Hijri cycle */
const HIJRI_CYCLE_YEARS = 30;

/** Average length of a Hijri year in days */
const HIJRI_YEAR_LENGTH = HIJRI_CYCLE_DAYS / HIJRI_CYCLE_YEARS;

/** Shift factor for Hijri month calculation accuracy */
const HIJRI_MONTH_SHIFT = 8.01 / 60.0;

/** Year of the Gregorian calendar reform */
const GREGORIAN_REFORM_YEAR = 1582;

/** Julian Day Number marking the Gregorian calendar cutoff */
const JULIAN_DAY_GREGORIAN_CUTOFF = 2299160;

/** Arabic weekday names (Sunday to Saturday) */
const WEEKDAY_NAMES_AR = [
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت'
];

/** Arabic Hijri month names (Muharram to Dhul Hijjah) */
const HIJRI_MONTH_NAMES_AR = [
  'المحرّم',
  'صفر',
  'ربيع الأوّل',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوّال',
  'ذو القعدة',
  'ذو الحجّة'
];

// ============================================================================
// Internal Functions
// ============================================================================

/**
 * Validates input parameters for the convert function.
 * @private
 * @param {*} date - The date parameter to validate
 * @param {*} adjustment - The adjustment parameter to validate
 * @throws {TypeError} If date is not a valid Date object
 * @throws {TypeError} If adjustment is provided but not a number
 * @throws {RangeError} If date is invalid (NaN)
 * @throws {RangeError} If adjustment is not finite
 */
function validateInputs(date, adjustment) {
  if (!(date instanceof Date)) {
    throw new TypeError(
      'Expected date parameter to be a Date object, received ' + typeof date
    );
  }

  if (isNaN(date.getTime())) {
    throw new RangeError('Invalid Date provided');
  }

  if (adjustment !== null && adjustment !== undefined) {
    if (typeof adjustment !== 'number') {
      throw new TypeError(
        'Expected adjustment parameter to be a number, received ' + typeof adjustment
      );
    }
    if (!isFinite(adjustment)) {
      throw new RangeError('Adjustment must be a finite number');
    }
  }
}

/**
 * Internal function that performs the Gregorian to Hijri conversion.
 * Uses Julian Day Number as an intermediate representation.
 *
 * @private
 * @param {Date} date - Valid JavaScript Date object
 * @param {number} [adjustment=0] - Day adjustment for moon sighting differences
 * @returns {number[]} Array of 8 values:
 *   [0] Gregorian day, [1] Gregorian month (0-indexed), [2] Gregorian year,
 *   [3] Julian Day Number, [4] Weekday (0-indexed), [5] Hijri day,
 *   [6] Hijri month (0-indexed), [7] Hijri year
 */
function basecal(date, adjustment) {
  // Apply day adjustment if provided
  let today = date;
  if (adjustment) {
    const adjustMillis = MILLISECONDS_PER_DAY * adjustment;
    const todayMillis = today.getTime() + adjustMillis;
    today = new Date(todayMillis);
  }

  // Weekday is based on ORIGINAL date (intentional behavior)
  // The adjustment only affects the Hijri date, not which weekday the user is asking about
  const weekday = date.getDay() + 1;

  let day = today.getDate();
  let month = today.getMonth();
  let year = today.getFullYear();
  let m = month + 1;
  let y = year;

  // Adjust for January/February (treat as months 13/14 of previous year)
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  // Calculate Julian Day Number with Gregorian calendar correction
  let a = Math.floor(y / 100.0);
  let b = 2 - a + Math.floor(a / 4.0);

  // Handle pre-Gregorian reform dates (before October 15, 1582)
  if (y < 1583) {
    b = 0;
  }
  if (y === GREGORIAN_REFORM_YEAR) {
    if (m > 10) {
      b = -10;
    }
    if (m === 10) {
      b = 0;
      if (day > 4) {
        b = -10;
      }
    }
  }

  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + b - 1524;

  // Convert Julian Day to Gregorian (for verification/output)
  b = 0;
  if (jd > JULIAN_DAY_GREGORIAN_CUTOFF) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4.0);
  }

  const bb = jd + b + 1524;
  const cc = Math.floor((bb - 122.1) / 365.25);
  const dd = Math.floor(365.25 * cc);
  const ee = Math.floor((bb - dd) / 30.6001);

  day = (bb - dd) - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    month = ee - 13;
  }
  year = cc - 4716;

  // Convert Julian Day to Hijri calendar
  const z = jd - HIJRI_EPOCH;
  const cyc = Math.floor(z / HIJRI_CYCLE_DAYS);
  const zRemainder = z - HIJRI_CYCLE_DAYS * cyc;
  const j = Math.floor((zRemainder - HIJRI_MONTH_SHIFT) / HIJRI_YEAR_LENGTH);
  const hijriYear = HIJRI_CYCLE_YEARS * cyc + j;

  const zz = zRemainder - Math.floor(j * HIJRI_YEAR_LENGTH + HIJRI_MONTH_SHIFT);
  let hijriMonth = Math.floor((zz + 28.5001) / 29.5);
  if (hijriMonth === 13) {
    hijriMonth = 12;
  }

  const hijriDay = zz - Math.floor(29.5001 * hijriMonth - 29);

  // Return results as array (internal API)
  return [
    day,             // [0] calculated day (CE)
    month - 1,       // [1] calculated month (CE), 0-indexed
    year,            // [2] calculated year (CE)
    jd - 1,          // [3] Julian day number
    weekday - 1,     // [4] weekday number, 0-indexed
    hijriDay,        // [5] Islamic day
    hijriMonth - 1,  // [6] Islamic month, 0-indexed
    hijriYear        // [7] Islamic year
  ];
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Converts a Gregorian date to Hijri (Islamic) calendar date.
 *
 * @param {Date} date - JavaScript Date object to convert
 * @param {number} [adjustment=0] - Day adjustment for regional moon sighting differences.
 *   Positive values move the Hijri date forward, negative values move it backward.
 *   Note: The weekday remains unchanged (based on original date).
 * @returns {Object} Object containing the Hijri date information:
 *   - {string} dayOfWeekText - Arabic name of the weekday
 *   - {number} dayOfWeek - Day of week (1=Sunday, 7=Saturday)
 *   - {number} dayOfMonth - Day of the Hijri month (1-30)
 *   - {number} month - Hijri month number (1-12)
 *   - {string} monthText - Arabic name of the Hijri month
 *   - {number} year - Hijri year
 * @throws {TypeError} If date is not a Date object or adjustment is not a number
 * @throws {RangeError} If date is invalid or adjustment is not finite
 *
 * @example
 * const hijri = require('hijri');
 *
 * // Basic conversion
 * const result = hijri.convert(new Date('2024-01-15'));
 * console.log(result);
 * // { dayOfWeekText: 'الاثنين', dayOfWeek: 2, dayOfMonth: 3, month: 7, monthText: 'رجب', year: 1445 }
 *
 * @example
 * // With adjustment for moon sighting
 * const result = hijri.convert(new Date('2024-01-15'), -1);
 * // Shifts the Hijri date back by 1 day
 */
exports.convert = function(date, adjustment) {
  // Validate inputs (throws on invalid input)
  validateInputs(date, adjustment);

  const iDate = basecal(date, adjustment);

  return {
    dayOfWeekText: WEEKDAY_NAMES_AR[iDate[4]],
    dayOfWeek: iDate[4] + 1,
    dayOfMonth: iDate[5],
    month: iDate[6] + 1,
    monthText: HIJRI_MONTH_NAMES_AR[iDate[6]],
    year: iDate[7]
  };
};

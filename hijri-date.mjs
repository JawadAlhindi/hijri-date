/**
 * ES Module wrapper for hijri-date
 * @fileoverview Provides ES Module exports for the Hijri date converter
 * @license MIT
 */

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const hijri = require('./hijri-date.js');

/**
 * Converts a Gregorian date to Hijri (Islamic) calendar date.
 *
 * @param {Date} date - JavaScript Date object to convert
 * @param {number} [adjustment=0] - Day adjustment for regional moon sighting
 * @returns {import('./hijri-date').HijriDate} Hijri date object
 * @throws {TypeError} If date is not a Date object or adjustment is not a number
 * @throws {RangeError} If date is invalid or adjustment is not finite
 */
export const convert = hijri.convert;

// Default export for convenience
export default { convert };

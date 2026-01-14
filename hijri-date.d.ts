/**
 * Hijri (Islamic) date conversion result.
 */
export interface HijriDate {
  /**
   * Arabic name of the weekday.
   * @example 'الاثنين' (Monday)
   */
  dayOfWeekText: string;

  /**
   * Day of week as number.
   * 1 = Sunday, 2 = Monday, ..., 7 = Saturday
   */
  dayOfWeek: number;

  /**
   * Day of the Hijri month (1-30).
   */
  dayOfMonth: number;

  /**
   * Hijri month number (1-12).
   * 1 = Muharram, 9 = Ramadan, 12 = Dhul Hijjah
   */
  month: number;

  /**
   * Arabic name of the Hijri month.
   * @example 'رمضان' (Ramadan)
   */
  monthText: string;

  /**
   * Hijri year.
   */
  year: number;
}

/**
 * Converts a Gregorian date to Hijri (Islamic) calendar date.
 *
 * @param date - JavaScript Date object to convert
 * @param adjustment - Optional day adjustment for regional moon sighting differences.
 *   Positive values move the Hijri date forward, negative values move it backward.
 *   The weekday remains unchanged (based on original date).
 * @returns Object containing the Hijri date information
 * @throws {TypeError} If date is not a Date object or adjustment is not a number
 * @throws {RangeError} If date is invalid or adjustment is not finite
 *
 * @example
 * ```typescript
 * import * as hijri from 'hijri';
 *
 * const result = hijri.convert(new Date('2024-01-15'));
 * console.log(result.year);      // 1445
 * console.log(result.month);     // 7 (Rajab)
 * console.log(result.monthText); // 'رجب'
 * ```
 *
 * @example
 * ```typescript
 * // With adjustment for moon sighting
 * const result = hijri.convert(new Date('2024-01-15'), -1);
 * // Shifts the Hijri date back by 1 day
 * ```
 */
export function convert(date: Date, adjustment?: number): HijriDate;

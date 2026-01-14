'use strict';

const chai = require('chai');
const hijri = require('./hijri-date');

chai.should();
const expect = chai.expect;

describe('hijri', function() {

  // ============================================================================
  // Input Validation Tests
  // ============================================================================

  describe('#convert - Input Validation', function() {

    describe('date parameter validation', function() {

      it('should throw TypeError for null input', function() {
        expect(() => hijri.convert(null)).to.throw(TypeError, /Date object/);
      });

      it('should throw TypeError for undefined input', function() {
        expect(() => hijri.convert(undefined)).to.throw(TypeError, /Date object/);
      });

      it('should throw TypeError for string input', function() {
        expect(() => hijri.convert('2024-01-15')).to.throw(TypeError, /Date object/);
      });

      it('should throw TypeError for number input', function() {
        expect(() => hijri.convert(1705276800000)).to.throw(TypeError, /Date object/);
      });

      it('should throw TypeError for plain object input', function() {
        expect(() => hijri.convert({})).to.throw(TypeError, /Date object/);
      });

      it('should throw TypeError for array input', function() {
        expect(() => hijri.convert([2024, 0, 15])).to.throw(TypeError, /Date object/);
      });

      it('should throw RangeError for Invalid Date', function() {
        expect(() => hijri.convert(new Date('invalid'))).to.throw(RangeError, /Invalid Date/);
      });

      it('should throw RangeError for Date with NaN', function() {
        expect(() => hijri.convert(new Date(NaN))).to.throw(RangeError, /Invalid Date/);
      });
    });

    describe('adjustment parameter validation', function() {

      it('should throw TypeError for string adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, 'one')).to.throw(TypeError, /number/);
      });

      it('should throw TypeError for object adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, {})).to.throw(TypeError, /number/);
      });

      it('should throw TypeError for array adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, [1])).to.throw(TypeError, /number/);
      });

      it('should throw TypeError for boolean adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, true)).to.throw(TypeError, /number/);
      });

      it('should throw RangeError for Infinity adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, Infinity)).to.throw(RangeError, /finite/);
      });

      it('should throw RangeError for -Infinity adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, -Infinity)).to.throw(RangeError, /finite/);
      });

      it('should throw RangeError for NaN adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, NaN)).to.throw(RangeError, /finite/);
      });

      it('should accept adjustment of 0', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, 0)).to.not.throw();
      });

      it('should accept null adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, null)).to.not.throw();
      });

      it('should accept undefined adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, undefined)).to.not.throw();
      });

      it('should accept positive integer adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, 1)).to.not.throw();
      });

      it('should accept negative integer adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, -1)).to.not.throw();
      });

      it('should accept decimal adjustment', function() {
        const date = new Date('2024-01-15');
        expect(() => hijri.convert(date, 0.5)).to.not.throw();
      });
    });
  });

  // ============================================================================
  // Return Value Structure Tests
  // ============================================================================

  describe('#convert - Return Value Structure', function() {

    it('should return object with all required properties', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      result.should.have.property('dayOfWeekText');
      result.should.have.property('dayOfWeek');
      result.should.have.property('dayOfMonth');
      result.should.have.property('month');
      result.should.have.property('monthText');
      result.should.have.property('year');
    });

    it('should return exactly 6 properties', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      Object.keys(result).should.have.length(6);
    });

    it('should return correct types for all properties', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      result.dayOfWeekText.should.be.a('string');
      result.dayOfWeek.should.be.a('number');
      result.dayOfMonth.should.be.a('number');
      result.month.should.be.a('number');
      result.monthText.should.be.a('string');
      result.year.should.be.a('number');
    });

    it('should return dayOfWeek in range 1-7', function() {
      // Test a full week (Sun Jan 14 to Sat Jan 20, 2024)
      for (let i = 0; i < 7; i++) {
        const date = new Date(2024, 0, 14 + i);
        const result = hijri.convert(date);
        result.dayOfWeek.should.be.at.least(1);
        result.dayOfWeek.should.be.at.most(7);
      }
    });

    it('should return month in range 1-12', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      result.month.should.be.at.least(1);
      result.month.should.be.at.most(12);
    });

    it('should return dayOfMonth in range 1-30', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      result.dayOfMonth.should.be.at.least(1);
      result.dayOfMonth.should.be.at.most(30);
    });

    it('should return positive year', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      result.year.should.be.above(0);
    });
  });

  // ============================================================================
  // Weekday Behavior Tests
  // ============================================================================

  describe('#convert - Weekday Behavior', function() {

    it('should not change weekday due to adjustment (original behavior)', function() {
      // This is the original test from the package - weekday shouldn't change
      const dt1 = hijri.convert(new Date('2015-01-12'), 0);
      const dt2 = hijri.convert(new Date('2015-01-12'), -1);
      const dt3 = hijri.convert(new Date('2015-01-12'), 2);
      dt1.dayOfWeek.should.be.equal(dt2.dayOfWeek);
      dt2.dayOfWeek.should.be.equal(dt3.dayOfWeek);
      dt3.dayOfWeek.should.be.equal(dt1.dayOfWeek);
    });

    it('should not change weekday with large positive adjustment', function() {
      const dt1 = hijri.convert(new Date('2024-01-15'), 0);
      const dt2 = hijri.convert(new Date('2024-01-15'), 365);
      dt1.dayOfWeek.should.be.equal(dt2.dayOfWeek);
    });

    it('should not change weekday with large negative adjustment', function() {
      const dt1 = hijri.convert(new Date('2024-01-15'), 0);
      const dt2 = hijri.convert(new Date('2024-01-15'), -365);
      dt1.dayOfWeek.should.be.equal(dt2.dayOfWeek);
    });

    it('should return correct weekday text for each day of week', function() {
      const weekdays = [
        'الأحد',     // Sunday
        'الاثنين',   // Monday
        'الثلاثاء',  // Tuesday
        'الأربعاء',  // Wednesday
        'الخميس',    // Thursday
        'الجمعة',    // Friday
        'السبت'      // Saturday
      ];
      // Jan 14, 2024 is Sunday
      for (let i = 0; i < 7; i++) {
        const date = new Date(2024, 0, 14 + i);
        const result = hijri.convert(date);
        result.dayOfWeekText.should.equal(weekdays[i]);
        result.dayOfWeek.should.equal(i + 1);
      }
    });
  });

  // ============================================================================
  // Known Date Conversion Tests
  // ============================================================================

  describe('#convert - Known Date Conversions', function() {

    it('should convert a date in Ramadan 1445', function() {
      // March 11, 2024 = Ramadan 1, 1445 (approximately)
      const result = hijri.convert(new Date('2024-03-11'));
      result.year.should.equal(1445);
      result.month.should.equal(9); // Ramadan
    });

    it('should convert a date in Shawwal 1445', function() {
      // April 10, 2024 = Shawwal 1, 1445 (approximately)
      const result = hijri.convert(new Date('2024-04-10'));
      result.year.should.equal(1445);
      result.month.should.equal(10); // Shawwal
    });

    it('should convert January 1, 1970 (Unix epoch)', function() {
      const result = hijri.convert(new Date('1970-01-01'));
      result.should.have.property('year');
      result.year.should.equal(1389);
    });

    it('should convert year 2000 correctly', function() {
      const result = hijri.convert(new Date('2000-01-01'));
      result.year.should.equal(1420);
    });
  });

  // ============================================================================
  // Adjustment Effects Tests
  // ============================================================================

  describe('#convert - Adjustment Effects', function() {

    it('should shift Hijri date forward with positive adjustment', function() {
      const base = hijri.convert(new Date('2024-01-15'), 0);
      const adjusted = hijri.convert(new Date('2024-01-15'), 1);

      // The Hijri day or month should be different
      if (base.dayOfMonth < 30) {
        adjusted.dayOfMonth.should.equal(base.dayOfMonth + 1);
      } else {
        adjusted.dayOfMonth.should.equal(1);
      }
    });

    it('should shift Hijri date backward with negative adjustment', function() {
      const base = hijri.convert(new Date('2024-01-15'), 0);
      const adjusted = hijri.convert(new Date('2024-01-15'), -1);

      // The Hijri day should decrease by 1 (or wrap to previous month)
      if (base.dayOfMonth > 1) {
        adjusted.dayOfMonth.should.equal(base.dayOfMonth - 1);
      }
    });

    it('should handle adjustment spanning month boundary', function() {
      // Find a date at beginning of Hijri month and adjust back
      const base = hijri.convert(new Date('2024-03-11'), 0); // Ramadan 1
      if (base.dayOfMonth === 1) {
        const adjusted = hijri.convert(new Date('2024-03-11'), -1);
        adjusted.month.should.equal(base.month - 1 || 12);
      }
    });

    it('should handle large positive adjustment (1 year)', function() {
      const date = new Date('2024-01-15');
      const result = hijri.convert(date, 365);
      result.should.have.property('year');
      // Hijri year should be approximately 1 year ahead due to shorter lunar year
    });

    it('should handle large negative adjustment (1 year)', function() {
      const date = new Date('2024-01-15');
      const result = hijri.convert(date, -365);
      result.should.have.property('year');
    });

    it('should handle very large adjustment (10 years)', function() {
      const date = new Date('2024-01-15');
      expect(() => hijri.convert(date, 3650)).to.not.throw();
      expect(() => hijri.convert(date, -3650)).to.not.throw();
    });
  });

  // ============================================================================
  // Edge Cases Tests
  // ============================================================================

  describe('#convert - Edge Cases', function() {

    describe('Gregorian calendar edge cases', function() {

      it('should handle January 1', function() {
        const result = hijri.convert(new Date('2024-01-01'));
        result.should.have.property('year');
        result.dayOfMonth.should.be.at.least(1);
      });

      it('should handle December 31', function() {
        const result = hijri.convert(new Date('2024-12-31'));
        result.should.have.property('year');
      });

      it('should handle February 28 (non-leap year)', function() {
        const result = hijri.convert(new Date('2023-02-28'));
        result.should.have.property('year');
      });

      it('should handle February 29 (leap year)', function() {
        const result = hijri.convert(new Date('2024-02-29'));
        result.should.have.property('year');
        result.dayOfMonth.should.be.at.least(1);
        result.dayOfMonth.should.be.at.most(30);
      });

      it('should handle month boundaries', function() {
        // Test last day of Jan to first day of Feb
        const jan31 = hijri.convert(new Date('2024-01-31'));
        const feb1 = hijri.convert(new Date('2024-02-01'));

        // Both should return valid results
        jan31.should.have.property('year');
        feb1.should.have.property('year');
      });
    });

    describe('Historical dates', function() {

      it('should handle dates before Gregorian reform (1500)', function() {
        const result = hijri.convert(new Date('1500-06-15'));
        result.should.have.property('year');
        result.year.should.be.a('number');
      });

      it('should handle Gregorian reform date (October 15, 1582)', function() {
        const result = hijri.convert(new Date('1582-10-15'));
        result.should.have.property('year');
      });

      it('should handle date just before Gregorian reform', function() {
        const result = hijri.convert(new Date('1582-10-04'));
        result.should.have.property('year');
      });
    });

    describe('Far future dates', function() {

      it('should handle year 2100', function() {
        const result = hijri.convert(new Date('2100-06-15'));
        result.should.have.property('year');
        result.year.should.be.above(1500);
      });

      it('should handle year 3000', function() {
        const result = hijri.convert(new Date('3000-01-01'));
        result.should.have.property('year');
      });
    });

    describe('Midnight and time edge cases', function() {

      it('should handle midnight (00:00:00)', function() {
        const result = hijri.convert(new Date('2024-01-15T00:00:00'));
        result.should.have.property('year');
      });

      it('should handle end of day (23:59:59)', function() {
        const result = hijri.convert(new Date('2024-01-15T23:59:59'));
        result.should.have.property('year');
      });

      it('should return same Hijri date regardless of time', function() {
        const morning = hijri.convert(new Date('2024-01-15T06:00:00'));
        const evening = hijri.convert(new Date('2024-01-15T18:00:00'));
        morning.dayOfMonth.should.equal(evening.dayOfMonth);
        morning.month.should.equal(evening.month);
        morning.year.should.equal(evening.year);
      });
    });
  });

  // ============================================================================
  // Month Names Tests
  // ============================================================================

  describe('#convert - Month Names', function() {

    it('should return valid Arabic month names', function() {
      const validMonths = [
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

      // Test multiple dates to cover different months
      for (let month = 1; month <= 12; month++) {
        const date = new Date(2024, month - 1, 15);
        const result = hijri.convert(date);
        validMonths.should.include(result.monthText);
      }
    });

    it('should return non-empty month text', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      result.monthText.should.have.length.above(0);
    });

    it('should return Arabic characters in month text', function() {
      const result = hijri.convert(new Date('2024-01-15'));
      // Arabic Unicode range: \u0600-\u06FF
      result.monthText.should.match(/[\u0600-\u06FF]/);
    });
  });

  // ============================================================================
  // Consistency Tests
  // ============================================================================

  describe('#convert - Consistency', function() {

    it('should return consistent results for same date', function() {
      const date = new Date('2024-01-15');
      const result1 = hijri.convert(date);
      const result2 = hijri.convert(date);

      result1.dayOfWeek.should.equal(result2.dayOfWeek);
      result1.dayOfMonth.should.equal(result2.dayOfMonth);
      result1.month.should.equal(result2.month);
      result1.year.should.equal(result2.year);
    });

    it('should return consecutive Hijri days for consecutive Gregorian days', function() {
      const day1 = hijri.convert(new Date('2024-01-15'));
      const day2 = hijri.convert(new Date('2024-01-16'));

      // Day 2 should be day 1 + 1, or if at month boundary, should be 1
      if (day1.dayOfMonth < 30) {
        day2.dayOfMonth.should.equal(day1.dayOfMonth + 1);
      } else {
        day2.dayOfMonth.should.equal(1);
      }
    });

    it('should handle date objects created different ways', function() {
      const date1 = new Date('2024-01-15');
      const date2 = new Date(2024, 0, 15);

      const result1 = hijri.convert(date1);
      const result2 = hijri.convert(date2);

      result1.year.should.equal(result2.year);
      result1.month.should.equal(result2.month);
      result1.dayOfMonth.should.equal(result2.dayOfMonth);
    });
  });

  // ============================================================================
  // Performance Tests (basic)
  // ============================================================================

  describe('#convert - Performance', function() {

    it('should handle 1000 conversions without error', function() {
      const startDate = new Date('2020-01-01');
      for (let i = 0; i < 1000; i++) {
        const date = new Date(startDate.getTime() + i * 86400000);
        const result = hijri.convert(date);
        result.should.have.property('year');
      }
    });
  });
});

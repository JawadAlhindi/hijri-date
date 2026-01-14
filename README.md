# Hijri Date Converter

[![npm version](https://img.shields.io/npm/v/hijri.svg)](https://www.npmjs.com/package/hijri)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node.js module to convert Gregorian dates to Hijri (Islamic) calendar dates with ease. Supports day adjustments for regional moon sighting differences.

## Features

- Convert any Gregorian date to Hijri calendar
- Day adjustment support for regional moon sighting
- Arabic weekday and month names
- TypeScript support
- ES Module and CommonJS support
- Input validation with clear error messages
- Zero dependencies

## Installation

```bash
npm install hijri
```

## Quick Start

```javascript
const hijri = require('hijri');

const result = hijri.convert(new Date());
console.log(result);
// {
//   dayOfWeekText: 'الأربعاء',
//   dayOfWeek: 4,
//   dayOfMonth: 26,
//   month: 7,
//   monthText: 'رجب',
//   year: 1447
// }
```

## Usage

### CommonJS

```javascript
const hijri = require('hijri');
const result = hijri.convert(new Date('2024-03-11'));
```

### ES Modules

```javascript
import { convert } from 'hijri';
const result = convert(new Date('2024-03-11'));
```

### TypeScript

```typescript
import { convert, HijriDate } from 'hijri';

const result: HijriDate = convert(new Date('2024-03-11'));
console.log(result.monthText); // 'رمضان'
```

## API Reference

### `convert(date, adjustment?)`

Converts a Gregorian date to Hijri calendar date.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | `Date` | Yes | JavaScript Date object to convert |
| `adjustment` | `number` | No | Day adjustment for moon sighting (default: 0) |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `dayOfWeekText` | `string` | Arabic weekday name |
| `dayOfWeek` | `number` | Day of week (1=Sunday, 7=Saturday) |
| `dayOfMonth` | `number` | Day of Hijri month (1-30) |
| `month` | `number` | Hijri month (1-12) |
| `monthText` | `string` | Arabic month name |
| `year` | `number` | Hijri year |

#### Example

```javascript
const hijri = require('hijri');

// Basic conversion
const result = hijri.convert(new Date('2024-03-11'));
console.log(result.dayOfMonth, result.monthText, result.year);
// Output: 1 رمضان 1445

// With adjustment for moon sighting
const adjusted = hijri.convert(new Date('2024-03-11'), -1);
console.log(adjusted.dayOfMonth, adjusted.monthText);
// Output: 30 شعبان
```

## Adjustment Parameter

The `adjustment` parameter is used for regional moon sighting differences. Different regions may observe the start of Islamic months on different days based on local moon sighting.

```javascript
const date = new Date('2024-01-15');

hijri.convert(date, 0);   // Standard calculation
hijri.convert(date, -1);  // 1 day earlier (e.g., Saudi Arabia)
hijri.convert(date, 1);   // 1 day later (e.g., some regions)
```

**Note:** The weekday (`dayOfWeek`, `dayOfWeekText`) remains unchanged regardless of adjustment. This is intentional - the adjustment shifts the Hijri date, not the actual day of the week.

## Hijri Month Names

| Number | Arabic | Transliteration |
|--------|--------|-----------------|
| 1 | المحرّم | Muharram |
| 2 | صفر | Safar |
| 3 | ربيع الأوّل | Rabi' al-Awwal |
| 4 | ربيع الآخر | Rabi' al-Thani |
| 5 | جمادى الأولى | Jumada al-Awwal |
| 6 | جمادى الآخرة | Jumada al-Thani |
| 7 | رجب | Rajab |
| 8 | شعبان | Sha'ban |
| 9 | رمضان | Ramadan |
| 10 | شوّال | Shawwal |
| 11 | ذو القعدة | Dhu al-Qi'dah |
| 12 | ذو الحجّة | Dhu al-Hijjah |

## Error Handling

The module validates inputs and throws clear errors:

```javascript
// TypeError for invalid date parameter
hijri.convert(null);
// Error: Expected date parameter to be a Date object, received object

hijri.convert('2024-01-15');
// Error: Expected date parameter to be a Date object, received string

// RangeError for invalid Date
hijri.convert(new Date('invalid'));
// Error: Invalid Date provided

// TypeError for invalid adjustment
hijri.convert(new Date(), 'one');
// Error: Expected adjustment parameter to be a number, received string
```

## Examples

See `example.js` for comprehensive usage examples:

```bash
node example.js
```

## Testing

```bash
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

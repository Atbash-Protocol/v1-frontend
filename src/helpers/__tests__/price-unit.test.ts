import { formatNumber, formatUSD, formatAPY } from 'helpers/price-units';

describe('formatUSD', () => {
    it.each([
        { value: 10, digits: 0, expected: '$10' },
        { value: 10, digits: 2, expected: '$10.00' },
    ])('formats with $value and $digits', ({ value, digits, expected }) => {
        expect(formatUSD(value, digits)).toEqual(expected);
    });
});

describe('formatNumber', () => {
    it.each([
        { value: 10.25, precision: 0, expected: '10' },
        { value: 10, precision: 0, expected: '10' },
        { value: 10.254, precision: 2, expected: '10.25' },
    ])('formats with $value and $precision', ({ value, precision, expected }) => {
        expect(formatNumber(value, precision)).toEqual(expected);
    });
});

describe('formatAPY', () => {
    it.each([
        { value: '10250000000000000000', expected: '> 1 000 000 %' },
        { value: '10', expected: '10 %' },
    ])('formats with $value and $precision', ({ value, expected }) => {
        expect(formatAPY(value)).toEqual(expected);
    });
});

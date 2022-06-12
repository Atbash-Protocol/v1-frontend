import { shorten } from 'helpers/shorten';

describe('shorten', () => {
    it('returns the string if length is below 10', () => {
        const str = 'abcdefghi';

        expect(shorten(str)).toEqual(str);
    });

    it('formats the string', () => {
        const bigString = 'abcdefghijklmnopq';

        expect(shorten(bigString)).toEqual(`abcdef...nopq`);
    });
});

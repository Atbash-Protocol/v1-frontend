import { BondItem } from 'store/modules/bonds/bonds.types';

import { selectBondReady } from './bonds';

describe('#selectBondReady', () => {
    it.each([
        { metrics: {}, expected: false },
        { metrics: { balance: null }, expected: false },
        { metrics: { balance: 1234 }, expected: true },
    ])('returns true if bonds are ready', ({ metrics, expected }) => {
        expect(selectBondReady({ metrics } as any)).toEqual(expected);
    });
});

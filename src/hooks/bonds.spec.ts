import { renderHook } from '@testing-library/react-hooks';

import { BondItem } from 'store/modules/bonds/bonds.types';

import { useBondPurchaseReady } from './bonds';

describe('#useBondPurchaseReady', () => {
    it.each([
        { metrics: {}, expected: false },
        { metrics: { balance: null }, expected: false },
        { metrics: { balance: 1234 }, expected: true },
    ])('returns true if bonds are ready', ({ metrics, expected }) => {
        expect(() => renderHook(() => useBondPurchaseReady())).toEqual(expected);
    });
});

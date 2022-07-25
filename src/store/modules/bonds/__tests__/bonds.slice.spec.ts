import { BigNumber, ethers } from 'ethers';

import BondReducer from '../bonds.slice';
import {
    approveBonds,
    calcBondDetails,
    calculateUserBondDetails,
    getBondMetrics,
    getBondTerms,
    getTreasuryBalance,
    initializeBonds,
    loadBondBalancesAndAllowances,
} from '../bonds.thunks';
import { BondSlice } from '../bonds.types';

describe('BondsReducer', () => {
    const initialState: BondSlice = {
        bonds: {},
        bondInstances: {},
        bondMetrics: {},
        coreMetrics: {
            // common metrics for all bonds
            rfv: 0,
            rfvTreasury: 0,
            runway: 0,
            deltaMarketPriceRfv: 0,
        },
        bondCalculator: null,
        treasuryBalance: null,
        loading: true,
        bondQuoting: false,
        bondQuote: {
            interestDue: null,
            bondMaturationBlock: null,
            pendingPayout: null,
        },
    };

    describe('#initializeBonds', () => {
        it('reduces fulfilled action', () => {
            const payload = { bondCalculator: jest.fn(), bondInstances: { dai: {} }, bondMetrics: { dai: {} } };
            const action = { type: initializeBonds.fulfilled, payload };
            const state = BondReducer(initialState, action);

            expect(state).toEqual({ ...initialState, ...payload });
        });
    });

    describe('#getTreasuryBalance', () => {
        it('reduces correctly', () => {
            const payload = { dai: 10 };
            const action = { type: getTreasuryBalance.fulfilled, payload };
            const state = BondReducer({ ...initialState, bondMetrics: { dai: { treasuryBalance: null } } } as any, action);

            expect(state).toEqual({ ...initialState, bondMetrics: { dai: { treasuryBalance: 10 } } });
        });
    });

    describe('#calcBondDetails', () => {
        it('computes pending', () => {
            const payload = { dai: 10 };
            const action = { type: calcBondDetails.pending, payload, meta: { arg: { bondID: 'dai' } } };
            const state = BondReducer({ ...initialState, bondMetrics: { dai: { loading: false } } } as any, action);

            expect(state).toEqual({ ...initialState, bondMetrics: { dai: { loading: true } } });
        });

        it('computes fullfilled', () => {
            const payload = { bondID: 'dai', treasuryBalance: 10 };
            const action = { type: calcBondDetails.fulfilled, payload, meta: { arg: { bondID: 'dai' } } };
            const state = BondReducer({ ...initialState, bondMetrics: { dai: { loading: false } } } as any, action);

            expect(state).toEqual({ ...initialState, bondMetrics: { dai: { treasuryBalance: 10, loading: false } } });
        });
    });

    describe('#getBondTerms', () => {
        it('computes fullfilled', () => {
            const payload = { terms: 10 };
            const action = { type: getBondTerms.fulfilled, payload, meta: { arg: 'dai' } };
            const state = BondReducer({ ...initialState, bondMetrics: { dai: { terms: null } } } as any, action);

            expect(state).toEqual({ ...initialState, bondMetrics: { dai: { terms: 10 } } });
        });
    });

    describe('#approveBonds', () => {
        it('computes fullfilled', () => {
            const payload = { allowance: BigNumber.from(10000) };
            const action = { type: approveBonds.fulfilled, payload, meta: { arg: { bondID: 'dai' } } };
            const state = BondReducer({ ...initialState, bondMetrics: { dai: { allowance: null } } } as any, action);

            expect(state).toEqual({ ...initialState, bondMetrics: { dai: { allowance: BigNumber.from(10000) } } });
        });
    });

    describe('#loadBondBalancesAndAllowances', () => {
        it('computes fullfilled', () => {
            const payload = { allowance: BigNumber.from(10000), balance: BigNumber.from(100) };
            const action = { type: loadBondBalancesAndAllowances.fulfilled, payload, meta: { arg: { bondID: 'dai' } } };
            const state = BondReducer({ ...initialState, bondMetrics: { dai: { allowance: null } } } as any, action);

            expect(state).toEqual({ ...initialState, bondMetrics: { dai: { allowance: BigNumber.from(10000), balance: BigNumber.from(100) } } });
        });
    });

    describe('#getBondMetrics', () => {
        it('computes fullfilled', () => {
            const payload = { rfv: BigNumber.from(10), rfvTreasury: BigNumber.from(50), runway: 20, deltaMarketPriceRfv: 30 };
            const action = { type: getBondMetrics.fulfilled, payload, meta: { arg: { bondID: 'dai' } } };
            const state = BondReducer(initialState, action);

            expect(state).toEqual({ ...initialState, coreMetrics: payload });
        });
    });

    describe('#calculateUserBondDetails', () => {
        it('computes pending', () => {
            const payload = {};
            const action = { type: calculateUserBondDetails.pending, payload, meta: { arg: { bondID: 'dai' } } };
            const state = BondReducer(initialState as any, action);

            expect(state).toEqual({ ...initialState, bondQuoting: true });
        });

        it('computes fullfilled', () => {
            const payload = { interestDue: 10, bondMaturationBlock: 10, pendingPayout: 10 };
            const action = { type: calculateUserBondDetails.fulfilled, payload, meta: { arg: { bondID: 'dai' } } };
            const state = BondReducer(initialState as any, action);

            expect(state).toEqual({ ...initialState, bondQuoting: false, bondQuote: payload });
        });
    });
});

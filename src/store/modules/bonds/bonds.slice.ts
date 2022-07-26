import { createSlice } from '@reduxjs/toolkit';

import {
    approveBonds,
    calcBondDetails,
    calculateUserBondDetails,
    getBondTerms,
    initializeBonds,
    loadBondBalancesAndAllowances,
    getTreasuryBalance,
    getBondMetrics,
} from './bonds.thunks';
import { BondSlice } from './bonds.types';

// Define the initial state using that type
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

export const BondSlices = createSlice({
    name: 'app-bonds',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(initializeBonds.fulfilled, (state, { payload: { bondCalculator, bondMetrics, bondInstances } }) => {
            return {
                ...state,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                bondCalculator: bondCalculator as any,
                bondInstances,
                bondMetrics,
            };
        });

        builder.addCase(getTreasuryBalance.fulfilled, (state, action) => {
            for (const [bondID, treasury] of Object.entries(action.payload)) {
                state.bondMetrics[bondID].treasuryBalance = treasury as number;
            }
        });

        builder.addCase(
            calcBondDetails.pending,
            (
                state,
                {
                    meta: {
                        arg: { bondID },
                    },
                },
            ) => {
                state.bondMetrics[bondID].loading = true;
            },
        );

        builder.addCase(calcBondDetails.fulfilled, (state, { payload: { bondID, ...metrics } }) => {
            return {
                ...state,
                bondMetrics: {
                    ...state.bondMetrics,
                    [bondID]: {
                        ...state.bondMetrics[bondID],
                        ...metrics,
                        loading: false,
                    },
                },
            };
        });

        builder.addCase(getBondTerms.fulfilled, (state, { payload, meta: { arg: bondID } }) => {
            state.bondMetrics[bondID].terms = payload.terms;
        });

        builder.addCase(approveBonds.fulfilled, (state, { payload, meta }) => {
            state.bondMetrics[meta.arg.bondID].allowance = payload?.allowance ?? null;
        });

        builder.addCase(
            loadBondBalancesAndAllowances.fulfilled,
            (
                state,
                {
                    payload,
                    meta: {
                        arg: { bondID },
                    },
                },
            ) => {
                state.bondMetrics[bondID].allowance = payload.allowance;
                state.bondMetrics[bondID].balance = payload.balance;
            },
        );

        builder.addCase(calculateUserBondDetails.pending, (state, {}) => {
            state.bondQuote = {
                interestDue: null,
                bondMaturationBlock: null,
                pendingPayout: null,
            };
            state.bondQuoting = true;
        });
        builder.addCase(calculateUserBondDetails.fulfilled, (state, { payload }) => {
            state.bondQuote = payload;
            state.bondQuoting = false;
        });

        builder.addCase(getBondMetrics.fulfilled, (state, { payload }) => {
            state.coreMetrics.rfv = payload.rfv;
            state.coreMetrics.rfvTreasury = payload.rfvTreasury;
            state.coreMetrics.runway = payload.runway;
            state.coreMetrics.deltaMarketPriceRfv = payload.deltaMarketPriceRfv;
        });
    },
});

export default BondSlices.reducer;

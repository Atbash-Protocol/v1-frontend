import { createSlice } from '@reduxjs/toolkit';

import { isActionRejected } from 'store/utils/action';

import { approveBonds, calcBondDetails, calculateUserBondDetails, getBondTerms, getTreasuryBalance, initializeBonds, loadBondBalancesAndAllowances } from './bonds.thunks';
import { BondSlice } from './bonds.types';

// Define the initial state using that type
const initialState: BondSlice = {
    bonds: {},
    bondInstances: {},
    bondMetrics: {},
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
                bondCalculator,
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
                // console.log('here2', bond.bond.ID);
                // state
                state.bondMetrics[bondID].loading = true;
            },
        );

        builder.addCase(calcBondDetails.fulfilled, (state, { payload: { bondID, ...metrics } }) => {
            // state.bonds[bondID].metrics = { ...state.bonds[bondID].metrics, ...metrics };

            console.log('details', metrics, state.bondMetrics[bondID]);
            state.bondMetrics[bondID] = {
                ...state.bondMetrics[bondID],
                ...metrics,
                loading: false,
            };
            // return state;
        });

        builder.addCase(calcBondDetails.rejected, (state, action) => {
            console.log('here', action, state);
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
                console.log('here the slice', payload);
                state.bondMetrics[bondID].allowance = payload.allowance;
                state.bondMetrics[bondID].balance = payload.balance;

                // return state;
            },
        );

        builder.addCase(loadBondBalancesAndAllowances.rejected, (_, action) => {
            console.log('action', action);
        });

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

        builder.addMatcher(isActionRejected, (state, action) => {
            console.log('Reject', state, action);
        });
    },
});

export default BondSlices.reducer;

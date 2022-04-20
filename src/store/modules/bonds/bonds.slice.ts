import { ActionTypes } from "@mui/base";
import { createSlice } from "@reduxjs/toolkit";
import bond from "helpers/bond";
import { useSelector } from "react-redux";
import { approveBonds, calcBondDetails, getBondTerms, getTreasuryBalance, initializeBonds, loadBondBalancesAndAllowances } from "./bonds.thunks";
import { BondSlice } from "./bonds.types";

// Define the initial state using that type
const initialState: BondSlice = {
    bonds: {},
    bondCalculator: null,
    treasuryBalance: null,
    loading: true,
};

export const BondSlices = createSlice({
    name: "app-bonds",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(initializeBonds.fulfilled, (state, { payload: { bondCalculator, bonds } }) => {
            return {
                ...state,
                bondCalculator,
                bonds,
            };
        });

        builder.addCase(getTreasuryBalance.fulfilled, (state, action) => {
            state.treasuryBalance = action.payload.balance;
        });

        builder.addCase(calcBondDetails.pending, (state, { meta: { arg: bond } }) => {
            state.bonds[bond.bond.ID].metrics.loading = true;
        });

        builder.addCase(calcBondDetails.fulfilled, (state, { payload: { bondID, ...metrics } }) => {
            state.bonds[bondID].metrics = { ...state.bonds[bondID].metrics, ...metrics };
            state.loading = false;
            return state;
        });

        builder.addCase(getBondTerms.fulfilled, (state, { payload, meta: { arg: bond } }) => {
            state.bonds[bond.bondInstance.ID].metrics.vestingTerm = payload.terms;

            return state;
        });

        builder.addCase(approveBonds.fulfilled, (state, { payload, meta }) => {
            state.bonds[meta.arg.bond.bondInstance.ID].metrics.allowance = payload?.allowance ?? null;

            return state;
        });

        builder.addCase(loadBondBalancesAndAllowances.fulfilled, (state, { payload }) => {
            for (const bond of payload) {
                state.bonds[bond.ID].metrics.allowance = bond.allowance;
                state.bonds[bond.ID].metrics.balance = bond.balance;
            }

            return state;
        });
    },
});

export default BondSlices.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { calcBondDetails, getTreasuryBalance, initializeBonds } from "./bonds.thunks";
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

        builder.addCase(calcBondDetails.fulfilled, (state, { payload: { bond, ...metrics } }) => {
            state.bonds[bond.ID].metrics = { ...state.bonds[bond.ID].metrics, ...metrics };
            return state;
        });
    },
});

export default BondSlices.reducer;

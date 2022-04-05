import { createSlice } from "@reduxjs/toolkit";
import { loadBalancesAndAllowances } from "./account.thunks";
import { AccountSlice } from "./account.types";

const initialState: AccountSlice = {
    balances: {
        BASH: 0,
        SBASH: 0,
    },
    stakingAllowance: {
        BASH: 0,
        SBASH: 0,
    },
    loading: true,
};

export const marketSlice = createSlice({
    name: "account-slice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(loadBalancesAndAllowances.fulfilled, (state, action) => {
            return {
                ...state,
                ...action.payload,
                loading: false,
            };
        });
        builder.addCase(loadBalancesAndAllowances.rejected, (state, action) => {
            console.error("ERR", action);
            return {
                ...state,
                loading: false,
            };
        });
    },
});

export default marketSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { BigNumber } from "ethers";
import { loadBalancesAndAllowances } from "./account.thunks";
import { AccountSlice } from "./account.types";

const initialState: AccountSlice = {
    balances: {
        BASH: BigNumber.from(0),
        SBASH: BigNumber.from(0),
        WSBASH: BigNumber.from(0),
    },
    stakingAllowance: {
        BASH: BigNumber.from(0),
        SBASH: BigNumber.from(0),
    },
    loading: true,
};

export const marketSlice = createSlice({
    name: "app-account-slice",
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
            return {
                ...state,
                loading: false,
            };
        });
    },
});

export default marketSlice.reducer;

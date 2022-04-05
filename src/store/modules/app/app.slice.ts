import { JsonRpcProvider } from "@ethersproject/providers";
import { createSlice } from "@reduxjs/toolkit";
import { isActionRejected } from "store/utils/action";

import { initializeProviderContracts, getBlockchainData, getCoreMetrics, getStakingMetrics } from "./app.thunks";
import { ContractEnum, MainSliceState } from "./app.types";

// Define the initial state using that type
const initialState: MainSliceState = {
    contracts: {
        [ContractEnum.BASH]: null,
        [ContractEnum.SBASH_ADDRESS]: null,
        [ContractEnum.DAI_ADDRESS]: null,
        [ContractEnum.INITIAL_PAIR_ADDRESS]: null,
        [ContractEnum.STAKING_ADDRESS]: null,
        [ContractEnum.REDEEM_ADDRESS]: null,
    },
    metrics: {
        circSupply: null,
        totalSupply: null,
        reserves: null,
    },
    staking: {
        epoch: null,
        secondsToNextEpoch: null,
        index: null,
    },
    blockchain: {
        timestamp: null,
        currentBlock: null,
    },
    errorEncountered: false,
    loading: true,
};

export const MainSlice = createSlice({
    name: "app-main",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(initializeProviderContracts.fulfilled, (state, action) => {
                return { ...state, contracts: action.payload };
            })
            .addCase(getBlockchainData.fulfilled, (state, action) => {
                return {
                    ...state,
                    blockchain: action.payload,
                    loading: false,
                };
            })
            .addCase(getCoreMetrics.fulfilled, (state, action) => {
                return {
                    ...state,
                    metrics: action.payload,
                    loading: false,
                };
            })
            .addCase(getStakingMetrics.fulfilled, (state, action) => {
                return {
                    ...state,
                    staking: action.payload,
                    loading: false,
                };
            })
            .addMatcher(isActionRejected, (state, action) => {
                console.error(action.error); //critial error

                state.errorEncountered = true;
            });
    },
});

export const selectContracts = (state: MainSliceState) => state.contracts;

export default MainSlice.reducer;

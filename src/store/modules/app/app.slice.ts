import { JsonRpcProvider } from "@ethersproject/providers";
import { createSlice } from "@reduxjs/toolkit";
import { isActionRejected } from "store/utils/action";

import { initializeProviderContracts } from "./app.helpers";
import { getBlockchainData, getCoreMetrics, getStakingMetrics } from "./app.thunks";
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
    reducers: {
        initializeContracts: {
            prepare: ({ networkID, provider }: { networkID: number; provider: JsonRpcProvider }) => {
                return {
                    payload: initializeProviderContracts({ networkID, provider }),
                };
            },
            reducer: (state, { payload }) => {
                state.contracts = { ...state.contracts, ...payload };
            },
        },
        after: (state, action) => {
            console.log("after the slice", state, action);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getBlockchainData.fulfilled, (state, action) => {
                state.blockchain = action.payload;
            })
            .addCase(getCoreMetrics.fulfilled, (state, action) => {
                state.metrics = action.payload;
            })
            .addCase(getStakingMetrics.fulfilled, (state, action) => {
                state.staking = action.payload;
                state.loading = false;
            })
            .addMatcher(isActionRejected, (state, action) => {
                console.error(action.error); //critial error

                state.errorEncountered = true;
            });
    },
});

export const { initializeContracts } = MainSlice.actions;

export const selectContracts = (state: MainSliceState) => state.contracts;

export default MainSlice.reducer;

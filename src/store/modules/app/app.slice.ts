import { createSlice } from '@reduxjs/toolkit';

import { isActionRejected } from 'store/utils/action';

import { initializeProviderContracts, getBlockchainData, getCoreMetrics, getStakingMetrics } from './app.thunks';
import { ContractEnum, MainSliceState } from './app.types';

// Define the initial state using that type
const initialState: MainSliceState = {
    contracts: {
        [ContractEnum.BASH_CONTRACT]: null,
        [ContractEnum.SBASH_CONTRACT]: null,
        [ContractEnum.DAI_ADDRESS]: null,
        [ContractEnum.INITIAL_PAIR_ADDRESS]: null,
        [ContractEnum.STAKING_ADDRESS]: null,
        [ContractEnum.STAKING_HELPER_ADDRESS]: null,
        [ContractEnum.WSBASH_ADDRESS]: null,
        [ContractEnum.ZAPIN_ADDRESS]: null,
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
    contractsLoaded: false,
};

export const MainSlice = createSlice({
    name: 'app-main',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(initializeProviderContracts.pending, (state, action) => {
                return { ...state, contractsLoaded: false };
            })
            .addCase(initializeProviderContracts.fulfilled, (state, action) => {
                return { ...state, contracts: action.payload, contractsLoaded: true };
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
                if (action.type.startsWith('app/')) state.errorEncountered = true;
            });
    },
});

export const selectContracts = (state: MainSliceState) => state.contracts;

export default MainSlice.reducer;

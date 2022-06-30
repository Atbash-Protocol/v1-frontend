import { createSlice } from '@reduxjs/toolkit';

import { isActionRejected } from 'store/utils/action';

import { initializeProviderContracts, getBlockchainData, getCoreMetrics, getStakingMetrics } from './app.thunks';
import { ContractEnum, MainSliceState } from './app.types';

// Define the initial state using that type
const initialState: MainSliceState = {
    contracts: {
        [ContractEnum.BASH_CONTRACT]: null,
        [ContractEnum.SBASH_CONTRACT]: null,
        [ContractEnum.DAI_CONTRACT]: null,
        [ContractEnum.BASH_DAI_LP_ADDRESS]: null,
        [ContractEnum.STAKING_CONTRACT]: null,
        [ContractEnum.STAKING_HELPER_ADDRESS]: null,
        [ContractEnum.WSBASH_ADDRESS]: null,
        [ContractEnum.ZAPIN_ADDRESS]: null,
        [ContractEnum.REDEEM_CONTRACT]: null,
    },
    contractsLoaded: false,

    metrics: {
        circSupply: null,
        rawCircSupply: null,
        totalSupply: null,
        reserves: null,
        loading: true,
    },
    staking: {
        epoch: null,
        secondsToNextEpoch: null,
        index: null,
        loading: true,
    },
    blockchain: {
        timestamp: null,
        currentBlock: null,
        loading: true,
    },
    errorEncountered: false,
    loading: true,
};

export const MainSlice = createSlice({
    name: 'app-main',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(initializeProviderContracts.pending, state => {
                return { ...state, contractsLoaded: false };
            })
            .addCase(initializeProviderContracts.fulfilled, (state, action) => {
                return { ...state, contracts: action.payload, contractsLoaded: true };
            })
            .addCase(getBlockchainData.fulfilled, (state, action) => {
                return {
                    ...state,
                    blockchain: {
                        ...action.payload,
                        loading: false,
                    },
                };
            })
            .addCase(getCoreMetrics.fulfilled, (state, action) => {
                return {
                    ...state,
                    metrics: {
                        ...action.payload,
                        loading: false,
                    },
                };
            })
            .addCase(getStakingMetrics.fulfilled, (state, action) => {
                return {
                    ...state,
                    staking: {
                        ...action.payload,
                        loading: false,
                    },
                };
            })
            .addMatcher(isActionRejected, (state, action) => {
                if (action.type.startsWith('app/')) state.errorEncountered = true;
            });
    },
});

export const selectContracts = (state: MainSliceState) => state.contracts;

export default MainSlice.reducer;

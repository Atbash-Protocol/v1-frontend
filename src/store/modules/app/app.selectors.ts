import { ethers } from 'ethers';

import { formatUSD } from 'helpers/price-units';
import { RootState } from 'store/store';

import { MainSliceState } from './app.types';

export const selectFormattedReservePrice = (state: RootState): string | null => {
    const { reserves } = state.main.metrics;
    const { dai } = state.markets.markets;

    if (!reserves || !dai) return null;

    const reservePrice = Number(ethers.utils.formatUnits(reserves, 'gwei')) * dai;

    return formatUSD(reservePrice, 2);
};

export const useContractLoaded = (state: RootState): boolean => {
    const { contracts } = state.main;

    return Object.values(contracts).every(contract => contract !== null);
};

export const useNextRebase = (state: RootState): number | undefined => {
    const {
        main: {
            staking: { epoch },
        },
    } = state;

    return epoch?.endTime;
};

export const useBlockchainInfos = (state: RootState): MainSliceState['blockchain'] => {
    return state.main.blockchain;
};

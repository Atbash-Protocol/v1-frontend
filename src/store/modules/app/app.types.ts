import { Contract, ethers } from 'ethers';

export enum ContractEnum {
    BASH_CONTRACT = 'BASH_CONTRACT',
    SBASH_CONTRACT = 'SBASH_CONTRACT',
    WSBASH_ADDRESS = 'WSBASH_ADDRESS',
    DAI_ADDRESS = 'DAI_ADDRESS',
    STAKING_ADDRESS = 'STAKING_ADDRESS',
    STAKING_HELPER_ADDRESS = 'STAKING_HELPER_ADDRESS',
    INITIAL_PAIR_ADDRESS = 'INITIAL_PAIR_ADDRESS',
    REDEEM_ADDRESS = 'REDEEM_ADDRESS',
    ZAPIN_ADDRESS = 'ZAPIN_ADDRESS',
}

export interface Epoch {
    distribute: number;
    endTime: number;
}

export interface MainSliceState {
    contracts: { [key in ContractEnum]: Contract | null };
    metrics: {
        totalSupply: number | null;
        circSupply: number | null;
        reserves: ethers.BigNumber | null;
    };
    staking: {
        epoch: Epoch | null;
        secondsToNextEpoch: number | null;
        index: number | null;
    };
    blockchain: {
        currentBlock: number | null;
        timestamp: number | null;
    };
    errorEncountered: boolean; // Flag to prevent page loading
    loading: boolean;
    contractsLoaded: boolean;
}

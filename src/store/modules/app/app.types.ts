import { Contract, ethers } from 'ethers';

export enum ContractEnum {
    BASH_CONTRACT = 'BASH_CONTRACT',
    SBASH_CONTRACT = 'SBASH_CONTRACT',
    WSBASH_ADDRESS = 'WSBASH_ADDRESS',
    DAI_ADDRESS = 'DAI_ADDRESS',
    STAKING_CONTRACT = 'STAKING_CONTRACT',
    STAKING_HELPER_ADDRESS = 'STAKING_HELPER_ADDRESS',
    INITIAL_PAIR_ADDRESS = 'INITIAL_PAIR_ADDRESS',
    REDEEM_ADDRESS = 'REDEEM_ADDRESS',
    ZAPIN_ADDRESS = 'ZAPIN_ADDRESS',
}

export interface Epoch {
    distribute: ethers.BigNumber;
    endTime: number;
    number: ethers.BigNumber;
}

export interface MainSliceState {
    contracts: { [key in ContractEnum]: Contract | null };
    contractsLoaded: boolean;
    metrics: {
        totalSupply: number | null;
        circSupply: number | null;
        rawCircSupply: ethers.BigNumber | null;
        reserves: ethers.BigNumber | null;
        loading: boolean;
    };
    staking: {
        epoch: Epoch | null;
        secondsToNextEpoch: number | null;
        index: ethers.BigNumber | null;
        loading: boolean;
    };
    blockchain: {
        currentBlock: number | null;
        timestamp: number | null;
        loading: boolean;
    };
    errorEncountered: boolean; // Flag to prevent page loading
    loading: boolean;
}

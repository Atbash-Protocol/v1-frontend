import { Contract, ethers } from 'ethers';

export enum ContractEnum {
    BASH_CONTRACT = 'BASH_CONTRACT',
    SBASH_CONTRACT = 'SBASH_CONTRACT',
    WSBASH_CONTRACT = 'WSBASH_CONTRACT',
    DAI_CONTRACT = 'DAI_CONTRACT',
    STAKING_CONTRACT = 'STAKING_CONTRACT',
    STAKING_HELPER_CONTRACT = 'STAKING_HELPER_CONTRACT',
    BASH_DAI_LP_CONTRACT = 'BASH_DAI_LP_CONTRACT',
    REDEEM_CONTRACT = 'REDEEM_CONTRACT',
    ZAPING_CONTRACT = 'ZAPING_CONTRACT',
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

import { Contract, ethers } from "ethers";

export enum ContractEnum {
    BASH = "BASH",
    SBASH_ADDRESS = "SBASH_ADDRESS",
    DAI_ADDRESS = "DAI_ADDRESS",
    STAKING_ADDRESS = "STAKING_ADDRESS",
    INITIAL_PAIR_ADDRESS = "INITIAL_PAIR_ADDRESS",
    REDEEM_ADDRESS = "REDEEM_ADDRESS",
}

export interface Epoch {
    distribute: number;
    endTime: number;
}

export interface MainSliceState {
    contracts: { [key in ContractEnum]?: Contract | null };
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
}

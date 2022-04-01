import { JsonRpcProvider } from "@ethersproject/providers";
import { StakingContract, LpReserveContract, RedeemContract, MemoTokenContract, TimeTokenContract } from "abi";
import { getAddresses } from "constants/addresses";
import { Contract } from "ethers";
import { ContractEnum, Epoch } from "./app.types";

export const initializeProviderContracts = ({ networkID, provider }: { networkID: number; provider: JsonRpcProvider }): { [key in ContractEnum]?: Contract } => {
    const addresses = getAddresses(networkID);

    return {
        [ContractEnum.STAKING_ADDRESS]: new Contract(addresses.STAKING_ADDRESS, StakingContract, provider),
        [ContractEnum.INITIAL_PAIR_ADDRESS]: new Contract(addresses.INITIAL_PAIR_ADDRESS, LpReserveContract, provider),
        [ContractEnum.REDEEM_ADDRESS]: new Contract(addresses.REDEEM_ADDRESS, RedeemContract, provider),
        [ContractEnum.SBASH_ADDRESS]: new Contract(addresses.SBASH_ADDRESS, MemoTokenContract, provider),
        [ContractEnum.BASH]: new Contract(addresses.BASH_ADDRESS, TimeTokenContract, provider),
        [ContractEnum.DAI_ADDRESS]: new Contract(addresses.DAI_ADDRESS, TimeTokenContract, provider),
    };
};

export const calculateStakingRewards = (epoch: Epoch, circSupply: number) => {
    const stakingReward = epoch.distribute; // the amount of BASH to distribute in the coming epoch
    const stakingRebase = stakingReward / circSupply; // rewardYield rate for this epoch
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1; // 3 epoch/day
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1 * 100;

    return {
        fiveDayRate,
        stakingAPY,
    };
};

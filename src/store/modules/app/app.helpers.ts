import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { StakingContract, LpReserveContract, RedeemContract, MemoTokenContract, TimeTokenContract } from "abi";
import { getAddresses } from "constants/addresses";
import { Contract } from "ethers";
import { ContractEnum, Epoch } from "./app.types";

export const calculateStakingRewards = (epoch: Epoch | null, circSupply: number) => {
    const stakingReward = epoch ? epoch.distribute : null; // the amount of BASH to distribute in the coming epoch
    const stakingRebase = stakingReward ? stakingReward / circSupply : null; // rewardYield rate for this epoch

    return {
        fiveDayRate: stakingRebase ? Math.pow(1 + stakingRebase, 5 * 3) - 1 : null, // 3 epoch/day
        stakingAPY: stakingRebase ? Math.pow(1 + stakingRebase, 365 * 3) - 1 * 100 : null,
    };
};

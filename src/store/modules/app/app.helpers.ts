import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { StakingContract, LpReserveContract, RedeemContract, MemoTokenContract, TimeTokenContract } from "abi";
import { getAddresses } from "constants/addresses";
import { Contract } from "ethers";
import { ContractEnum, Epoch } from "./app.types";

// '{"epoch":[{"type":"BigNumber","hex":"0x0e"},{"type":"BigNumber","hex":"0x6fcb97510c"},2880,1645556788],"circ":{"type":"BigNumber","hex":"0x05808845f35c"},"fiveDayRate":2.1445277855884237,"stakingAPY":2.0967510564325655e+36}'

export const calculateStakingRewards = (epoch: Epoch | null, circSupply: number) => {
    const stakingReward = epoch ? epoch.distribute : null; // the amount of BASH to distribute in the coming epoch
    const stakingRebase = stakingReward ? stakingReward / (circSupply * Math.pow(10, 9)) : null; // rewardYield rate for this epoch

    console.log(epoch, circSupply, stakingRebase);
    console.log(stakingRebase ? Math.pow(1 + stakingRebase, 365 * 3) - 1 * 100 : null);

    return {
        fiveDayRate: stakingRebase ? Math.pow(1 + stakingRebase, 5 * 3) - 1 : null, // 3 epoch/day
        stakingAPY: stakingRebase ? Math.pow(1 + stakingRebase, 365 * 3) - 1 * 100 : null,
        stakingReward,
        stakingRebase,
    };
};

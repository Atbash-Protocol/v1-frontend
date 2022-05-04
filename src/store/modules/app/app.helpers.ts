import { Epoch } from './app.types';

export const calculateStakingRewards = (epoch: Epoch | null, circSupply: number) => {
    const stakingReward = epoch ? epoch.distribute : null; // the amount of BASH to distribute in the coming epoch
    const stakingRebase = stakingReward ? stakingReward.toNumber() / (circSupply * Math.pow(10, 9)) : null; // rewardYield rate for this epoch

    return {
        fiveDayRate: stakingRebase ? Math.pow(1 + stakingRebase, 5 * 3) - 1 : null, // 3 epoch/day
        stakingAPY: stakingRebase ? Math.pow(1 + stakingRebase, 365 * 3) - 1 * 100 : null,
        stakingReward,
        stakingRebase,
    };
};

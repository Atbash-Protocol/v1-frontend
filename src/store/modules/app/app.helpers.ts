import Decimal from 'decimal.js';

import { Epoch } from './app.types';

export const calculateStakingRewards = (epoch: Epoch | null, circSupply: number) => {
    const stakingReward = new Decimal(epoch?.distribute.toString() || 0); // the amount of BASH to distribute in the coming epoch
    const stakingRebase = stakingReward.div(new Decimal(circSupply).mul(10 ** 9)); // rewardYield rate for this epoch

    return {
        fiveDayRate: stakingRebase ? Math.pow(1 + stakingRebase.toNumber(), 5 * 3) - 1 : null, // 3 epoch/day
        stakingAPY: stakingRebase ? Math.pow(1 + stakingRebase.toNumber(), 365 * 3) - 1 * 100 : null,
        stakingReward,
        stakingRebase,
    };
};

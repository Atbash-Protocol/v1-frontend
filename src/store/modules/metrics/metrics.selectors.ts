import { sum } from 'lodash';

import { formatUSD } from 'helpers/price-units';
import { RootState } from 'store/store';

import { StakingRewards } from './metrics.types';

export const selectStakingRewards = (state: RootState): StakingRewards | null => {
    const { epoch } = state.main.staking;
    const { circSupply } = state.main.metrics;

    if (!circSupply || !epoch) return null;

    const stakingReward = epoch.distribute; // the amount of BASH to distribute in the coming epoch
    const stakingRebase = stakingReward / (circSupply * Math.pow(10, 9)); // rewardYield rate for this epoch

    return {
        fiveDayRate: Math.pow(1 + stakingRebase, 5 * 3) - 1, // 3 epoch/day
        stakingAPY: Math.pow(1 + stakingRebase, 365 * 3) - 1 * 100,
        stakingReward,
        stakingRebase,
    };
};

export const selectTVL = (state: RootState): number | null => {
    const { circSupply } = state.main.metrics;
    const { dai } = state.markets.markets;

    if (!circSupply || !dai) return null;

    return circSupply * dai;
};

export const selectTotalBalance = (state: RootState): number | null => {
    const { dai } = state.markets.markets;
    const balances = state.accountNew.balances;

    if (!dai) return null;

    return sum(Object.values(balances).map(balance => balance.div(10 ** 9).toNumber())) * dai;
};

export const selectFormattedMarketCap = (state: RootState): string | null => {
    const { totalSupply } = state.main.metrics;
    const { dai } = state.markets.markets;

    if (!totalSupply || !dai) return null;

    return formatUSD(totalSupply! * dai, 2);
};

export const selectWSBASHPrice = (state: RootState): string | null => {
    const { dai } = state.markets.markets;
    const { index } = state.main.staking;

    if (!dai || !index) return null;

    return formatUSD((index / 10 ** 9) * dai, 2);
};

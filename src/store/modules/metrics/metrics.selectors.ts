import { createSelector } from '@reduxjs/toolkit';
import Decimal from 'decimal.js';

import { formatUSD, formatUSDFromDecimal } from 'helpers/price-units';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';

export const selectCircSupply = (state: IReduxState) => state.main.metrics.circSupply;
export const selectStakingReward = (state: IReduxState) => state.main.staking.epoch?.distribute || null;

export const selectStakingRebaseAmount = createSelector([selectStakingReward, selectCircSupply], (stakingReward, circSupply) => {
    if (!circSupply || !stakingReward) return null;

    return new Decimal(stakingReward.toString()).div(new Decimal(circSupply).mul(10 ** 9)); // rewardYield rate for this epoch
});

export const selectStakingRewards = createSelector([selectStakingRebaseAmount], stakingRebase => {
    if (stakingRebase === null) return null;

    return {
        fiveDayRate: Decimal.pow(stakingRebase.add(1), 18).minus(1).toNumber(), // 3 epoch/day
        stakingAPY: Decimal.pow(stakingRebase.add(1), 365 * 3)
            .minus(1)
            .toNumber(),
        stakingReward: stakingRebase.toNumber(),
        stakingRebase,
    };
});

export const selectTVL = (state: RootState): number | null => {
    const { circSupply } = state.main.metrics;
    const { dai } = state.markets.markets;

    if (!circSupply || !dai) return null;

    return circSupply * dai;
};

export const selectTotalBalance = (state: RootState): string => {
    const { dai } = state.markets.markets;
    const balances = state.account.balances;

    const total = Decimal.sum(
        ...Object.values(balances).map(balance =>
            new Decimal(balance.toString())
                .div(10 ** 9)
                .mul(dai ?? 0)
                .toNumber(),
        ),
    );

    return formatUSDFromDecimal(total, 2);
};

export const selectFormattedMarketCap = (state: RootState): string | null => {
    const { totalSupply } = state.main.metrics;
    const { dai } = state.markets.markets;

    if (!totalSupply || !dai) return null;

    return formatUSD(totalSupply * dai, 2);
};

export const selectWSBASHPrice = (state: RootState): string | null => {
    const { dai } = state.markets.markets;
    const { index } = state.main.staking;

    if (!dai || !index) return null;

    return formatUSD((index.toNumber() / 10 ** 9) * dai, 2);
};

import { createSelector } from '@reduxjs/toolkit';
import Decimal from 'decimal.js';

import { formatUSD, formatUSDFromDecimal } from 'helpers/price-units';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';

import { selectCirculatingSupply } from '../app/app.selectors';
import { selectMarketPrice } from '../markets/markets.selectors';
import { selectIndex } from '../stake/stake.selectors';

export const selectRawCircSupply = (state: IReduxState) => state.main.metrics.rawCircSupply;
export const selectStakingReward = (state: IReduxState) => state.main.staking.epoch?.distribute || null;
export const selectMetricsLoading = (state: IReduxState) => state.main.metrics.loading;

export const selectStakingRebaseAmount = createSelector([selectStakingReward, selectRawCircSupply], (stakingReward, rawCircSupply) => {
    if (!rawCircSupply || !stakingReward) return null;

    return new Decimal(stakingReward.toString()).div(new Decimal(rawCircSupply.toString())); // rewardYield rate for this epoch
});

export const selectStakingRebasePercentage = createSelector([selectStakingRebaseAmount], amount => {
    return (amount || new Decimal(0)).mul(100);
});

export const selectStakingRewards = createSelector([selectStakingRebaseAmount], stakingRebase => {
    if (stakingRebase === null) return null;

    const fiveDayRate = Number(Math.pow(1 + stakingRebase.toNumber(), 5 * 3).toFixed(5)) - 1;
    const stakingAPY = Number(Decimal.pow(stakingRebase.add(1), 365 * 3).toFixed(5)) - 1;

    return {
        fiveDayRate, // 3 epoch/day
        stakingAPY,
        stakingReward: stakingRebase.toNumber(),
        stakingRebase,
    };
});

export const selectTVL = createSelector([selectCirculatingSupply, selectMarketPrice], (circSupply, marketPrice) => {
    if (!circSupply || !marketPrice) return null;

    return new Decimal(circSupply.toString()).mul(new Decimal(marketPrice.toString()).div(Math.pow(10, 9)));
});

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
    const { totalSupply, reserves } = state.main.metrics;

    if (!totalSupply || !reserves) return null;

    return formatUSD(totalSupply * reserves.div(10 ** 9).toNumber(), 2);
};

export const selectWSBASHPrice = createSelector([selectIndex, selectMarketPrice], (index, marketPrice) => {
    if (!marketPrice || !index) return null;

    const wsBashPrice = new Decimal(index.toString()).mul(marketPrice).div(10 ** 18);

    return formatUSDFromDecimal(wsBashPrice, 2);
});

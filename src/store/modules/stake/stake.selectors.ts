import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import { createSelector } from 'reselect';

import { formatNumber, formatUSD, formatUSDFromDecimal } from 'helpers/price-units';
import { RootState } from 'store/store';

import { selectSBASHBalance, selectWSBASHBalance } from '../account/account.selectors';
import { selectReserve } from '../app/app.selectors';
import { selectDaiPrice } from '../markets/markets.selectors';
import { selectStakingRebaseAmount, selectStakingReward } from '../metrics/metrics.selectors';

const selectIndex = (state: RootState) => state.main.staking.index;

export const selectFormattedIndex = (state: RootState): string | null => {
    const { index } = state.main.staking;

    if (!index) return null;

    const formattedIndex = Number(ethers.utils.formatUnits(index, 'gwei'));

    return `${formatNumber(formattedIndex, 2)} BASH`;
};

export const selectStakingBalance = createSelector(
    [selectWSBASHBalance, selectStakingReward, selectIndex, selectStakingRebaseAmount, selectDaiPrice, selectReserve],
    (WSBASHBalance, stakingReward, index, stakingRebaseAmount, daiPrice, reserve) => {
        const nextRewardValue = !stakingRebaseAmount || !index ? new Decimal(0) : stakingRebaseAmount.mul(new Decimal(index.toString()));
        const wrappedTokenEquivalent = WSBASHBalance.mul(new Decimal((index ?? 0).toString()));

        const effectiveNextRewardValue = new Decimal((stakingReward ?? 0).toString()).mul(wrappedTokenEquivalent).add(nextRewardValue).mul(daiPrice);

        return {
            nextRewardValue: formatUSDFromDecimal(nextRewardValue.mul(reserve)),
            wrappedTokenValue: formatUSDFromDecimal(wrappedTokenEquivalent.mul((index ?? 0).toString()).mul(daiPrice), 2),
            effectiveNextRewardValue: formatUSDFromDecimal(effectiveNextRewardValue, 2),
        };
    },
);

import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import { createSelector } from 'reselect';

import { formatNumber, formatUSDFromDecimal } from 'helpers/price-units';
import { RootState } from 'store/store';

import { selectSBASHBalance, selectWSBASHBalance } from '../account/account.selectors';
import { selectMarketPrice } from '../markets/markets.selectors';

export const selectIndex = (state: RootState) => state.main.staking.index;

export const selectFormattedIndex = (state: RootState): string | null => {
    const { index } = state.main.staking;

    if (!index) return null;

    const formattedIndex = Number(ethers.utils.formatUnits(index, 'gwei'));

    return `${formatNumber(formattedIndex, 2)} BASH`;
};

// Could be refactored
export const selectRawCircSupply = (state: RootState) => state.main.metrics.rawCircSupply;

export const selectStakingReward = (state: RootState) => state.main.staking.epoch?.distribute || null;
export const selectStakingRebaseAmount = createSelector([selectStakingReward, selectRawCircSupply], (stakingReward, rawCircSupply) => {
    if (!rawCircSupply || !stakingReward) return null;

    return new Decimal(stakingReward.toString()).div(new Decimal(rawCircSupply.toString())); // rewardYield rate for this epoch
});

export const selectStakingBalance = createSelector(
    [selectWSBASHBalance, selectIndex, selectStakingRebaseAmount, selectMarketPrice, selectSBASHBalance],
    (WSBASHBalance, index, stakingRebaseAmount, marketPrice, SBASHBalance) => {
        const nextRewardValue = (stakingRebaseAmount ?? new Decimal(0)).mul(SBASHBalance);
        const wrappedTokenEquivalent = WSBASHBalance.mul(new Decimal((index ?? 0).toString()));

        const effectiveNextRewardValue = nextRewardValue.add((stakingRebaseAmount ?? new Decimal(0).div(10 ** 9) ?? new Decimal(0)).mul(wrappedTokenEquivalent));

        return {
            nextRewardValue: formatUSDFromDecimal(nextRewardValue.mul(marketPrice)),
            wrappedTokenValue: formatUSDFromDecimal(wrappedTokenEquivalent.mul((index ?? 0).toString()).mul(marketPrice), 2),
            effectiveNextRewardValue: formatUSDFromDecimal(effectiveNextRewardValue, 2),
        };
    },
);

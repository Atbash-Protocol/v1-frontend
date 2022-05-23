import Decimal from 'decimal.js';
import { ethers } from 'ethers';
import { createSelector } from 'reselect';

import { formatNumber, formatUSDFromDecimal } from 'helpers/price-units';
import { RootState } from 'store/store';

import { selectSBASHBalance, selectWSBASHBalance } from '../account/account.selectors';
import { selectDaiPrice, selectMarketPrice } from '../markets/markets.selectors';
import { selectStakingRebaseAmount, selectStakingReward } from '../metrics/metrics.selectors';

const selectIndex = (state: RootState) => state.main.staking.index;

export const selectFormattedIndex = (state: RootState): string | null => {
    const { index } = state.main.staking;

    if (!index) return null;

    const formattedIndex = Number(ethers.utils.formatUnits(index, 'gwei'));

    return `${formatNumber(formattedIndex, 2)} BASH`;
};

export const selectStakingBalance = createSelector(
    [selectWSBASHBalance, selectStakingReward, selectIndex, selectStakingRebaseAmount, selectDaiPrice, selectMarketPrice, selectSBASHBalance],
    (WSBASHBalance, stakingReward, index, stakingRebaseAmount, daiPrice, marketPrice, SBASHBalance) => {
        const nextRewardValue = (stakingRebaseAmount ?? new Decimal(0)).mul(SBASHBalance);
        const wrappedTokenEquivalent = WSBASHBalance.mul(new Decimal((index ?? 0).toString()));

        const effectiveNextRewardValue = nextRewardValue.add((stakingRebaseAmount ?? new Decimal(0)).mul(wrappedTokenEquivalent));

        return {
            nextRewardValue: formatUSDFromDecimal(nextRewardValue.mul(marketPrice)),
            wrappedTokenValue: formatUSDFromDecimal(wrappedTokenEquivalent.mul((index ?? 0).toString()).mul(marketPrice), 2),
            effectiveNextRewardValue: formatUSDFromDecimal(effectiveNextRewardValue, 2),
        };
    },
);

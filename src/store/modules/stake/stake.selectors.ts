import { ethers } from 'ethers';

import { formatNumber } from 'helpers/price-units';
import { RootState } from 'store/store';

import { calculateStakingRewards } from '../app/app.helpers';

export const selectFormattedIndex = (state: RootState): string | null => {
    const { index } = state.main.staking;

    if (!index) return null;

    const formattedIndex = Number(ethers.utils.formatUnits(index, 'gwei'));

    return `${formatNumber(formattedIndex, 2)} BASH`;
};

export const selectFormattedUserStakeMetrics = (state: RootState) => {
    const { index, epoch } = state.main.staking;
    const { circSupply, rawCircSupply } = state.main.metrics;

    if (epoch === null || circSupply === null || rawCircSupply === null || !index) return null;

    console.log('metrics', epoch, rawCircSupply, circSupply, index, state.accountNew.balances);

    // TODO: Revoir les calculs avec les bigNumber
    const stakingRebase = epoch.distribute.toNumber() / circSupply;
    const stakingRebasePercentage = stakingRebase * 100;

    // 1 / 2 * 3
    const nextRewardAmount = (epoch.distribute.toNumber() / rawCircSupply.toNumber()) * state.accountNew.balances.SBASH.toNumber();

    const effectiveNextRewardValue = nextRewardAmount * (state.accountNew.balances.WSBASH.toNumber() * index.toNumber()) + nextRewardAmount;
    // const effectiveNextRewardValue = epoch.distribute.div(rawCircSupply).mul(state.accountNew.balances.WSBASH.mul(index).add(nextRewardAmount));
    const { fiveDayRate } = calculateStakingRewards(epoch, circSupply);

    const wrappedTokenEquivalent = state.accountNew.balances.WSBASH.mul(index);
    return {
        stakingRebase,
        stakingRebasePercentage,
        nextRewardAmount,
        effectiveNextRewardValue,
        fiveDayRate,
        wrappedTokenEquivalent,
    };
};

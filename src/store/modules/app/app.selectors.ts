import Decimal from 'decimal.js';
import { BigNumber, ethers } from 'ethers';
import { pick } from 'lodash';
import { createSelector } from 'reselect';

import { formatUSD } from 'helpers/price-units';
import { IReduxState } from 'store/slices/state.interface';
import { RootState } from 'store/store';

import { calculateStakingRewards } from './app.helpers';
import { MainSliceState } from './app.types';

export const selectFormattedReservePrice = (state: RootState): string | null => {
    const { reserves } = state.main.metrics;
    const { dai } = state.markets.markets;

    if (!reserves || !dai) return null;

    const reservePrice = Number(ethers.utils.formatUnits(reserves, 'gwei')) * dai;

    return formatUSD(reservePrice, 2);
};

export const useContractLoaded = (state: RootState): boolean => {
    const { contracts } = state.main;

    return Object.values(contracts).every(contract => contract !== null);
};

export const useNextRebase = (state: RootState): number | undefined => {
    const {
        main: {
            staking: { epoch },
        },
    } = state;

    return epoch?.endTime;
};

export const useBlockchainInfos = (state: RootState): MainSliceState['blockchain'] => {
    return state.main.blockchain;
};

export const selectCirculatingSupply = (state: RootState) => state.main.metrics.circSupply;

//TODO: Move inside staking selectors
export const selectUserStakingInfos = createSelector(
    [
        (state: IReduxState) => {
            return {
                circSupply: state.main.metrics.circSupply,
                ...pick(state.main.staking, ['epoch', 'index']),
                ...pick(state.account.balances, ['SBASH', 'WSBASH']),
            };
        },
    ],
    ({ index, epoch, circSupply, SBASH, WSBASH }) => {
        let stakingRebase = new Decimal(0);

        const SBASHBalance: Decimal = new Decimal(SBASH.div(10 ** 9).toHexString());
        const WBASHBalance: Decimal = new Decimal(WSBASH.div(10 ** 9).toHexString());

        if (epoch?.distribute && circSupply) stakingRebase = new Decimal(epoch.distribute.toHexString()).div(new Decimal(circSupply).mul(10 ** 9));

        const nextRewardValue = stakingRebase.mul(SBASHBalance);
        const { fiveDayRate } = calculateStakingRewards(epoch, circSupply || 0);

        const effectiveNextRewardValue = nextRewardValue.add(stakingRebase.mul(WBASHBalance).mul((index ?? BigNumber.from(0)).toHexString()));
        const wrappedTokenEquivalent = WBASHBalance.mul(index?.toHexString() || 0);

        return {
            fiveDayRate: `${fiveDayRate && (fiveDayRate / 1000).toFixed(2)}  %`,
            stakingRebasePercentage: `${stakingRebase.mul(100).toFixed(2)} %`,
            nextRewardValue: `${nextRewardValue.toFixed(2)} BASH`,
            effectiveNextRewardValue: effectiveNextRewardValue ? `effectiveNextRewardValue wsBASH` : null,
            wrappedTokenEquivalent: `${wrappedTokenEquivalent?.toString() || 0} sBASH`,
            optionalMetrics: WBASHBalance.gt(0),
        };
    },
);

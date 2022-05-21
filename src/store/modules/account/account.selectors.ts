import Decimal from 'decimal.js';
import { utils } from 'ethers';
import { createSelector } from 'reselect';

import { RootState } from 'store/store';

export const selectBASHBalance = (state: RootState): Decimal => {
    const BASHAmount = state.account.balances.BASH; // 9 Decimals

    return new Decimal(BASHAmount.toString()).div(10 ** 9);
};

export const selectSBASHBalance = (state: RootState): Decimal => {
    const SBASHAmount = state.account.balances.SBASH; // 9 Decimals

    return new Decimal(SBASHAmount.toString()).div(10 ** 9);
};

export const selectWSBASHBalance = (state: RootState): Decimal => {
    const WSBASHAmount = state.account.balances.WSBASH;

    return new Decimal(WSBASHAmount.toString()).div(10 ** 9); // 9 Decimals
};

export const selectFormattedStakeBalance = createSelector([selectBASHBalance, selectSBASHBalance, selectWSBASHBalance], (BASHBalance, SBASHBalance, WSBASHBalance) => {
    return Object.entries({ BASH: BASHBalance, SBASH: SBASHBalance, WSBASH: WSBASHBalance }).reduce(
        (acc, [key, amount]) => {
            return {
                ...acc,
                [key]: [amount.toFixed(2), key.toLocaleUpperCase()].join(' '),
            };
        },
        {
            BASH: '0.00 BASH',
            SBASH: '0.00 SBASH',
            WSBASH: '0.00 WSBASH',
        },
    );
});

export const selectFormattedBASHBalance = (state: RootState): string => {
    const BASHAmount = state.account.balances.BASH; // 9 Decimals

    return [Number(utils.formatUnits(BASHAmount, 'gwei')).toFixed(2), 'BASH'].join(' ');
};

export const selectUserStakingAllowance = (state: RootState) => {
    const { BASH, SBASH } = state.account.stakingAllowance;

    return {
        BASHAllowanceNeeded: BASH.eq(0),
        SBASHAllowanceNeeded: SBASH.eq(0),
    };
};

export const selectAccountLoading = (state: RootState): boolean => state.account.loading;
